const express = require('express');
const router = express.Router();
const {
    register,
    verify,
    login
} = require("../../controllers/AuthController");

router.post('/register', register);
router.get('/verify-email/:token', verify)
router.post('/login', login);

module.exports = router;