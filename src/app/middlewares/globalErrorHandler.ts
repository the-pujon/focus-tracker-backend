import { ErrorRequestHandler } from "express";
import { TErrorSources as TErrorMessage } from "../interface/error";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import config from "../../config";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError, {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/AppError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: TErrorMessage = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorSources;
  }  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorSources;
  } else if (
    err instanceof AppError ||
    err instanceof NotFoundError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError
  ) {
    statusCode = err?.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    ...(statusCode === 404 || statusCode === 401 ? { statusCode } : null),
    message,
    ...(statusCode !== 404 && statusCode !== 401 && { errorMessages }),
    ...(statusCode !== 404 &&
      statusCode !== 401 &&
      config.NODE_ENV === "development" && { stack: err?.stack }),
  });
};

export default globalErrorHandler;
