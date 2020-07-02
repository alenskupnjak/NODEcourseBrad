// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = (req, res, next) => {
  res.status(400).json({
    sucess: true,
    msg: 'Prikaži sve bootcamps',
  });
};

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = (req, res, next) => {
  res.status(400).json({
    sucess: true,
    msg: `Prikaži ${req.params.id}`,
  });
};

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    sucess: true,
    msg: 'Kreiraj bootcamps',
  });
};

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    sucess: true,
    msg: `Prikaži ${req.params.id}`,
  });
};

// @desc      Delate bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    sucess: true,
    msg: `Obriši ${req.params.id}`,
  });
};
