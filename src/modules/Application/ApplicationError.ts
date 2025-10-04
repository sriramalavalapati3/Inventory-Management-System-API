export class ApplicationError extends Error {
    public httpStatusCode: number;
    public code: string;
  
    constructor(message: string, code: string, httpStatusCode: number) {
      super(message);
      this.code = code;
      this.httpStatusCode = httpStatusCode;
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this);
    }
  }
  