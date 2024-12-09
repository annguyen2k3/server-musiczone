const User = require("../models/user.model");
const Song = require("../models/song.model");
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
        let followed = false;

        const user = await User.findOne({
            _id: id,
            deleted: false,
        }).lean();

        const songs = await Song.find({
            idUser: user._id,
            deleted: false,
        }).lean();

        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];

            const userMe = await User.findOne({
                token: token,
                deleted: false,
            });

            if (user.follower.includes(userMe.id)) {
                followed = true;
            }
        }

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
                followed: followed,
                follower: user.follower.length,
                following: user.following.length,
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

// [GET] /api/v1/users/favoriteSong
module.exports.favoriteSong = async (req, res) => {
    try {
        const user = req.user;
        const listSongResult = [];

        for (const idSong of user.songFavorite) {
            const song = await Song.findOne({
                _id: idSong,
                deleted: false,
            }).lean();

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
