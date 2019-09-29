const express = require('express'),
router = express.Router();

const authRegister = require('./register'),
authLogin = require('./login'),
authVerify = require('./email-verify'),
authForgot = require('./forgot-password'),
authChangePass = require('./change-password');

router.post("/register", authRegister.Register)
router.post("/login", authLogin.Login)
router.get("/verification/:token", authVerify.Verify)
router.post("/forgotPassword", authForgot.Forgot)
router.post("/changePassword/:token", authChangePass.Change)

module.exports = router;