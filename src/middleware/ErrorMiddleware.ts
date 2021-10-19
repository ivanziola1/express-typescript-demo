// src/middleware/error.middleware.ts

import HttpError from "../common/errors/HttpError";
import e, { Request, Response, NextFunction } from "express";
import { logger } from "express-winston";

export const errorHandler = (
  error: HttpError,
  _request: Request,
  response: Response,
  _next: NextFunction,
): Response => {

  if (error instanceof HttpError) {
    console.log(error.message)
    response.status(error.status).json({ message: error.message, error: error.error });
  }

  return response.status(500).send({ message: error.message });
};
