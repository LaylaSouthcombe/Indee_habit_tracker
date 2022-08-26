const express = require('express');
const router = express.Router();
const intsController = require('../controllers/int_entries')

router.post('/', intsController.create)
router.patch('/', intsController.update)

module.exports = router;