const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const validator = require("validator");
const optGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();


// sendOTP controller
exports.sendOTP = async (req, res) => {
    try{

        // fetching data from req.body
        const {email} = req.body;

        // Validating the correct email
        if(!validator.isEmail(email) || !email){
            return res.status(401).json({
                success: false,
                message: "Please enter valid email"
            })
        }

        // Checking if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }

        // Generate OTP
        let otp = optGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        console.log("OTP generated", otp);

        // Checking for unique otp
        let result = await OTP.findOne({otp: otp});
        while(result){
            otp = optGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({otp: otp})
        }

        // Crating entry in the database
        const data = await OTP.create({email, otp});
        console.log(data);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// signUp controller
exports.signUp = async (req, res) => {
    try{
        // Fetching data from req.body
        const {firstName, lastName, email, password, confirmPassword, userType, contactNumber, otp} = req.body;

        // Validating the data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are mendatory"
            })
        }

        // Validating the format of email
        if(!validator.isEmail(email)){
            return res.status(401).json({
                success: false,
                message: "Please enter valid email"
            })
        }

        // Checking the two password is matching or not
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password value does not match, Please try again."
            })
        }

        //Checking if the user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists, Please sign in to continue"
            })
        }

        // Finding the most recent OTP from the database
        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("Recent OTP is", recentOTP);

        // Validating the OTP
        if(!recentOTP.length){
            return res.status(400).json({
                success: false,
                message: "OTP not found or expires for the given email address"
            })
        }

        else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Creating entry in the database
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType: userType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: ""
        })

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in registering",
            error,
        })
    }
}


// login controller
exports.login = async (req, res) => {
    try{
        // Fetching data from req.body
        const {email, password} = req.body;

        //validating the input given by the user
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter all the details"
            })
        }

        if(!validator.isEmail(email)){
            return res.status(401).json({
                success: false,
                message: "Please enter valid email address"
            })
        }


        // Checking if the user exists or not
        const existingUser = await User.findOne({email}).populate("additionalDetails");
        if(!existingUser){
            return res.status(401).json({
                success: false,
                message: "User is not Registered with Us Please SignUp to Continue"
            })
        }

        // Matching the password
        if(!await bcrypt.compare(password, existingUser.password)){
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            })
        }

        // Generating JWT token
        const payload = {
            email: existingUser.email,
            id: existingUser._id,
            userType: existingUser.userType
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "24h"});
        existingUser.token = token;
        existingUser.password = undefined;

        // Creating cookie and send response
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            existingUser,
            message: "User logged in successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, Please try again later"
        })
    }
}


// Change password
exports.changePassword = async (req, res) => {
    try{
        // Fetching data from req.body
        const {oldPassword, newPassword} = req.body;

        //Fetching user from DB
        const userDetails = await User.findById(req.user.id);
        
        // Validating the password
        if(!await bcrypt.compare(oldPassword, userDetails.password)){
            return res.status(401).json({
                success: false,
                message: "Incorrect previous password"
            })
        }

        // Hashing the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Updating the password in the DB
        await User.findByIdAndUpdate(
            {_id: req.user.id},
            {password: hashedPassword},
            {new: true}
        )
        
        // Sending mail to the user
        try{
            await mailSender(
                userDetails.email,  
                "Password updated successfully", 
                 passwordUpdated(userDetails.email, `${userDetails.firstName} ${userDetails.lastName}`)
               )
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong in updating the password"
        })
    }
}

