const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users')

router.post('/', usersController.findByEmailOrName);
router.post('/summary', usersController.findUsersSummary);
router.post('/habit/summary', usersController.findUsersIndividualHabitsSummary);

module.exports = router;