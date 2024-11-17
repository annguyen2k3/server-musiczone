const Song = require('../models/song.model');
const User = require('../models/user.model');
const Topic = require('../models/topic.model');

//[GET] /api/v1/songs
module.exports.index = async (req, res) => {
    const songs = await Song.find({
        statusSecurity: "public",
        deleted: false
    }).select("_id title idUser idTopic pathImage pathSong").lean();

    for (const song of songs) {
        const user = await User.findOne({
            _id: song.idUser,
            deleted: false
        }).lean();

        const topic = await Topic.findOne({
            _id: song.idTopic,
            status: "active",
            deleted: false
        })

        song["userName"] = user.userName;
        song["topic"] = topic.title;
    }



    res.json({
        code: 200,
        message: "Thành công!",
        songs: songs
    })
}