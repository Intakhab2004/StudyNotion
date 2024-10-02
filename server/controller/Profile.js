const User = require("../models/User");
const Profile = require("../models/Profile");
const {uplaodImageToCloudinary} = require("../utils/imageUploader");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/SecToDuration");
require("dotenv").config();


// Handler function for updating the profile
exports.updateProfile = async(req, res) => {
    try{
        // Fetching data from req.body
        const {firstName = "", lastName = "", gender = "", contactNumber = "", dateOfBirth = "", about = ""} = req.body
        const userId = req.user.id;

        // Fetching profile ID from user and updating the profile
        const userDetails = await User.findById(userId);
        const profileId = userDetails.additionalDetails;

        //Updating firstName and lastName in User schema
        userDetails.firstName = firstName;
        userDetails.lastName = lastName;
        await userDetails.save();

        const profileDetails = await Profile.findById(profileId);

        // Other way of updating entry in the DB
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        // Fetching the updatedUserDetails
        const updatedUserDetails = await User.findById(userId).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUserDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Profile updation failure, Please try again"
        })
    }
}


// Handler function for deleting the user
exports.deleteAccount = async(req, res) => {
    try{
        // Fetching the id of the user
        const id = req.user.id;

        // Validating the id
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found for this ID"
            })
        }

        // Deleting the profile related to this user
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // Updating the studentsEnrolled section from the course shema
        for(const courseId of userDetails.courses){
            await Course.findByIdAndUpdate(
                {_id: courseId},
                {$pull: {studentEnrolled: id}},
                {new: true}
            )
        }

        // Deleting the entry in the courseProgress
        await CourseProgress.deleteMany({userId: id});

        // Deleting the user
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "User account deleted successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in deleting the user",
            error: error.message
        })
    }
}


// Handler function for Updating the profile picture
exports.updateDisplayPicture = async(req, res) => {
    try{
        // Fetching the image of the user
        const newImage = req.files.image;

        // Validating the data
        if(!newImage){
            return res.status(402).json({
                success: false,
                message: "Please provide the image file"
            })
        }

        // Uploading it to cloudinary
        const response = await uplaodImageToCloudinary(newImage, process.env.FOLDER_NAME);
        console.log(response);

        // Updating the user details
        const userId = req.user.id;
        const updatedUserDetails = await User.findByIdAndUpdate(
                                                                {_id: userId},
                                                                {image: response.secure_url},
                                                                {new: true}
                                                            )
        return res.status(200).json({
            success: true,
            message: "Your profile picture has been updated successfully",
            data: updatedUserDetails
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occured in changing the profile picture",
            error: error.message
        })
    }
}


// Handler function for getting user details
exports.getUserDetails = async(req, res) => {
    try{
        // Fetching user id from req.user
        const userId = req.user.id;

        // Making the DB call for fetching the user details
        const userDetails = await User.findById(userId)
                                                      .populate("additionalDetails")
                                                      .exec();
        
        console.log(userDetails);

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userDetails
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching the details of the user",
            error: error.message
        })
    }
}


// Handler function for getting enrolled courses
exports.getEnrolledCourses = async(req, res) => {
    try{
        const userId = req.user.id
        let userDetails = await User.findOne({_id: userId})
                                                        .populate({
                                                                path: "courses",
                                                            populate: {
                                                            path: "courseContent",
                                                            populate: {
                                                                path: "subSection",
                                                            },
                                                            },
                                                        })
                                                        .exec()

        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j]
                                                                            .subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)

                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)

                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } 
            else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                                                        Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
            }
        }

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occured in getting the enrolled course details",
            error: error.message
        })
    }
}


// Handler function for instructor dashboard
exports.instructorDashboard = async(req, res) => {
    try{
        // Fetching all the course of the given instructor
        const instructorCourse = await Course.find({instructor: req.user.id})

        // Now Modify the instructorCourse array according to the details you required
        const courseDetails = instructorCourse.map((course) => {
            const totalStudentEnrolled = course.studentEnrolled.length;
            const totalAmountGenerated = course.price * totalStudentEnrolled;

            // creating new object which maps with instructorCourse array
            const details = {
                id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentEnrolled,
                totalAmountGenerated
            }

            return details;
        })

        return res.status(200).json({
            success: true,
            message: "Instructor dashboard fetched successfully",
            data: courseDetails
        })
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occured in getting the enrolled course details",
            error: error.message
        })
    }
}