const advancedResults = (model, populate) => async (req, res, next) => {
    const reqQuery = {...req.query};
    const removeFields = ['select', 'sort'];
  
    removeFields.forEach(param=> delete reqQuery[param]);
  
    let query;
    let queryStr = JSON.stringify(reqQuery);
    queryStr =  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = model.find(JSON.parse(queryStr)); // quite .populate('courses')
  
    //Select fields (mongoose: queries, check documentation)
    if(req.query.select) {
      const fields = req.query.select.split(',').join(' ');
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
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page-1) * limit;
    const endIndex = page*limit;
    const total = await model.countDocuments();
  
    query = query.skip(startIndex).limit(limit);
    
    if(populate) { // se agrego en vez del .populate('courses') de la linea 10
        query = query.populate(populate);
    }

    const results = await query;
  
    const pagination ={};
    if(endIndex < total) {
      pagination.next = { page: page + 1, limit}
    }
    
    if(startIndex>0) {
      pagination.prev = {page: page -1, limit}
    }
  
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advancedResults;

