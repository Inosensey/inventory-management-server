import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      return response.status(exception.getStatus()).json({
        success: false,
        message: 'Bad request: ' + exception.message,
        data: exception.getResponse(),
      });
    }

    if (exception instanceof UnauthorizedException) {
      return response.status(exception.getStatus()).json({
        success: false,
        message: 'Unauthorized access: ' + exception.message,
        data: exception.getResponse(),
      });
    }

    if (exception instanceof ConflictException) {
      return response.status(exception.getStatus()).json({
        success: false,
        message: 'Conflict occurred: ' + exception.message,
        data: exception.getResponse(),
      });
    }

    if (exception instanceof NotFoundException) {
      return response.status(exception.getStatus()).json({
        success: false,
        message: 'Resource not found: ' + exception.message,
        data: exception.getResponse(),
      });
    }

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        success: false,
        message: 'Bad request: ' + exception.message,
        data: exception.getResponse(),
      });
    }

    return response.status(500).json({
      success: false,
      message: 'Internal server error: Something went wrong.',
      data: null,
    });
  }
}
