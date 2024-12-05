const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../controllers/song.controller");
const uploadCloud = require("../../../middleware/uploadCloud.middleware");

const upload = multer({
    storage: multer.memoryStorage(),
});

router.post("/", controller.index);

router.get("/detail/:id", controller.detail);

router.post(
    "/upload",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "audio", maxCount: 1 },
    ]),
    uploadCloud.uploadFields,
    controller.upload
);

router.patch(
    "/edit/:id",
    upload.single("image"),
    uploadCloud.uploadSingle,
    controller.edit
);

module.exports = router;
