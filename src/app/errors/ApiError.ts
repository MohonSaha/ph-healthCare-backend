class ApiError extends Error {
  statusCode: number; // comming through parameter
  constructor(statusCode: number, message: string | undefined, stack = "") {
    super(message); // comming from super class (Error)
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
