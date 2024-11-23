const PlayList = require("../models/playlist.model");
const User = require("../models/user.model");

//[GET] /api/v1/playlist/
module.exports.toptrending = async (req, res) => {
    const playlists = await PlayList.find({
        statusSecurity: "public",
        deleted: false,
    })
        .select("_id idUser title avatar")
        .lean();

    for (const playlist of playlists) {
        const user = await User.findOne({
            _id: playlist.idUser,
        }).lean();

        playlist["userName"] = user.userName;
    }

    console.log(playlists);

    res.json({
        code: 200,
        message: "Thành công!",
        playlists: playlists,
    });
};
