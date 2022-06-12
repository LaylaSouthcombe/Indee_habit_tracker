const express = require('express');
const router = express.Router();
const intsController = require('../controllers/int_entries')

router.post('/', intsController.create)

module.exports = router;