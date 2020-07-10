const crypto = require('crypto');
const User = require('../models/UserMod');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

/////////////////////////////////////////////////////////
// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/admin
exports.getUsers = async (req, res, next) => {
  try {
    res.status(200).json(res.advancedResults);
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

/////////////////////////////////////////////////////////
// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/admin
exports.getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      sucess: true,
      data:user
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

/////////////////////////////////////////////////////////
// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/admin
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      sucess: true,
      data:user
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

/////////////////////////////////////////////////////////
// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
      runValidators: true
    });

    res.status(200).json({
      sucess: true,
      data:user
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};

/////////////////////////////////////////////////////////
// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      sucess: true,
      poruka: 'Korisnik obrisan'
    });
  } catch (error) {
    return next(new ErrorResponse(error, 400));
  }
};
