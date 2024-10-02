const Category = require("../models/Category");

// Function for generating random integer
const getRandomInt = (max) => {
    return Math.floor(Math.random()*max)
}
// Crate Category handler function
exports.createCategory = async (req, res) => {
    try{
        // Fetching data from req.body
        const {name, description} = req.body;

        // Validating the data
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Creating entry in DB
        const categoryData = await Category.create({name, description});
        console.log(categoryData);

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in creating the category"
        })
    }
}


// Get all categories handler function
exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find({});

        if(!categories){
            return res.status(402).json({
                success: false,
                message: "No categories found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Categories data fetched successfully",
            data: categories
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching the categories data",
            error: error.message
        })
    }
}


// Handler function for categoryPageDetails
exports.categoryPageDetails = async(req, res) => {
    try{
        const {categoryId} = req.body;

        // getting course for specified category
        const specifiedCategory = await Category.findById(categoryId)
                                                                    .populate({
                                                                        path: "course",
                                                                        populate: {path: "ratingReviews"}
                                                                    })
                                                                    .exec();
                                                            
        // Validation
        if(!specifiedCategory){
            return res.status(404).json({
                success: flase,
                message: "Data not found"
            })
        }

        // Validating if there is no course available in the category
        if(specifiedCategory.course.length === 0){
            return res.status(404).json({
                success: false,
                message: "No course available for the selected category"
            })
        }

        // Getting other courses
        const otherCategory = await Category.find({_id: {$ne: categoryId}})

        // Here we have select one category from otherCategory array
        const otherCategoryCourse = await Category.findOne(otherCategory[getRandomInt(otherCategory.length)]._id)
                                                                                                .populate({
                                                                                                    path: "course",
                                                                                                    populate: {path: "ratingReviews"}
                                                                                                })
                                                                                                .exec();

        // Getting top selling course
        // --> Fetching all categories first
        const allCategories = await Category.find()
                                                  .populate({
                                                        path: "course",
                                                        match: {status: "Published"},
                                                        populate: {path: "instructor"}
                                                  }).exec();

        // --> Now use flatmap(filter and make the nested array into single array) function on the allCategories array to get course array
        const filteredCourses = allCategories.flatMap((category) => category.course);

        // --> Now we use sort function to sort the course array on the basis of selling
        const topSellingCourses = filteredCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);


        return res.status(200).json({
            success: true,
            message: "All course is fetched",
            data: {
                specifiedCategory,
                otherCategoryCourse,
                topSellingCourses
            }
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in fetching the category page details",
            error: error.message
        })
    }
}