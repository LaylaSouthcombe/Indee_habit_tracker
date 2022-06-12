const express = require('express');
const router = express.Router();
const habitsController = require('../controllers/habits')

router.post('/', habitsController.create)
router.put('/', habitsController.update)
router.delete('/', habitsController.destroy)

router.get('/week', habitsController.showWeekMetrics)
router.get('/month', habitsController.showMonthMetrics)
router.get('/alltime', habitsController.showAlltimeMetrics)

router.get('/', habitsController.index)

router.get('/summary', habitsController.showSummary)

module.exports = router;