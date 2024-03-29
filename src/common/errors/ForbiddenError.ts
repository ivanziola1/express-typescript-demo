import HttpError from "./HttpError";
export default class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(403, message, "Forbidden");
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
