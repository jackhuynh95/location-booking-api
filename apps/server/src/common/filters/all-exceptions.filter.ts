import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

type ErrorBody = {
  error?: string;
  message?: string | string[];
  statusCode?: number;
};

type PostgresDriverError = {
  code?: string;
  constraint?: string;
};

const databaseErrorByCode: Record<string, { status: number; message: string }> =
  {
    '23503': {
      status: HttpStatus.CONFLICT,
      message: 'Database reference constraint failed',
    },
    '23505': {
      status: HttpStatus.CONFLICT,
      message: 'Database unique constraint failed',
    },
    '23514': {
      status: HttpStatus.BAD_REQUEST,
      message: 'Database check constraint failed',
    },
    '22P02': {
      status: HttpStatus.BAD_REQUEST,
      message: 'Database value format is invalid',
    },
  };

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const databaseError =
      exception instanceof QueryFailedError
        ? databaseErrorByCode[
            (exception.driverError as PostgresDriverError | undefined)?.code ??
              ''
          ]
        : undefined;
    const statusCode =
      databaseError?.status ??
      (exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR);
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
        databaseError?.message ??
        body?.message ??
        (typeof exceptionResponse === 'string'
          ? exceptionResponse
          : 'Internal server error'),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
