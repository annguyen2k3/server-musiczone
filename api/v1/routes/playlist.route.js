const express = require("express");
const router = express.Router();

const controller = require("../controllers/playlist.controller");

router.get("/toptrending", controller.toptrending);

router.get("/detail/:id", controller.detail);

module.exports = router;
