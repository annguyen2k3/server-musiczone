const mongoose = require("mongoose");

const otpAccEmailSchema = new mongoose.Schema(
    {
        email: String,
        userName: String,
        password: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

const OTPAccEmail = mongoose.model(
    "OTPAccEmail",
    otpAccEmailSchema,
    "otpAccEmail"
);

module.exports = OTPAccEmail;
