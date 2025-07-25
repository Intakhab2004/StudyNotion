const nodeMailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
    try{
        let transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = transporter.sendMail({
            from: "StudyNotion by Intakhab Alam",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log(info);
        return info;
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;