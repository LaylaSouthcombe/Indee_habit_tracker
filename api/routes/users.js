const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users')

router.get('/', usersController.index);
// router.get('/:id', usersController.show);
router.post('/', usersController.findByEmailOrName);
router.post('/summary', usersController.findUsersSummary);

module.exports = router;