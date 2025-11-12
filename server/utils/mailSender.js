// const nodeMailer = require("nodemailer");
// require("dotenv").config();

// const mailSender = async (email, title, body) => {
//     try{
//         let transporter = nodeMailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS
//             }
//         })

//         let info = transporter.sendMail({
//             from: "StudyNotion by Intakhab Alam",
//             to: `${email}`,
//             subject: `${title}`,
//             html: `${body}`
//         })

//         console.log(info);
//         return info;
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }

// module.exports = mailSender;



const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
    try{
        const { data, error } = await resend.emails.send({
            from: "StudyNotion <onboarding@resend.dev>",
            to: email,
            subject: title,
            html: body,
        });

        if(error){
            console.error("Resend Error:", error);
            return null;
        }

        console.log("Email sent successfully:", data);
        return data;
    } 
    catch(error){
        console.error("Mail sending failed:", error.message);
        return null;
    }
};

module.exports = mailSender;
