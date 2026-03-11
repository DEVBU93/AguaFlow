import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
    return;
  }

  // Error inesperado — no revelar detalles en producción
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('[AguaFlow Error]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(isDev && { stack: err.stack, name: err.name })
  });
};
