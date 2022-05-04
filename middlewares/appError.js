// class AppError extends Error {
//   constructor(message, statuscode) {
//     super(message);
//     this.statuscode = statuscode;
//     this.statuscode = `${this.statuscode}`.startsWith("4") ? "fail" : "error";

//     Error.captureStackTrace(this, this.constructor);
//   }
// }
// module.exports = AppError;

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
