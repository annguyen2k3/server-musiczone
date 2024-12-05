const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.post("/", controller.index);

router.get("/:id", controller.detailUser);

router.get("/token/:token", controller.detailUserToken);

module.exports = router;
