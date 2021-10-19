// src/common/http-exception.ts

export default class HttpError extends Error {
  statusCode?: number;
  status: number;
  message: string;
  error: string | null;

  constructor(statusCode: number, message: string, error?: string) {
    super(message);

    this.status = statusCode || 500;
    this.message = message;
    this.error = error || null;
  }
}
