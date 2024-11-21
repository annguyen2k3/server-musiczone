const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: String,
        company: String,
        address: String,
        email: String,
        introduce: String,
        avatar: String,
        token: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
