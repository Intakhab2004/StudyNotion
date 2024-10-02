const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require("../models/Course");


// Handler function for updating the course progress
exports.updateCourseProgress = async(req, res) => {
    try{
        const {courseId , subSectionId} = req.body;
        const userId = req.user.id;

        // validating the details
        if(!courseId || !subSectionId){
            return res.status(400).json({
                success: false,
                message: "Please fill the required section"
            })
        }

        // Checking if the subSection is available or not
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            }) 
        }

        // Fetching the courseProgress to update
        const courseProgress = await CourseProgress.findOne({courseID: courseId, userId: userId});

        // Checking if the courseProgress is available or not
        if(!courseProgress){
            return res.status(404).json({
                success: false,
                message: "CourseProgress not found for the given Ids"
            })
        }

        // Checking if the user already completed the subSection
        if(courseProgress.completedVideos.includes(subSectionId)){
            return res.status(400).json({
                success: false,
                message: "The video is already completed"
            })
        }

        // Update the courseProgress
        courseProgress.completedVideos.push(subSectionId);
        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Course Progress updated successfully",
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the courseProgress",
            error: error.message
        })
    }
}