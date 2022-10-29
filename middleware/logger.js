// @desc Logs request to console 
const logger = (req, res, next) => {
    //   req.hello = 'Hello World';
    
      console.log(`${req.method} ${req.protocol}://${req.get('host')} $reg.originalUrl`)
      // GET http://localhost:5001 $reg.originalUrl
      
      next();
    }

module.exports = logger;
