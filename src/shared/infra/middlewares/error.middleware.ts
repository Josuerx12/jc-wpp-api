import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;

    // Corrige a criação da stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error]: ${message}`);

  res.status(statusCode).json({
    status: "error",
    message,
  });
}
