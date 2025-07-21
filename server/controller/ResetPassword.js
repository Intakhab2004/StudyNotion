const User = require("../models/User");
const validator = require("validator");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");


// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try{
        // Fetching data from req.body
        const {email} = req.body;

        // Validating the given email
        if(!email || !validator.isEmail(email)){
            return res.status(401).json({
                success: false,
                message: "Please enter a valid email first"
            })
        }

        // Check for existing user
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                success: false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email`
            })
        }

        // Generating token and adding token and expiration time to user
        const token = crypto.randomUUID();
        const updatedDetails = await User.findOneAndUpdate({email: email}, 
                                                            {
                                                            token: token,
                                                            expirationTime: Date.now() + 5*60*1000
                                                            },
                                                            {new: true});
                                                        
        // Create url
        const url = `http://localhost:3000/update-password/${token}`;

        // sending mail containing the url
        await mailSender(email, 
                        "Password reset link", 
                        `Your Link for email verification is ${url}. Please click this url to reset your password.`
                    );

        // returning the response
        return res.status(200).json({
            success: true,
            message: "Email Sent Successfully, Please Check Your Email to Continue Further"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in reset link in the mail"
        })
    }
}


// resetPassword
exports.resetPassword = async (req, res) => {
    try{
        // Fetching data from req.body
        const {password, confirmPassword, token} = req.body

        //Validating the password and confirmPassword
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password and ConfirmPassword is not matching"
            })
        }

        // Finding user by token
        const userDetails = await User.findOne({token});

        // Validating the user
        if(!userDetails){
            return res.status(402).json({
                success: false,
                message: "Token is invalid"
            })
        }

        // Checking if the token is expires or not
        if(userDetails.expirationTime < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token is expired, Please regenerate new token"
            })
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // updating the password in the DB
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong in reseting the password"
        })
    }
}