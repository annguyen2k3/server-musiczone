const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    console.log(email);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html,
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error("Failed to send email:", err.message);
            console.log(err);
        } else {
            console.log("Email send: " + info.response);
        }
    });
};
