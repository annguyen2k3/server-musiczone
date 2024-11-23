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
