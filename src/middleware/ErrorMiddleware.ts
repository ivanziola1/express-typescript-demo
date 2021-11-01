// src/middleware/error.middleware.ts

import HttpError from "../common/errors/HttpError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: HttpError,
  _request: Request,
  response: Response,
  _next: NextFunction,
): Response => {
  return response.status(error.status).json({ message: error.message, error: error.error });
};
