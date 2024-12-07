const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const authMiddeware = require("../../../middleware/auth.middleware");

router.get("/getUsers", controller.getUsers);

router.get("/:id", controller.detailUser);

router.get("/token/:token", controller.detailUserToken);

router.patch("/follow", authMiddeware.requireAuth, controller.follow);

module.exports = router;
