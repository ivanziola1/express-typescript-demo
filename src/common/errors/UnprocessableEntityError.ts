// src/common/http-exception.ts

import HttpError from "./HttpError";

export default class UnprocessableEntityError extends HttpError {

  constructor(message: string) {
    super(422, message, "Unprocessable Entity");
  }
}
