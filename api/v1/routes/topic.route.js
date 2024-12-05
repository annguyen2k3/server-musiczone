const express = require("express");
const router = express.Router();

const controller = require("../controllers/topic.controller");

router.get("/getTopicActive", controller.getTopicActive);

module.exports = router;
