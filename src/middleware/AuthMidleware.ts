import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../common/errors/UnauthorizedError";
import BadRequestError from "../common/errors/BadRequestError";

export = (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  try {
    const token = request.header("x-auth-token");
    if (!token) return next(new UnauthorizedError("You are not authorized"));
    
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    request.user = decoded;
    return next();
  } catch (error) {
    return next(new BadRequestError("Invalid token"));
  }
};
