const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        title: String,
        description: {
            type: String,
            default: "",
        },
        idTopic: String,
        idUser: String,
        statusSecurity: String,
        audio: String,
        image: String,
        like: {
            type: Array,
            default: [],
        },
        listen: {
            type: Number,
            default: 0,
        },
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

const Song = mongoose.model("Song", songSchema, "songs");

module.exports = Song;
