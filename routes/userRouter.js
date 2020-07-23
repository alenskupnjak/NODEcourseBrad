const express = require('express');

const userController = require('../controllers/userCtrl');
const User = require('../models/UserMod');

// štiti rute od neulogiranih usera
const { protect, authorizeKorisnik } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

// na ovaj nacin je protext middelware postavljen na sve rute ispod
router.use(protect)
router.use(authorizeKorisnik('admin'))

router
  .route('/')
  .get(advancedResults(User) , userController.getUsers)
  .post( userController.createUser);



router
  .route('/:id')
  .get( userController.getOneUser)
  .put( userController.updateUser)
  .delete( userController.deleteUser);

  
module.exports = router;
