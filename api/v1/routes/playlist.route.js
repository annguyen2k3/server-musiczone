const express = require("express");
const router = express.Router();

const authMiddeware = require("../../../middleware/auth.middleware");
const controller = require("../controllers/playlist.controller");

router.get("/toptrending", controller.toptrending);

router.get("/detail/:id", controller.detail);

router.get("/getPlaylists", controller.getPlaylists);

router.patch("/like", authMiddeware.requireAuth, controller.like);

module.exports = router;
