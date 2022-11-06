const path = require('path');
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
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

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

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;
  const startIndex = (page-1) * limit;
  const endIndex = page*limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);
  
  const bootcamps = await query;

  const pagination ={};
  if(endIndex < total) {
    pagination.next = { page: page + 1, limit}
  }
  
  if(startIndex>0) {
    pagination.prev = {page: page -1, limit}
  }

  res
    .status(200)
    .json({
      success: true, 
      count: bootcamps.length,
      pagination,
      data: bootcamps});


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
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    bootcamp.remove(); //to trigger the Cascade delete courses

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



// @desc    Upload photo for Bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler( async(req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if(!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if(!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check filesize
  if(file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name});

    res.status(200).json({
      success: true,
      data: file.name
    });
  });

});
