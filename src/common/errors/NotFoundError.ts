import HttpError from "./HttpError";

export default class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message, "Not Found");
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
