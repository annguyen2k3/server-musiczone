const PlayList = require("../models/playlist.model");
const Song = require("../models/song.model");
const User = require("../models/user.model");

//[GET] /api/v1/playlist/toptrending
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

//[GET] /api/v1/playlist/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;

    const playlist = await PlayList.findOne({
        _id: id,
        deleted: false,
    }).lean();

    const user = await User.findOne({
        _id: playlist.idUser,
        deleted: false,
    }).lean();

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        const userLike = await User.findOne({
            deleted: false,
            token: token,
        }).lean();

        if (userLike._id.equals(user._id)) {
            console.log("OK");
            playlist["liked"] = true;
        }
    }

    const songs = [];
    for (const idSong of playlist.listSongs) {
        const song = await Song.findOne({
            _id: idSong,
            deleted: false,
        })
            .select("_id title image listens idUser audio")
            .lean();

        const userSong = await User.findOne({
            _id: song.idUser,
            deleted: false,
        });

        song["userName"] = userSong.userName;

        songs.push(song);
    }

    res.json({
        code: 200,
        message: "Thành công!",
        infoPlaylist: {
            _id: playlist._id,
            title: playlist.title,
            avatar: playlist.avatar,
            description: playlist.description,
            likes: playlist.likes.length,
            liked: playlist.liked,
            statusSecurity: playlist.statusSecurity,
            createdAt: playlist.createdAt,
            numTrack: playlist.listSongs.length,
        },
        user: {
            _id: user._id,
            userName: user.userName,
            avatar: user.avatar,
            follower: user.follower.length,
        },
        songs: songs,
    });
};

//[GET] /api/v1/playlist/getPlaylists
module.exports.getPlaylists = async (req, res) => {
    try {
        let countRecord = 1;
        if (req.query.countRecord) {
            countRecord = parseInt(req.query.countRecord);
        }

        let find = {
            statusSecurity: "public",
            deleted: false,
        };

        const playlists = await PlayList.aggregate([
            {
                $match: find,
            },
            {
                $sample: {
                    size: countRecord,
                },
            },
            {
                $project: {
                    _id: 1,
                    idUser: 1,
                    title: 1,
                    avatar: 1,
                    description: 1,
                    statusSecurity: 1,
                    createdAt: 1,
                    likes: 1,
                    listSongs: 1,
                },
            },
        ]);

        console.log(playlists);

        res.json({
            code: 200,
            message: "Thành công!",
            playlists: playlists,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại!",
        });
    }
};

// [PATCH] /api/v1/playlist/like
module.exports.like = async (req, res) => {
    try {
        const type = req.body.type;
        const idPlaylist = req.body.idPlaylist;
        const user = req.user;

        if (type && idPlaylist) {
            const playlist = await PlayList.findOne({
                _id: idPlaylist,
                deleted: false,
                statusSecurity: "public",
            });

            switch (type) {
                case "like":
                    const indexLike = playlist.likes.indexOf(user.id);
                    if (indexLike === -1) {
                        playlist.likes.push(user.id);
                        await playlist.save();
                    }
                    break;

                case "unlike":
                    const index = playlist.likes.indexOf(user.id);
                    if (index !== -1) {
                        playlist.likes.splice(index, 1);
                    }
                    await playlist.save();
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
    } catch (error) {
        res.json({
            code: 200,
            message: "Thất bại: " + error.message,
        });
    }
};
