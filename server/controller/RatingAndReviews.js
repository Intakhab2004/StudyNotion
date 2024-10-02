const RatingReviews = require("../models/RatingReviews");
const Course = require("../models/Course");
const mongoose = require("mongoose");


// Handler funtion for create ratingAndReviews
exports.createRating = async(req, res) => {
    try{
        // Fetchig data from req.body
        const {rating, reviews, courseId} = req.body;
        const userId = req.user.id;

        // validating the data
        if(!rating || !reviews || !courseId){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Checking if the user enrolled or not
        const courseDetails = await Course.findOne({
                                                        _id: courseId,
                                                        studentEnrolled: {$elemMatch: {$eq: userId}}
                                                    });
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "You are not valid user to give rating and reviews, Please enroll in the course first"
            })
        }

        // Checking if the user already gave rating and reviews
        const ratingReviewsDetails = await RatingReviews.findOne({user: userId, course: courseId});
        if(ratingReviewsDetails){
            return res.status(402).json({
                success: false,
                message: "You rated and reviewed already in this course"
            })
        }

        // Creating rating and reviews
        const newRatingReviews = await RatingReviews.create({rating, reviews, course: courseId, user: userId});

        // Updating the course
        const updatedCourse = await Course.findByIdAndUpdate(
                                                                {_id: courseId},
                                                                {$push: {ratingReviews: newRatingReviews._id}},
                                                                {new: true}
                                                            )
        
        console.log(updatedCourse);

        return res.status(200).json({
            success: true,
            message: "Rating and Reviews are created successfully",
            data: newRatingReviews
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in making the reviews",
            error: error.message
        })
    }
}


// Handler function for average rating 
exports.getAverageRating = async(req, res) => {
    try{
        // Fetching courseId
        const {courseId} = req.body;

        // Calculate avg. rating
        const result = await RatingReviews.aggregate([
            {
                $match: {course: mongoose.Types.ObjectId(courseId)}
            },
            {
                $group: {
                    _id: null,
                    averageRating: {$avg: "$rating"}
                }
            }
        ]);

        // return reating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        // If no rating and reviews exists
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no rating given till now",
            averageRating: 0
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching average rating",
            error: error.message
        })
    }
}


// Handler function for get all rating
exports.getAllRating = async(req, res) => {
    try{
        const allReviews = await RatingReviews.find({})
                                                        .sort({rating: "desc"})
                                                        .populate({
                                                            path: "user",
                                                            select: "firstName lastName email image"
                                                        })
                                                        .populate({
                                                            path: "course",
                                                            select: "courseName"
                                                        })
                                                        .exec();
                    
        return res.status(200).json({
            success: true,
            message: "All rating and reviews are fetched successfully",
            data: allReviews
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching all rating details",
            error: error.message
        })
    }
}