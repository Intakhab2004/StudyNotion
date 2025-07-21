const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uplaodImageToCloudinary} = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/secConversion");
require("dotenv").config();

// Create Course handler function
exports.createCourse = async(req, res) => {
    try{
        // Fetching data from req.body
        let {courseName, courseDescription, whatYouLearn, price, category, tag, status, instructions} = req.body;

        // Fetching thumbnail from req.files
        const thumbnail = req.files.thumbnailImage;

        // Validating the fetched data
        if(!courseName || !courseDescription || !whatYouLearn || !price || !category || !thumbnail || !tag || !instructions){
            return res.status(400).json({
                success: false,
                message: "Please fill all the required details"
            })
        }

        if(!status){
            status = "Draft"
        }

        // Fetching the details of the instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor details is ", instructorDetails);

        if(!instructorDetails){
            return res.status(401).json({
                success: false,
                message: "Instructor not found in the Database"
            })
        }

        // Checking for category
        const validCategory = Category.findById(category)
        if(!validCategory){
            return res.status(401).json({
                success: false,
                message: "The given category is not available"
            })
        }

        // Uploading image to cloudinary
        const thumbnailImage = await uplaodImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // Creating entry of new course in the database
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouLearn,
            price,
            category,
            tag,
            status,
            instructions,
            thumbnail: thumbnailImage.secure_url
        })

        // Adding the created course in the instructor(User)
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {$push: {courses: newCourse._id}},
            {new: true}
        )

        // Update the Category schema
        await Category.findByIdAndUpdate(
            {_id: category},
            {$push: {course: newCourse._id}},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "New course created successfully",
            data: newCourse
        })

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in creating new course"
        })
    }
}


// Handler function for editing the course
exports.editCourse = async(req, res) => {
    try{
        const { courseId } = req.body
        const updates = req.body
        const course = await Course.findById(courseId)

        // Validating the data
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        // If thumbnail image is given then update it
        if(req.files){
            const thumbnail = req.files.thumbnailImage
            const uploadThumbnail = await uplaodImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

            course.thumbnail = uploadThumbnail.secure_url;
        }

        // Only update those fields which is given in req.body
        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                course[key] = updates[key]
            }
        }

        await course.save();

        // Getting the updatedCourse details
        const updatedCourse = await Course.findById(courseId)
                                                            .populate({
                                                                        path: "courseContent",
                                                                        populate: {path: "subSection"}
                                                            })
                                                            .populate({
                                                                        path: "instructor",
                                                                        populate: {path: "additionalDetails"}
                                                            })
                                                            .populate("category")
                                                            .populate("ratingReviews")
                                                            .exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in creating new course"
        })
    }
}


// GetAllCourse handler function
exports.showAllCourses = async(req, res) => {
    try{
        const allCourses = await Course.find({});

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses
        })
    }
    catch(error){
        console.log(message.error);
        return res.status(500).json({
            success: true,
            message: "Cannot fetch course data"
        })
    }
}


// Handler function for getting the entire details of the course by authorised user
exports.getFullCourseDetails = async(req, res) => {
    try{
        // Fetching the course ID from req.body
        const {courseId} = req.body;
        const userId = req.user.id;

        // Getting the course details
        const courseDetails = await Course.findOne({_id: courseId})
        .populate({
                                                                        path: "courseContent",
                                                                        populate: {path: "subSection"}
                                                            })
                                                            .populate({
                                                                        path: "instructor",
                                                                        populate: {path: "additionalDetails"}
                                                            })
                                                            .populate("category")
                                                            .populate("ratingReviews")
                                                            .exec();
                                                            
        // Fetching the courseProgress details
        const courseProgressDetails = await CourseProgress.findOne({courseID: courseId, userId: userId});
        console.log("CourseProgressDetails : ", courseDetails);

        // Validating the courseDetails
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        // Finding the time duration of course in seconds
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const durationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += durationInSeconds;
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            message: "Course details received successfully",
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressDetails.completedVideos ? courseProgressDetails.completedVideos : []
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching the details",
            error: error.message
        })
    }
}
// Handler function for getting the entire details of the course by unauthorised user
exports.getCourseDetails = async(req, res) => {
    try{
        // Fetching the course ID from req.body
        const {courseId} = req.body;

        // Getting the course details
        const courseDetails = await Course.findById(courseId)
                                                            .populate({
                                                                        path: "courseContent",
                                                                        populate: {path: "subSection"}
                                                            })
                                                            .populate({
                                                                        path: "instructor",
                                                                        populate: {path: "additionalDetails"}
                                                            })
                                                            .populate("category")
                                                            .populate("ratingReviews")
                                                            .exec();
        

        // Validating the courseDetails
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`
            })
        }

        // Finding the time duration of course in seconds
        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                const durationInSeconds = parseInt(subSection.timeDuration);
                totalDurationInSeconds += durationInSeconds;
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
            success: true,
            message: "Course details received successfully",
            data: { courseDetails,
                    totalDuration
                  }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching the details",
            error: error.message
        })
    }
}


// Handler function for deleting the course
exports.deleteCourse = async(req, res) => {
    try{
        const {courseId} = req.body;

        // Validating the course
        const courseDetails = await Course.findById(courseId);
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Course not found for the given id"
            })
        }

        // Unenroll the students from the course
        const enrolledStudents = courseDetails.studentEnrolled;
        for(const studentId of enrolledStudents){
            await User.findByIdAndUpdate(
                {_id: studentId},
                {$pull: {courses: courseId}},
                {new: true}
            )
        }

        // Deleting the section and subSection
        const courseSection = courseDetails.courseContent;
        for(const sectionId of courseSection){
            const section = await Section.findById(sectionId);
            if(section){
                const subSections = section.subSection;
                for(const subSectionId of subSections){
                    await SubSection.findByIdAndDelete(subSectionId);
                }
            }
            await Section.findByIdAndDelete(sectionId);
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Something went wrong in deleting the course",
            error: error.message
        })
    }
}


// Handler function for fetching instructor course
exports.getInstructorCourses = async(req, res) => {
    try{
        const instructorId = req.user.id;

        // Fetching all the course of instructor
        const instructorCourses = await Course.find({instructor: instructorId})
                                              .sort({createdAt: -1})
                                              .populate({path: "courseContent",
                                                populate: {path: "subSection"}
                                              }).exec();

        return res.status(200).json({
            success: true,
            message: "Instructor course fetched successfully",
            data: instructorCourses
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Something went wrong in deleting the course",
            error: error.message
        })
    }
}