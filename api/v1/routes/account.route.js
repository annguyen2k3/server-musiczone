const express = require("express");
const router = express.Router();

const controller = require("../controllers/account.controller");

const passwordMiddleware = require("../../../middleware/password.middleware");

router.post(
    "/register/email",
    passwordMiddleware.checkSecurity,
    controller.register
);

router.post("/register/otp", controller.otpEmail);

router.post("/login/email", controller.loginEmail);

router.post("/password/forgot", controller.forgot);

router.post("/password/otp", controller.otpPass);

router.post(
    "/password/reset",
    passwordMiddleware.checkSecurity,
    controller.resetPass
);

router.get("/auth/google", controller.authGoogle);

router.delete("/delete", controller.delete);

module.exports = router;
