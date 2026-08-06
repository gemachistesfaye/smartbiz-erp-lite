import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const response = exceptionResponse as Record<string, unknown>;
        message = (response.message as string) || message;
        code = (response.error as string) || code;
        details = response.details || null;
      }

      if (status === 400) {
        code = 'VALIDATION_ERROR';
      } else if (status === 401) {
        code = 'UNAUTHORIZED';
        message = 'Invalid credentials';
      } else if (status === 403) {
        code = 'FORBIDDEN';
        message = 'Insufficient permissions';
      } else if (status === 404) {
        code = 'NOT_FOUND';
        message = 'Resource not found';
      } else if (status === 409) {
        code = 'CONFLICT';
        message = 'Resource already exists';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
