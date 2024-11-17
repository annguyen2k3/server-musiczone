const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    title: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true,
})

const Topic = mongoose.model("Topic", topicSchema, "topics");

module.exports = Topic;