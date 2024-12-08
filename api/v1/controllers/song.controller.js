const Song = require("../models/song.model");
const User = require("../models/user.model");
const Topic = require("../models/topic.model");

//[POST] /api/v1/songs
module.exports.index = async (req, res) => {
    let countRecords = 9;

    if (req.body.countRecords) {
        countRecords = req.body.countRecords;
    }

    let find = {
        statusSecurity: "public",
        deleted: false,
    };

    const songs = await Song.aggregate([
        { $match: find },
        { $sample: { size: countRecords } },
        {
            $project: {
                _id: 1,
                title: 1,
                idUser: 1,
                idTopic: 1,
                image: 1,
                audio: 1,
                like: 1,
            },
        },
    ]);

    for (const song of songs) {
        const user = await User.findOne({
            _id: song.idUser,
            deleted: false,
        }).lean();

        const topic = await Topic.findOne({
            _id: song.idTopic,
            status: "active",
            deleted: false,
        });

        song["userName"] = user.userName;
        song["topic"] = topic.title;
    }

    res.json({
        code: 200,
        message: "Thành công!",
        songs: songs,
    });
};

//[GET] /api/v1/songs
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const song = await Song.findOne({
        _id: id,
        deleted: false,
    }).lean();

    const user = await User.findOne({
        _id: song.idUser,
        deleted: false,
    }).lean();

    const songs = await Song.find({
        deleted: false,
        statusSecurity: "public",
        idUser: user._id,
    }).lean();

    const topic = await Topic.findOne({
        _id: song.idTopic,
        deleted: false,
    }).lean();

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        const userLike = await User.findOne({
            deleted: false,
            token: token,
        }).lean();

        for (const i of song.like) {
            if (i == userLike._id) {
                song["liked"] = true;
                break;
            }
        }
    }

    song["titleTopic"] = topic.title;

    res.json({
        code: 200,
        message: "Thành công!",
        song: song,
        user: {
            _id: user._id,
            userName: user.userName,
            numTrack: songs.length,
            numFollower: user.follower.length,
        },
    });
};

//[POST] /api/v1/songs/upload
module.exports.upload = async (req, res) => {
    try {
        const dataSong = req.body;

        dataSong.audio = dataSong.audio[0];
        dataSong.image = dataSong.image[0];

        const song = new Song(dataSong);
        await song.save();

        res.json({
            code: 200,
            message: "Thêm thành công!",
            song: song,
        });
    } catch (error) {
        console.log(error);
        res.json({
            code: 400,
            message: "Thêm thất bại!",
        });
    }
};

// [PATCH] /api/v1/songs/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    try {
        await Song.updateOne({ _id: id }, req.body);

        res.json({
            code: 200,
            message: "Thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại",
        });
    }
};

// [PATCH] /api/v1/songs/like
module.exports.like = async (req, res) => {
    const type = req.body.type;
    const idSong = req.body.idSong;
    const user = req.user;

    if (type && idSong) {
        const song = await Song.findOne({
            _id: idSong,
            deleted: false,
            statusSecurity: "public",
        });

        switch (type) {
            case "like":
                const indexLike = song.like.indexOf(user.id);
                if (indexLike === -1) {
                    song.like.push(user.id);
                    await song.save();
                }
                break;

            case "unlike":
                const indexUnLike = song.like.indexOf(user.id);
                if (indexUnLike !== -1) {
                    song.like.splice(indexUnLike, 1);
                }
                await song.save();
                break;

            default:
                break;
        }

        res.json({
            code: 200,
            message: "Thành công!",
        });
    } else {
        res.json({
            code: 400,
            message: "Thiếu dữ liệu gửi lên!",
        });
    }
};
