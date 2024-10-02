const express = require("express");
const router = express.Router();

const {updateProfile,
       deleteAccount,
       updateDisplayPicture, 
       getUserDetails, 
       instructorDashboard, 
       getEnrolledCourses} = require("../controller/Profile");

const { auth, isInstructor } = require("../middlewares/auth");

router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/getUserDetails", auth, getUserDetails);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
