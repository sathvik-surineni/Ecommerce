const nodemailer = require('nodemailer');

const transport =nodemailer.createTransport({
   host:"smtp.ethereal.email",
    port:587,
    secure:false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME, // Sender address
            to:options.email, // List of recipients
            subject:options.subject, // Subject line
            html:options.message, // Plain text body
        };
        const info = await transport.sendMail(mailOptions);
        console.log(info);
    } catch (error) {
        console.log(error);
        return new Error("Error sending message")
    }
}

module.exports = sendEmail;
