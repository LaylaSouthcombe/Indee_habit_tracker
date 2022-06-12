const express = require('express');
const router = express.Router();
const blnsController = require('../controllers/bln_entries')

router.get('/', blnsController.index)
router.get('/:id', blnsController.show)
router.post('/', blnsController.create)
router.delete('/:id', blnsController.destroy)

module.exports = router;