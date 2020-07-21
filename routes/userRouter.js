const express = require('express');

const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userCtrl');

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
  .get(advancedResults(User) ,getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getOneUser)
  .put(updateUser)
  .delete(deleteUser);

  
module.exports = router;
