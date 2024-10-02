const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*5
    }

})

const sendVerificationEmail = async (email, otp) => {
    try{
        const mailResponse = await mailSender(
                                                email, 
                                                "Verification email from StudyNotion", 
                                                emailTemplate(otp)
                                             );
        console.log("Email sent successfully", mailResponse.response);
    }
    catch(error){
        console.log("Something went wrong in sending the email", error);
        throw error;
    }
}


OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})


module.exports = mongoose.model("OTP", OTPSchema);