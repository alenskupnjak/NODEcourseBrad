const ErrorResponse = require('../utils/errorResponse');

// @desc      Start page
// @route     GET /api/v1/view/index
// @access    Public
exports.getIndex = (req, res, next) => {
  try {
    console.log('viewCtrl, bootcampCtrl.js'.magenta, req.user, res.proba);
    //  res.status(200).json(res.advancedResults);

    res.status(200).render('index', {
      pageTitle: 'Check out',
      // data: res.advancedResults
    });
  } catch (error) {
    return next(new ErrorResponse(`xxxxx ed to update this bootcamp`, 401));
  }
};

// @desc      Logiranje korisnika
// @route     GET /api/v1/view/login
// @access    Public
exports.login = (req, res, next) => {
  try {
    console.log('viewCtrl, bootcampCtrl.js'.magenta, req.user, res.proba);
    //  res.status(200).json(res.advancedResults);

    res.status(200).render('login', {
      pageTitle: 'Login',
    });
  } catch (error) {
    return next(new ErrorResponse(`xxxxx ed to update this bootcamp`, 401));
  }
};

// @desc      Register
// @route     GET /api/v1/view/register
// @access    Public
exports.register = (req, res, next) => {
  try {
    console.log('viewCtrl, bootcampCtrl.js'.magenta, req.user, res.proba);
    //  res.status(200).json(res.advancedResults);

    res.status(200).render('register', {
      pageTitle: 'Check out',
      data: res.advancedResults,
    });
  } catch (error) {
    return next(new ErrorResponse(`Greška kod registriranja`, 401));
  }
};

// @desc      Zaboravljena lozinka
// @route     GET /api/v1/view/forgotpassword
// @access    Public
exports.forgotpassword = (req, res, next) => {
  try {
    console.log('viewCtrl, forgotpassword'.magenta.inverse, req.user);
    //  res.status(200).json(res.advancedResults);

    res.status(200).render('reset-password-mail', {
      pageTitle: 'Reset password',
      data: res.advancedResults,
    });
  } catch (error) {
    return next(new ErrorResponse(`Greška kod registriranja`, 401));
  }
};

// @desc      Upravljanje
// @route     GET /api/v1/view/manage-bootcamp
// @access    Public
exports.manageBootcamp = (req, res, next) => {
  try {
    console.log(
      '/api/v1/view/manage-bootcamp, forgotpassword'.magenta.inverse,
      req.user
    );
    //  res.status(200).json(res.advancedResults);

    res.status(200).render('manage-bootcamp', {
      pageTitle: 'Manage Bootcamp',
      data: res.advancedResults,
    });
  } catch (error) {
    return next(new ErrorResponse(`Greška kod registriranja`, 401));
  }
};

// @desc      Upravljanje
// @route     GET /api/v1/view/manage-bootcamp
// @access    Private
exports.manageAccount = (req, res, next) => {
  try {
    console.log(req.user);
    res.status(200).render('manage-account', {
      pageTitle: 'Manage-account',
      data: res.advancedResults,
      user: req.user,
    });
  } catch (error) {
    return next(new ErrorResponse(`Greška kod registriranja`, 401));
  }
};

// @desc      Upravljanje
// @route     GET /api/v1/view/update-password
// @access    Public
exports.updatePassword = (req, res, next) => {
  try {
    console.log(req.user);
    res.status(200).render('update-password', {
      pageTitle: 'update-password',
      data: res.advancedResults,
    });
  } catch (error) {
    return next(new ErrorResponse(`Greška kod updatePassword`, 401));
  }
};

// @desc      Upravljanje
// @route     POST /api/v1/view/add-reviews/:id
// @access    Public
exports.addReview = (req, res, next) => {
  try {
    console.log(req.params.id);
    console.log(req.user);
    res.status(200).render('review-add', {
      pageTitle: 'Add reviews',
      review: res.advancedResults,
      user: req.user,
      id: req.params.id,
    });
  } catch (error) {
    return next(new ErrorResponse(`Greška kod addReview` + error, 401));
  }
};

// @desc      Prikazivanje grešaka
// @route     POST /api/v1/view/error
// @access    Public
exports.postError = (req, res, next) => {
  try {
    console.log('---- postError ----', req.body);
    console.log(req.body.error, req.body.statuscode);
    // console.log(req);
    res.status(200).render('error', {
      error: req.body.error,
      statuscode: req.body.statuscode,
    });

    // location.assign(`/api/v1/view/error`);
  } catch (error) {
    return next(new ErrorResponse(`Greška kod  postError` + error, 401));
  }
};

// @desc      Prikazivanje grešaka
// @route     GET /api/v1/view/errorNemaOvlasti
// @access    Public
exports.errorNemaOvlasti = (req, res, next) => {
  try {
    console.log('---- errorNemaOvlasti ----');
    res.status(200).render('error-nemate-ovlasti', {});
  } catch (error) {
    return next(new ErrorResponse(`errorNemaOvlasti` + error, 401));
  }
};
