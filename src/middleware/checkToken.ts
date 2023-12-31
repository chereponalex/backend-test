import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import AppError from '../utils/appError';
import redisClient from '../utils/connectRedis';
import { verifyJwt } from '../utils/jwt';

export const checkToken = async (
  req: Request<any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
      ) {
        access_token = req.headers.authorization.split(' ')[1];
      }
      
      if (!access_token) {
        return next(new AppError(401, 'You are not logged in'));
      }
      
      const decoded = verifyJwt<{ sub: string }>(
        access_token,
        );
        
        if (!decoded) {
          return next(new AppError(401, `Invalid token or user doesn't exist`));
        }
        
        const session = await redisClient.get(decoded.sub.toString());
        
        if (!session) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }
    res.locals.user = user;
    
    next();
  } catch (err: any) {
    next(err);
  }
};
