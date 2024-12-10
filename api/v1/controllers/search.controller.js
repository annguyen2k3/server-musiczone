const Song = require("../models/song.model");
const Playlist = require("../models/playlist.model");
const User = require("../models/user.model");

module.exports.result = async (req, res) => {
    try {
        const result = {};
        let keyword = req.query.keyword;

        const songs = await Song.find({
            deleted: false,
            statusSecurity: "public",
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).lean();

        result["songs"] = songs;

        res.json({
            code: 200,
            message: "Thành công!",
            result: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: 400,
            message: "Thất bại!",
        });
    }
};
