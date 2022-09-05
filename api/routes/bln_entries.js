const express = require('express');
const router = express.Router();

const blnsController = require('../controllers/bln_entries')

router.patch('/', blnsController.update)

module.exports = router;