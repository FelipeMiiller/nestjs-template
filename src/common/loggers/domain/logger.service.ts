/* eslint-disable no-console */
import { createLogger, format, Logger, transports } from 'winston';
import { Injectable, Scope, Optional } from '@nestjs/common';
import { LoggersRepository } from './repositories/logger.repository';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogMetadata {
  context?: string;
  stackTrace?: any;
  idempotency?: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private _idempotencyKey: string;
  private _contextName = 'Default';
  private readonly logger: Logger = createLogger();

  constructor(@Optional() private readonly loggersRepository?: LoggersRepository) {
    this.logger.configure({
      transports: [this.logTransportConsole()],
      exitOnError: false,
    });
  }

  set idempotencyKey(idempotencyKey: string) {
    this._idempotencyKey = idempotencyKey;
  }

  get idempotencyKey(): string {
    return this._idempotencyKey;
  }

  set contextName(contextName: string) {
    this._contextName = contextName;
  }

  get contextName(): string {
    return this._contextName;
  }

  private async createAuditLog(
    level: string,
    message: string,
    context: string,
    UserId?: string,
  ): Promise<void> {
    try {
      if (this.loggersRepository) {
        await this.loggersRepository.create({
          level,
          message,
          context,
          timestamp: new Date(),
          UserId: UserId,
        });
      }
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  error(message: string, stackTrace?: any, auditable = false, UserId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      stackTrace,
      idempotency: this._idempotencyKey,
    };

    this.logger.log({
      level: LogLevel.ERROR,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.ERROR, message, this._contextName, UserId);
    }
  }

  warn(message: string, auditable = false, UserId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      idempotency: this._idempotencyKey,
    };
    this.logger.log({
      level: LogLevel.WARN,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.WARN, message, this._contextName, UserId);
    }
  }

  info(message: string, auditable = false, UserId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      idempotency: this._idempotencyKey,
    };

    this.logger.log({
      level: LogLevel.INFO,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.INFO, message, this._contextName, UserId);
    }
  }

  private logTransportConsole() {
    return new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.timestamp(),
        format.printf((info) => {
          const { timestamp, level, message, meta } = info;
          const context = (meta as { context?: string })?.context ?? '';

          return (
            `${timestamp} [${level.toLocaleUpperCase()}] [${context ?? ''}] ` +
            `${message} ${JSON.stringify(meta)}`
          );
        }),
      ),
    });
  }
}
