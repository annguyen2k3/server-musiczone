const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: String,
        company: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            default: "",
        },
        email: String,
        introduce: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/drvlecs1b/image/upload/v1732300361/avatar_user_musiczone.png",
        },
        follower: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        },
        songFavorite: {
            type: Array,
            default: [],
        },
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
