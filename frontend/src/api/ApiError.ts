export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);

    this.name = "ApiError";
    this.code = code;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}