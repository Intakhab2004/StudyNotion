const BASE_URL = process.env.REACT_APP_BASE_URL || "https://studynotion-36mb.onrender.com/api/v1"

// Categories endpoints
export const categories = {
    CATEGORIES_API: BASE_URL + "/course/getAllCategories"
}

// Auth endpoints
export const auth = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
    SENDOTP_API: BASE_URL + "/auth/sendOTP",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASS_API: BASE_URL + "/auth/reset-password",
}

export const contact = {
    CONTACTUS_API: BASE_URL + "/contact/contact"
}

export const settings = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    UPDATE_PASSWORD_API: BASE_URL + "/auth/changepassword",
    DELETE_ACCOUNT_API: BASE_URL + "/profile/deleteProfile"
}

export const profile = {
    ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard"
}

export const course = {
    GET_INSTRUCTOR_COURSE_API: BASE_URL + "/course/getInstructorCourses",
    DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
    COURSE_CATEGORIES_API: BASE_URL + "/course/getAllCategories",
    EDIT_COURSE_API: BASE_URL + "/course/editCourse",
    CREATE_COURSE_API: BASE_URL + "/course/createCourse",
    UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
    CREATE_SECTION_API: BASE_URL + "/course/addSection",
    DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
    DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
    CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
    UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
    GET_FULL_COURSE_DETAILS_API: BASE_URL + "/course/getFullCourseDetails",
    COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
    CREATE_RATING_API: BASE_URL + "/course/createRating",
    LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress"

}

export const catalogData = {
    CATALOGPAGEDATA_API: BASE_URL + "/course/categoryPageDetails",
}

export const payment = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
    SEND_SUCCESS_PAYMENT_EMAIL_API: BASE_URL + "/payment/successfulPaymentEmail",
    VERIFY_SIGNATURE_API: BASE_URL + "/payment/verifySignature"
}

export const ratings = {
    REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews"
}