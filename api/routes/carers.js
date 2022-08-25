const express = require('express');
const router = express.Router();
const carersController = require('../controllers/carers')

//add jwt
//use local storage for now
router.get('/users', carersController.getAssociatedUsers);
router.post('/adduser', carersController.addUserAsDependent);
router.post('/habits', carersController.getAssociatedUsersHabits);
// router.get('/:id', carersController.show);

module.exports = router;