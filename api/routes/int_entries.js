const express = require('express');
const router = express.Router();

const intsController = require('../controllers/int_entries')

router.patch('/', intsController.update)

module.exports = router;