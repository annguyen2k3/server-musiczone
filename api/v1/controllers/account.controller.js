const md5 = require("md5");

const Account = require("../models/account.model");
const User = require("../models/user.model");
const OTPAccEmail = require("../models/otpAccEmail.model");

const generateHelpers = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

// [POST] /account/register/email
module.exports.register = async (req, res) => {
    req.body.password = md5(req.body.password);

    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    const existEmail = await Account.findOne({
        email: email,
        type: "email",
        deleted: false,
    });

    if (existEmail) {
        res.json({
            code: 400,
            err: "email",
            message: "Email đã tồn tại!",
        });
    } else {
        const otp = generateHelpers.generateRandomNumber(4);

        const timeExpire = 5;

        const objectCreAccByEmail = {
            email: email,
            userName: userName,
            password: password,
            otp: otp,
            expireAt: Date.now() + timeExpire * 60 * 1000,
        };

        const creAccByEmail = new OTPAccEmail(objectCreAccByEmail);
        await creAccByEmail.save();

        //Gửi OTP qua mail user
        const subject = "MusicZone: Mã OTP xác minh gmail";
        const html = `
            Mã OTP xác minh gmail của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
            Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
        `;

        sendMailHelper.sendMail(email, subject, html);

        res.json({
            code: 200,
            message: "Đã gửi OTP qua email!",
        });
    }
};

// [POST] /account/register/otp
module.exports.otpEmail = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await OTPAccEmail.findOne({
        email: email,
        otp: otp,
    });

    if (!result) {
        res.json({
            code: 400,
            message: "OTP không hợp lệ!",
        });
    } else {
        const account = new Account({
            email: result.email,
            type: "email",
            password: result.password,
            token: generateHelpers.generateRandomString(30),
        });

        const user = new User({
            userName: result.userName,
            email: result.email,
            token: account.token,
        });

        account.save();
        user.save();

        const token = account.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!",
            token: token,
        });
    }
};

// [POST] /account/login/email
module.exports.loginEmail = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const account = await Account.findOne({
        email: email,
        type: "email",
        deleted: false,
    });

    if (!account) {
        res.json({
            code: 400,
            message: "Email không tồn tại!",
        });
        return;
    }

    if (md5(password) != account.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu!",
        });
        return;
    }

    const token = account.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: token,
    });
};

// [POST] /account/password/forgot
module.exports.forgot = async (req, res) => {
    const email = req.body.email;

    const existEmail = await Account.findOne({
        email: email,
        type: "email",
        deleted: false,
    });

    if (!existEmail) {
        res.json({
            code: 400,
            err: "email",
            message: "Email không tồn tại!",
        });
    } else {
        const otp = generateHelpers.generateRandomNumber(4);

        const timeExpire = 5;

        const objectForgotPass = {
            email: email,
            otp: otp,
            expireAt: Date.now() + timeExpire * 60 * 1000,
        };

        const objOTP = new OTPAccEmail(objectForgotPass);
        await objOTP.save();

        //Gửi OTP qua mail user
        const subject = "MusicZone: Mã OTP xác minh gmail";
        const html = `
            Mã OTP xác minh gmail của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
            Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
        `;

        sendMailHelper.sendMail(email, subject, html);

        res.json({
            code: 200,
            message: "Đã gửi OTP qua email!",
        });
    }
};

// [POST] /account/password/otp
module.exports.otpPass = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await OTPAccEmail.findOne({
        email: email,
        otp: otp,
    });

    if (!result) {
        res.json({
            code: 400,
            message: "OTP không hợp lệ!",
        });
        return;
    }

    const account = await Account.findOne({
        email: email,
        type: "email",
    });

    const token = account.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Xác thực thành công!",
        token: token,
    });
};

// [POST] /account/password/reset
module.exports.resetPass = async (req, res) => {
    const token = req.body.token;
    const password = req.body.password;

    const account = await Account.findOne({
        token: token,
    });

    if (md5(password) == account.password) {
        res.json({
            code: 400,
            err: "oldPass",
            message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ!",
        });
        return;
    }

    await Account.updateOne(
        {
            token: token,
        },
        {
            password: md5(password),
        }
    );

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công!",
    });
};

// [GET] /account/auth/google
module.exports.authGoogle = async (req, res) => {
    try {
        const email = req.user._json.email;
        const userName = req.user._json.name;

        const account = await Account.findOne({
            email: email,
            type: "google",
            deleted: false,
        });

        if (account) {
            const token = account.token;
            res.cookie("token", token);

            res.json({
                code: 200,
                message: "Đăng nhập thành công!",
                token: token,
            });
        } else {
            const newAcc = new Account({
                email: email,
                type: "google",
                token: generateHelpers.generateRandomString(30),
            });

            const user = new User({
                userName: userName,
                email: email,
                token: newAcc.token,
            });

            newAcc.save();
            user.save();

            const token = newAcc.token;
            res.cookie("token", token);

            res.json({
                code: 200,
                message: "Đăng nhập thành công!",
                token: token,
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Đăng nhập thất bại!",
        });
    }
};
