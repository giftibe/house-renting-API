const nodemailer = require("nodemailer");
const { EMAIL, APP_PASSWORD } = process.env;
const { MESSAGES } = require("../config/config.constant");

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
            // Email sent successfully
        } catch (error) {
            console.error(error);
            throw new Error(MESSAGES.USER.EMAIL_UNSENT + error);
        }

    } catch (error) {
        console.error(error);
        throw new Error(MESSAGES.USER.EMAIL_UNSENT + error);
    }
}

module.exports = Mailer