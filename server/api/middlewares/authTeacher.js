const jwt = require("jsonwebtoken");
const { jwt_secret_key } = require("../../config/index");

/**
 * Middleware for checking JWT authentication token and if user requesting is a teacher which is used for only teacher routes
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
        return res.sendStatus(403);
      }

      const { id, isTeacher } = decoded;
      if (!isTeacher) {
        return res.sendStatus(403);
      }

      next();
    });
  } else {
    res.sendStatus(401);
  }
};
