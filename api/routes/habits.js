const express = require('express');
const router = express.Router();

const habitsController = require('../controllers/habits')

router.post('/', habitsController.create)
router.put('/', habitsController.update)
router.delete('/', habitsController.deleteHabit)
router.post('/users', habitsController.showUsersHabitsAndCurrent)

module.exports = router;