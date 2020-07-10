const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

///////////////////////////////////////////////
// Definiranje user scheme
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 4,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

///////////////////////////////////////////////////////////////////
// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  console.log(this.name);
  // kreiram passvord prije snimanja u bazu"
  this.password = await bcryptjs.hash(this.password, salt);
});

////////////////////////////////////////////////////////////////////
// Sign JWT and return, u token sprema id korisnika
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
};

////////////////////////////////////////////////////////////////////
// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

/////////////////////////////////////////////////////////////////
// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire za 10 minuta
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

////////////////////////////////////////////////////////////////
module.exports = mongoose.model('User', UserSchema);
