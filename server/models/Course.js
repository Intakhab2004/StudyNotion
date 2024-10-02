const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },

    courseDescription: {
        type: String
    },

    whatYouLearn: {
        type: String
    },

    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    }],

    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    price: {
        type: Number
    },

    thumbnail: {
        type: String
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    tag: {
        type: [String],
        required: true
    },

    ratingReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingReviews"
    }],

    instructions: {
        type: [String]
    },

    status: {
        type: String,
        enum: ["Draft", "Published"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Course", courseSchema);