const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth
exports.auth = async (req, res, next) => {
    try{
        // Fetching token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // Validating the token
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        // Verifying the token
        try{
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(verifiedToken);
            req.user = verifiedToken;
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the token"
        })
    }
}


// isStudent
exports.isStudent = async(req, res, next) => {
    try{
        if(req.user.userType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Students only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, Please try again later"
        })
    }
}


// isInstructor
exports.isInstructor = async(req, res, next) => {
    try{
        if(req.user.userType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Instructors only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, Please try again later"
        })
    }
}


// isAdmin
exports.isAdmin = async(req, res, next) => {
    try{
        if(req.user.userType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Admins only"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, Please try again later"
        })
    }
}


