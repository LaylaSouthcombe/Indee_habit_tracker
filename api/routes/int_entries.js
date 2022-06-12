const express = require('express');
const router = express.Router();
const intsController = require('../controllers/int_entries')

router.get('/', intsController.index)
router.get('/:id', intsController.show)
router.post('/', intsController.create)
router.delete('/:id', intsController.destroy)

module.exports = router;