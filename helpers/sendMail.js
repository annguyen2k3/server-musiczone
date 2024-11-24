const nodemailer = require("nodemailer");

// module.exports.sendMail = async (email, subject, html) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: subject,
//         html: html,
//     };

//     await transporter.sendMail(mailOptions, function (err, info) {
//         if (err) {
//             console.error("Failed to send email:", err.message);
//             console.log(err);
//         } else {
//             console.log("Email send: " + info.response);
//         }
//     });
// };

module.exports.sendMail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: "Hello world?", // plain text body
            html: html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
};
