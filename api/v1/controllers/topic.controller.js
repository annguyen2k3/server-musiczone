const Topic = require("../models/topic.model");

module.exports.getTopicActive = async (req, res) => {
    try {
        const topics = await Topic.find({
            deleted: false,
            status: "active",
        })
            .select("id title")
            .lean();

        res.json({
            code: 200,
            message: "Thành công!",
            topics: topics,
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thất bại!",
        });
    }
};
