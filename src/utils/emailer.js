const nodemailer = require("nodemailer");
const { EMAIL, APP_PASSWORD } = process.env;
const { MESSAGES } = require("../config/config.constant");
const path = require('path')


Mailer = async (subject, template, email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "yahoo",
            auth: {
                user: EMAIL,
                pass: APP_PASSWORD,
            },
        });

        // setup e-mail data with unicode symbols
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: subject,
            html: template
        };

        // Sending the email
        try {
            await transporter.sendMail(mailOptions);
            console.log('email sent')
            // Email sent successfully
        } catch (error) {
            return {
                message: 'MESSAGES.USER.EMAIL_UNSENT' + error,
                success: false,
            };
        }

    } catch (error) {
        return {
            message: 'MESSAGES.USER.EMAIL_UNSENT' + error,
            success: false,
        };
    }
}

module.exports = Mailer