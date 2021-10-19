// src/common/http-exception.ts

import HttpError from "./HttpError";

export default class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message, "Not Found");
  }
}
