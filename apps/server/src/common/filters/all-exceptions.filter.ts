import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorBody = {
  error?: string;
  message?: string | string[];
  statusCode?: number;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const body =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as ErrorBody)
        : undefined;

    response.status(statusCode).json({
      statusCode,
      error: body?.error ?? HttpStatus[statusCode] ?? 'Error',
      message:
        body?.message ??
        (typeof exceptionResponse === 'string'
          ? exceptionResponse
          : 'Internal server error'),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
