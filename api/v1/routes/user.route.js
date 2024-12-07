const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/getUsers", controller.getUsers);

router.get("/:id", controller.detailUser);

router.get("/token/:token", controller.detailUserToken);

module.exports = router;
