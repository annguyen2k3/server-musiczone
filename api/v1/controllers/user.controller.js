const User = require("../models/user.model");
const Song = require("../models/song.model");

//[POST] /api/v1/user
module.exports.index = async (req, res) => {
    let countRecords = 9;
    const resultUsers = [];

    if (req.body.countRecords) {
        countRecords = req.body.countRecords;
    }

    let find = {
        deleted: false,
    };

    const users = await User.aggregate([
        { $match: find },
        { $sample: { size: countRecords } },
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
    const id = req.params.id;
    let followed = false;

    const user = await User.findOne({
        _id: id,
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
        },
    });
};

//[GET] /api/v1/user/token/:token
module.exports.detailUserToken = async (req, res) => {
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
};
