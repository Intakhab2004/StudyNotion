// Importing the instance of express and initializing the router
const express = require("express");
const router = express.Router();

// Importing all the handler function
const {sendOTP, signUp, login, changePassword} = require("../controller/Auth");
const {resetPasswordToken, resetPassword} = require("../controller/ResetPassword")

// Importing middlewares
const {auth} = require("../middlewares/auth");

// Creating routes for different handler function
router.post("/sendOTP", sendOTP);

router.post("/signUp", signUp);

router.post("/login", login);

router.post("/changepassword", auth, changePassword);

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);


// Exporting the routes
module.exports = router;

