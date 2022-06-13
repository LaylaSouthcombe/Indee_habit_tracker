const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requests')

router.get('/', requestsController.index);
router.post('/accept', requestsController.acceptTheCarerRequest)
router.post('/decline', requestsController.declineCarerRequest)

module.exports = router;