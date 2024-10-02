const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");


// Handler function for creating the section
exports.createSection = async (req, res) => {
    try{
        // Fetching data from req.body
        const {sectionName, courseId} = req.body;

        // Validating the data 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please fill all the required details"
            })
        }

        // Creating entry in the database
        const newSection = await Section.create({sectionName});

        // Adding the section to the Course or updating the Course
        const currentCourse = await Course.findByIdAndUpdate(
            {_id: courseId},
            {$push: {courseContent: newSection._id}},
            {new: true}
        ).populate(
                    {
                        path: "courseContent",
                        populate: {path: "subSection"}
                    }
                  ).exec();


        return res.status(200).json({
            success: true,
            message: "New Section created successfully",
            currentCourse
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the section",
            error: error.message
        })
    }
}


// Handler function for updating the section
exports.updateSection = async (req, res) => {
    try{
        // Fetch data from req.body
        const {sectionName, sectionId, courseId} = req.body;

        // validating the data
        if(!sectionName){
            return res.status(401).json({
                success: false,
                message: "Please fill all the required details"
            })
        }

        // updating the section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {sectionName: sectionName},
            {new: true}
        )

        // Fetching the details of updated course
        const updatedCourse = await Course.findById(courseId)
                                                            .populate({
                                                                path: "courseContent",
                                                                populate: {path: "subSection"}
                                                            })
                                                            .exec();

        return res.status(200).json({
            success: true,
            message: "Section details updated successfully",
            data: updatedCourse,
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Updating section details fails, Please try again",
            error: error.message
        })
    }
}


// handler function for deleting the section
exports.deleteSection = async (req, res) => {
    try{
        const {sectionId, courseId} = req.body;

        // TODO: [Testing] = Do we need to delete the section from the course schema ?? Yes
        await Course.findByIdAndUpdate(
                                            {_id: courseId},
                                            {$pull: {courseContent: sectionId}},
                                            {new: true}
                                        )
            
        // Deleting all the subsection from the section
        const section = Section.findById(sectionId);
        if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

        await SubSection.deleteMany({_id: {$in: section.subSection}})

        // Delete the section
        await Section.findByIdAndDelete(sectionId);

        // Fetching the updated course details
        const course = await Course.findById(courseId)
                                                    .populate({
                                                        path: "courseContent",
                                                        populate: {path: "subSection"}
                                                    })
                                                    .exec();
        
        return res.status(200).json({
            success: true, 
            message: "Section deleted successfully",
            data: course
        })


    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Deleting section fails, Please try again",
            error: error.message
        })
    }
}