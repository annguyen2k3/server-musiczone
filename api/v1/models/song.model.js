const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: String,
    description: String,
    idTopic: String,
    idUser: String,
    statusSecurity: String,
    pathSong: String,
    pathImage: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true,
})

const Song = mongoose.model("Song", songSchema, "songs");

module.exports = Song;