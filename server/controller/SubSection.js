const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uplaodImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


// Handler function for creating the SubSection
exports.createSubSection = async(req, res) => {
    try{
        // Fetching the data from req.body
        const {title, description, sectionId} = req.body

        // Fetching video from req.files
        const video = req.files.videoFile

        // Validating the data 
        if(!title || !description || !video || !sectionId){
            return res.status(404).json({
                success: false,
                message: "Please fill all the required details"
            })
        }

        // Uploading video to cloudinary
        const uploadedVideo = await uplaodImageToCloudinary(video, process.env.FOLDER_NAME);

        // Create entry of subSection in the DB
        const newSubSection = await SubSection.create({title, 
                                                       description, 
                                                       timeDuration: uploadedVideo.duration, 
                                                       videoURL: uploadedVideo.secure_url
                                                    });

        // Adding it to the section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {$push: {subSection: newSubSection._id}},
            {new: true}
        ).populate("subSection").exec();

        return res.status(200).json({
            success: true,
            message: "Sub section created successfully",
            data: updatedSection
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the sub-section",
            error: error.message
        })
    }
}


// Handler function for updating the subSection
exports.updateSubSection = async (req, res) => {
    try{
        // Fetch data from req.body
        const {title, description, subSectionId, sectionId} = req.body

        // validating the data
        const subSection = await SubSection.findById(subSectionId);
        if(!subSection){
            return res.status(404).json({
                success: false,
                message: "Sub Section not found for the given ID"
            })
        }

        if(title !== undefined){
            subSection.title = title;
        }

        if(description !== undefined){
            subSection.description = description;
        }

        if(req.files && req.files.videoFile !== undefined){
            const video = req.files.videoFile;
            const uploadedVideo = await uplaodImageToCloudinary(video, process.env.FOLDER_NAME);

            subSection.videoURL = uploadedVideo.secure_url;
            subSection.timeDuration = uploadedVideo.duration;
        }

        // updating the subSection
        const updatedSubSection = await subSection.save();

        // Fetching updated section
        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.status(200).json({
            success: true,
            message: "Sub-Section details updated successfully",
            data: updatedSection,
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
            error: error.message
        })
    }
}


// Handler function for deleting the Sub-section
exports.deleteSubSection = async (req, res) => {
    try{
        const {sectionId, subSectionId} = req.body

        // TODO: [Testing] = Do we need to delete the subSection from the section schema ??  Yes
        await Section.findByIdAndUpdate(
                                            {_id: sectionId},
                                            {$pull: {subSection: subSectionId}},
                                            {new: true}
                                        )

        // Delete the subSection
        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

        if(!deletedSubSection){
            return res.status(404).json({
                success: false,
                message: "Sub Section not found"
            })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.status(200).json({
            success: true, 
            message: "Sub-Section deleted successfully",
            data: updatedSection
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Deleting subSection failed, Please try again",
            error: error.message
        })
    }
}


