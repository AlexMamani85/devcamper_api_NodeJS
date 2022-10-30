const Bootcamp = require('../models/Bootcamp')


// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = async (req, res, next) => {
  try{
    const bootcamps = await Bootcamp.find();
    res.status(200).json({success: true, data: bootcamps});
  } catch (err) {
    res.status(400).json({ success: false });
  } 
  
}

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = async (req, res, next) => {
    try{
      const bootcamp = await Bootcamp.findById(req.params.id);

      if(!bootcamp) {
        return res.status(400).json({success: false});
      }

      res.status(200).json({success:true, data: bootcamp});
    } catch(err){
      res.status(400).json({success: false});
    }
  }

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async(req, res, next) => {
  // res.status(200).json({success: true, msg: 'Create new bootcamp'});
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({success: true,data: bootcamp});
  } catch(err) {
    res.status(400).json({ success: false });
  }
  

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