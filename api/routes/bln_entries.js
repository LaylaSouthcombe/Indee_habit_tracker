const express = require('express');
const router = express.Router();
const blnsController = require('../controllers/bln_entries')

router.post('/', blnsController.create)

module.exports = router;