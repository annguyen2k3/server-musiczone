const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        token: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
