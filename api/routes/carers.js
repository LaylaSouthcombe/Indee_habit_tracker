const express = require('express');
const router = express.Router();

const carersController = require('../controllers/carers')

router.post('/', carersController.getAssociatedUsers);
router.post('/adduser', carersController.addUserAsDependent);

module.exports = router;