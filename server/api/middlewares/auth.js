const jwt = require('jsonwebtoken')
const { jwt_secret_key } = require("../../config/index");

const guestAccessibleURLs = {
  "/api/home": true,
  "/api/discussion": true
} 

/**
 * Middleware for checking JWT authentication token which is used for protected routes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).send({ error: err.name });
        }
        if (guestAccessibleURLs[req.originalUrl]) {
          next()
          return
        } 
        return res.status(403).send({ error: err.name });
      }

      req.user = { id: decoded.id, isTeacher: decoded.isTeacher };
      next();
    });
  } else {
    if (guestAccessibleURLs[req.originalUrl]) {
      next()
    } else {
      res.sendStatus(401);  
    }
  }
};
