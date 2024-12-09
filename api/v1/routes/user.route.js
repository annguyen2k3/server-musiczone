const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/user.controller");
const authMiddeware = require("../../../middleware/auth.middleware");
const uploadCloud = require("../../../middleware/uploadCloud.middleware");

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get("/getUsers", controller.getUsers);

router.get("/detail/:id", controller.detailUser);

router.get("/token/:token", controller.detailUserToken);

router.patch("/follow", authMiddeware.requireAuth, controller.follow);

router.patch(
    "/edit",
    authMiddeware.requireAuth,
    upload.single("avatar"),
    uploadCloud.uploadSingle,
    controller.edit
);

router.get("/favoriteSong", authMiddeware.requireAuth, controller.favoriteSong);

module.exports = router;
