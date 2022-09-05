const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth')

router.post("/carer/register", authController.registerCarer)
router.post("/user/register", authController.registerUser)
router.post("/login", authController.loginUser)

module.exports = router;