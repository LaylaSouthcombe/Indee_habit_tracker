const express = require('express');
const router = express.Router();
const carersController = require('../controllers/carers')

//change to get when use jwt
router.post('/users', carersController.getAssociatedUsers);
router.post('/adduser', carersController.addUserAsDependent);
router.post('/habits', carersController.getAssociatedUsersHabits);
// router.get('/:id', carersController.show);

module.exports = router;