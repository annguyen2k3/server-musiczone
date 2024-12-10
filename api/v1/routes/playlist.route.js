const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddeware = require("../../../middleware/auth.middleware");
const controller = require("../controllers/playlist.controller");
const uploadCloud = require("../../../middleware/uploadCloud.middleware");

const upload = multer({
    storage: multer.memoryStorage(),
});

router.get("/toptrending", controller.toptrending);

router.get("/detail/:id", controller.detail);

router.get("/getPlaylists", controller.getPlaylists);

router.patch("/like", authMiddeware.requireAuth, controller.like);

router.post(
    "/create",
    authMiddeware.requireAuth,
    upload.single("avatar"),
    uploadCloud.uploadSingle,
    controller.create
);

router.post(
    "/edit/:id",
    authMiddeware.requireAuth,
    upload.single("avatar"),
    uploadCloud.uploadSingle,
    controller.edit
);

router.delete("/delete/:id", authMiddeware.requireAuth, controller.delete);

module.exports = router;
