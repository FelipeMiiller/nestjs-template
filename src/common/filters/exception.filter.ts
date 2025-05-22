import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaException } from 'src/common/prisma/prisma.erros';
import { LoggerService } from '../loggers/domain/logger.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from 'prisma/client/runtime/library';

type ErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
  code?: string;
  meta?: Record<string, any>;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerService?: LoggerService) {
    this.loggerService.contextName = 'ExceptionsFilter';
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let errorResponse: ErrorResponse;

    // Converte erros do Prisma para PrismaException
    let processedException = exception;
    if (
      processedException instanceof PrismaClientKnownRequestError ||
      processedException instanceof PrismaClientValidationError
    ) {
      processedException = new PrismaException(processedException);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    // Trata exceções HTTP (incluindo PrismaException que é uma HttpException)
    if (processedException instanceof HttpException) {
      const status = processedException.getStatus();
      let message = processedException.getResponse();
      // Se a mensagem for objeto, tenta extrair o campo message
      if (typeof message === 'object' && message !== null && 'message' in message) {
        message = (message as any).message;
      }
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: isDev ? message : 'Internal Server Error',
      };
    } else {
      // Trata outros tipos de erro
      errorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: isDev
          ? processedException instanceof Error
            ? processedException.message
            : String(processedException)
          : 'Internal Server Error',
      };
    }

    if (!this.loggerService) {
      console.error(`${errorResponse.statusCode} error: ${errorResponse.message} `);
      console.error(
        processedException instanceof Error ? processedException.stack : String(processedException),
      );
      response.status(errorResponse.statusCode).json(errorResponse);
      return;
    }

    // Log apenas do erro processado
    this.loggerService.error(`${errorResponse.statusCode} error: ${errorResponse.message} `, {
      context: 'ExceptionsFilter',
      stackTrace:
        processedException instanceof Error ? processedException.stack : String(processedException),
    });

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
