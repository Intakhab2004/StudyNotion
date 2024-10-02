const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },

    userType: {
        type: String,
        enum: ["Student", "Instructor", "Admin"],
        required: true,
    },

    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },

    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }],

    image: {
        type: String,
    },

    token: {
        type: String
    },

    expirationTime:{
        type: Date
    },

    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress"
    }],

    active: {
        type: Boolean,
        default: true
    },

    approved: {
        type: Boolean,
        default: true
    }
},
{timestamps: true}
)

module.exports = mongoose.model("User", userSchema);