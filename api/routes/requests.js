const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requests')

router.get('/', requestsController.index);
// router.get('/:id', usersController.show);

module.exports = router;