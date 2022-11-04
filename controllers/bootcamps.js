const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');


// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = {...req.query};
  const removeFields = ['select', 'sort'];

  removeFields.forEach(param=> delete reqQuery[param]);

  let query;
  let queryStr = JSON.stringify(reqQuery);
  queryStr =  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = Bootcamp.find(JSON.parse(queryStr));

  //Select fields (mongoose: queries, check documentation)
  if(req.query.select) {
    console.log(req.query.select);
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  }

  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');

  }

  const bootcamps = await query;
  res
    .status(200)
    .json({success: true, count: bootcamps.length, data: bootcamps});


});

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = asyncHandler( async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({success:true, data: bootcamp});
});

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler( async(req, res, next) => {
  // res.status(200).json({success: true, msg: 'Create new bootcamp'});
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true,data: bootcamp});

});

// @desc    Update Bootcamp
// @route   PUT /api/v1/bootcamps
// @access  Private
exports.updateBootcamp = asyncHandler( async(req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  if(!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
  }
  res.status(200).json({success: true, data: bootcamp});
});

// @desc    Delete New Bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = asyncHandler( async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if(!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({success: true, data: {}});
});


// @desc    Get Bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler( async(req, res, next) => {
  const { zipcode, distance } = req.params;
  
  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi/ 6,378 Km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin:{ $centerSphere: [ [ lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  })


});