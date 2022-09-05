const express = require('express');
const router = express.Router();

const requestsController = require('../controllers/requests')

router.post('/', requestsController.index);
router.post('/respond', requestsController.respondToCarerRequest)
router.post('/delete', requestsController.deleteCarerRequest)

module.exports = router;