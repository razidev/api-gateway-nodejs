const express = require('express'),
router = express.Router(),
verifyToken = require('../middleware/check-auth');

const changeOldPassword = require('./change-password');

router.post("/changePassword", verifyToken, changeOldPassword.Change);

module.exports = router