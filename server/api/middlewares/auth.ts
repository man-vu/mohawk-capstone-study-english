import jwt from 'jsonwebtoken';
import { jwt_secret_key } from "../../config/index";
import type { Request, Response, NextFunction } from 'express';

const guestAccessibleURLs: Record<string, boolean> = {
  "/api/home": true,
  "/api/discussion": true
} 

/**
 * Middleware for checking JWT authentication token which is used for protected routes
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export default (req: Request, res: Response, next: NextFunction) => {
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
