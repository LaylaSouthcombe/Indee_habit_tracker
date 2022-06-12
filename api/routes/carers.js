const express = require('express');
const router = express.Router();
const carersController = require('../controllers/carers')

router.get('/', carersController.index);
// router.get('/:id', carersController.show);

module.exports = router;