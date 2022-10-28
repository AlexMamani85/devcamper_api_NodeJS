// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: 'Show all bootcamps'});
}

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = (req, res, next) => {
    res
      .status(200)
      .json({ success: true, msg: `Display Bootcamp with id: ${req.params.id}` });
  }

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
    res
      .status(200)
      .json({ 
        success: true, 
        msg: 'Create new bootcamp'});
}

// @desc    Update Bootcamp
// @route   PUT /api/v1/bootcamps
// @access  Private
exports.updateBootcamp = (req, res, next) => {
    res
      .status(200)
      .json({ success: true, msg: `Update Bootcamp with id: ${req.params.id}`});
}

// @desc    Delete New Bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res
      .status(200)
      .json({ success: true, msg: `Delete Bootcamp with id: ${req.params.id}`});
}