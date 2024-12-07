const express = require("express");
const router = express.Router();

const controller = require("../controllers/playlist.controller");

router.get("/toptrending", controller.toptrending);

router.get("/detail/:id", controller.detail);

router.get("/getPlaylists", controller.getPlaylists);

module.exports = router;
