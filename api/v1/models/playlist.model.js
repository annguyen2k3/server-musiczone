const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
    {
        idUser: String,
        title: String,
        avatar: String,
        statusSecurity: String,
        listSongs: {
            type: Array,
            default: [],
        },
        description: {
            type: String,
            default: "",
        },
        likes: {
            type: Array,
            default: [],
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

const PlayList = mongoose.model("PlayList", playlistSchema, "playlists");

module.exports = PlayList;
