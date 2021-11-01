import HttpError from "./HttpError";

export default class UnprocessableEntityError extends HttpError {

  constructor(message: string) {
    super(422, message, "Unprocessable Entity");
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
