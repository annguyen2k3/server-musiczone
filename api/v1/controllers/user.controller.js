const User = require("../models/user.model");
const Song = require("../models/song.model");
const Topic = require("../models/topic.model");
const Playlist = require("../models/playlist.model");
const { like } = require("./song.controller");

//[POST] /api/v1/user
module.exports.getUsers = async (req, res) => {
    let countRecord = 5;
    const resultUsers = [];

    if (req.query.countRecord) {
        countRecord = parseInt(req.query.countRecord);
    }

    let find = {
        deleted: false,
    };

    const users = await User.aggregate([
        { $match: find },
        { $sample: { size: countRecord } },
        {
            $project: {
                _id: 1,
                userName: 1,
                avatar: 1,
                follower: 1,
            },
        },
    ]);

    for (const user of users) {
        const songs = await Song.find({
            deleted: false,
            statusSecurity: "public",
            idUser: user._id,
        }).lean();

        resultUsers.push({
            _id: user._id,
            userName: user.userName,
            avatar: user.avatar,
            follower: user.follower.length,
            track: songs.length,
        });
    }

    res.json({
        code: 200,
        message: "Thành công!",
        users: resultUsers,
    });
};

//[GET] /api/v1/user/:id
module.exports.detailUser = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findOne({
            _id: id,
            deleted: false,
        }).lean();

        const songs = await Song.find({
            idUser: user._id,
            deleted: false,
        }).lean();

        res.json({
            code: 200,
            message: "Thành công!",
            user: {
                id: user._id,
                userName: user.userName,
                company: user.company,
                address: user.address,
                email: user.email,
                introduce: user.introduce,
                avatar: user.avatar,
                follower: user.follower,
                following: user.following,
                numTrack: songs.length,
            },
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại!",
        });
    }
};

//[GET] /api/v1/user/token/:token
module.exports.detailUserToken = async (req, res) => {
    try {
        const token = req.params.token;

        const user = await User.findOne({
            token: token,
            deleted: false,
        }).lean();

        const songs = await Song.find({
            idUser: user._id,
            statusSecurity: "public",
            deleted: false,
        });

        res.json({
            code: 200,
            message: "Thành công!",
            user: {
                id: user._id,
                userName: user.userName,
                company: user.company,
                address: user.address,
                email: user.email,
                introduce: user.introduce,
                avatar: user.avatar,
                follower: user.follower.length,
                following: user.following.length,
                tracks: songs.length,
            },
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại",
        });
    }
};

// [PATCH] /api/v1/user/follow
module.exports.follow = async (req, res) => {
    try {
        const type = req.body.type;
        const idUserFollow = req.body.idUser;
        const user = req.user;

        if (type && idUserFollow) {
            const userFollow = await User.findOne({
                _id: idUserFollow,
                deleted: false,
            });

            switch (type) {
                case "follow":
                    const indexFollower = userFollow.follower.indexOf(user.id);
                    if (indexFollower === -1) {
                        userFollow.follower.push(user.id);
                        await userFollow.save();
                    }

                    const indexFollowing = user.following.indexOf(
                        userFollow.id
                    );
                    if (indexFollowing === -1) {
                        user.following.push(userFollow.id);
                        await user.save();
                    }
                    break;

                case "unfollow":
                    const indexUnFollower = userFollow.follower.indexOf(
                        user.id
                    );
                    if (indexUnFollower !== -1) {
                        userFollow.follower.splice(indexUnFollower, 1);
                        await userFollow.save();
                    }

                    const indexUnFollowing = user.following.indexOf(
                        userFollow.id
                    );
                    if (indexUnFollowing !== -1) {
                        user.following.splice(indexUnFollowing, 1);
                        await user.save();
                    }
                    break;

                default:
                    break;
            }

            res.json({
                code: 200,
                message: "Thành công!",
                userFollow: userFollow,
            });
        } else {
            res.json({
                code: 400,
                message: "Thiếu dữ liệu gửi lên!",
            });
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại: " + error.message,
        });
    }
};

// [PATCH] /api/v1/user/edit
module.exports.edit = async (req, res) => {
    try {
        const user = req.user;

        await User.updateOne({ _id: user.id }, req.body);

        const userUpdate = await User.findOne({
            _id: user.id,
        });

        res.json({
            code: 200,
            message: "Thành công!",
            userUpdate: userUpdate,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại!",
        });
    }
};

// [GET] /api/v1/user/favoriteSong
module.exports.favoriteSong = async (req, res) => {
    try {
        const user = req.user;
        const listSongResult = [];

        for (const idSong of user.songFavorite) {
            const song = await Song.findOne({
                _id: idSong,
                deleted: false,
            }).lean();

            const topic = await Topic.findOne({
                _id: song.idTopic,
                deleted: false,
            }).lean();

            const userSong = await User.findOne({
                _id: song.idUser,
                deleted: false,
            }).lean();

            song["topicTitle"] = topic.title;
            song["userName"] = userSong.userName;
            listSongResult.push(song);
        }

        res.json({
            code: 200,
            message: "Thành công!",
            listSong: listSongResult.reverse(),
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại!",
        });
    }
};

// [GET] /api/v1/user/uploadSongs
module.exports.uploadSongs = async (req, res) => {
    try {
        const user = req.user;

        const songs = await Song.find({
            idUser: user.id,
            deleted: false,
        }).lean();

        if (songs.length > 0) {
            for (const song of songs) {
                const topic = await Topic.findOne({
                    _id: song.idTopic,
                    deleted: false,
                }).lean();

                song["topicTitle"] = topic.title;
                song["userName"] = user.userName;
            }
        }

        console.log(songs);

        res.json({
            code: 200,
            message: "Thành công!",
            songs: songs,
        });
    } catch (error) {
        res.json({
            code: 200,
            message: "Thất bại!",
        });
    }
};

// [GET] /api/v1/user/playlistUser
module.exports.playlistUser = async (req, res) => {
    try {
        const user = req.user;

        const playlists = await Playlist.find({
            idUser: user.id,
        });

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

// [GET] /api/v1/user/playlistPublic
module.exports.playlistPublic = async (req, res) => {
    try {
        const idUser = req.params.id;

        const playlists = await Playlist.find({
            idUser: idUser,
            statusSecurity: "public",
        });

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

// [GET] /api/v1/user/playlistAll
module.exports.playlistAll = async (req, res) => {
    try {
        const user = req.user;

        const playlists = await Playlist.find({
            idUser: user.id,
            deleted: false,
        }).lean();

        for (const idlist of user.playlistFavorite) {
            const list = await Playlist.findOne({
                _id: idlist,
                deleted: false,
            }).lean();

            playlists.push(list);
        }

        for (const list of playlists) {
            const userOwner = await User.findOne({
                _id: list.idUser,
                deleted: false,
            });
            list["userName"] = userOwner.userName;
        }

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
