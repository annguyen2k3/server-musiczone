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

async function wrapedSendMail(mailOptions) {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(false);
            } else {
                console.log("Email sent : " + info.response);
                resolve(true);
            }
        });
    });
}

module.exports.sendMail = async (email, subject, html) => {
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html,
    };

    let resp = await wrapedSendMail(mailOptions);

    return resp;
};
