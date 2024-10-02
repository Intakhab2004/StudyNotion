const mongoose = require("mongoose");
const {instance} = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress");
const crypto = require("crypto");


// Capture the paymanet or Initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    // Fetching the userId and courseId
    const {courses} = req.body;
    const userId = req.user.id;

    // Validating the details
    if(courses.length === 0){
        return res.status(402).json({
            success: false,
            message: "Please select the course first"
        })
    }

    // Verifying if the course for the given id is available or not
    let totalAmount = 0;
    for(const courseId of courses){
        let course
        try{
            course = await Course.findById(courseId);

            // Validating if the course is available for the given id
            if(!course){
                return res.status(404).json({
                    success: false,
                    message: `Course not found for the given id ${courseId}`
                })
            }

            // Verifying if the user already purchase the course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)){
                return res.status(401).json({
                    success: false,
                    message: "Student is already enrolled"
                })
            }

            // Adding the price of the courses
            totalAmount += course.price;
        }

        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    //Creating order
    const options = {
        amount: totalAmount*100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseIds: courses,
            userId: userId
        }
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            data: paymentResponse
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
            error: error.message
        })
    }
}


// Verifying secret key or signature of the Razorpay and the server
exports.verifySignature = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses 

    const userId = req.user.id;

    // Validating the data
    if(!razorpay_order_id || !razorpay_payment_id || 
        !razorpay_signature || !courses)
    {
            return res.status(200).json({
                success: false,
                message: "Payment failed"
            })
    }

    // Encryting the sever's signature or webHookSecret
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                                                                    .update(body.toString())
                                                                                    .digest("hex");

    // Comparing the two encrypted string
    if(expectedSignature === razorpay_signature){
        await enrollStudents(courses, userId, res)
        return res.status(200).json({
            success: true,
            message: "Payment verified"
        })
    }

    return res.status(401).json({
        success: false,
        message: "Payment failed"
    })

}
// Handler function for sending notification mail
exports.successfulPaymentEmail = async (req,res) => {
    try{
        const { orderId, paymentId, amount } = req.body
        const userId = req.user.id

        // Validating the data
        if(!orderId || !paymentId || !amount || !userId){
            return res.status(401).json({
                success: false,
                message: "Please provide all the details"
            })
        }

        const enrolledStudent = await User.findById(userId)

        await mailSender(enrolledStudent.email, `Payment Received`,
                                                                    paymentSuccessEmail(
                                                                        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                                                                        amount / 100,
                                                                        orderId,
                                                                        paymentId
                                                                    )
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(400).json({
            seccess: false,
            message: "Something went wrong in sending mail",
            error: error.message
        })
    }
}


// Handler function for enrolling students in the course
const enrollStudents = async(courses, userId, res) => {
    try{
        if(!courses || !userId){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details"
            })
        }

        for(const courseId of courses){
            const enrolledCourses = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentEnrolled: userId}},
                {new: true}
            )

            if(!enrolledCourses){
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                })
            }

            console.log("Updated course: ", enrolledCourses)

            // Creating the entry in the courseProgress schema
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })

            // Find the student and add the course to their list of enrolled courses
            const userDetails = await User.findByIdAndUpdate(
                {_id: userId},
                {$push: {courses: courseId, courseProgress: courseProgress._id}},
                {new: true}
            )

            // Sending email notification
            await mailSender(userDetails.email, `Successfully Enrolled into ${enrolledCourses.courseName}`,
                courseEnrollmentEmail(enrolledCourses.courseName,
                                            `${userDetails.firstName} ${userDetails.lastName}`
                                            )
            )
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error ooccured while enrolling the student",
            error: error.message
        })
    }
}