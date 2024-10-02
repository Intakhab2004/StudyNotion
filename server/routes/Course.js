const express = require("express");
const router = express.Router();

const { auth, isInstructor, isAdmin, isStudent } = require("../middlewares/auth");

// Creating routes for Course related handler function
const {createCourse, 
       getFullCourseDetails,
       getCourseDetails, 
       showAllCourses, 
       getInstructorCourses, 
       deleteCourse, 
       editCourse} = require("../controller/Course");

router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/getAllCourse", showAllCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);  // For authorised user
router.post("/getCourseDetails", getCourseDetails);                // For unauthorised user
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)

// Creating route for CourseProgress handler function
const {updateCourseProgress} = require("../controller/CourseProgress");
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Creating routes for Section handler function
const {createSection, updateSection, deleteSection} = require("../controller/Section");
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Creating routes for SubSection handler function
const {createSubSection, deleteSubSection, updateSubSection} = require("../controller/SubSection");
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Creating routes for Categories handler function
const {createCategory, getAllCategories, categoryPageDetails} = require("../controller/Categories");
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/getAllCategories", getAllCategories);
router.post("/categoryPageDetails", categoryPageDetails)

// Creating routes for Rating and Reviews
const {createRating, getAllRating, getAverageRating} = require("../controller/RatingAndReviews")
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);


module.exports = router;