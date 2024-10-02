const mailSender = require("../utils/mailSender");
const {contactUsEmail} = require("../mail/templates/contactFormRes");


exports.contactUs = async(req, res) => {
    try{
        const {firstName, lastName, email, phoneNumber, message} = req.body;

        // Sending mail to the user
        const mailResponse = await mailSender(
                                                email,
                                                "Message received successfully",
                                                contactUsEmail(email, firstName, lastName, message, phoneNumber)
                                            );

        if(!mailResponse){
            return res.status(401).json({
                success: false,
                message: "Your message haven't received by the team, Please try again"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Your message received successfully",
            data: mailResponse
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong in sending contact us message mail",
            error: error.message
        })
    }
}