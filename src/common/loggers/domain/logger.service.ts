/* eslint-disable no-console */
import { createLogger, format, Logger, transports } from 'winston';
import { Injectable, Scope, Optional } from '@nestjs/common';
import { LoggersRepository } from './repositories/logger.repository';

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
  AUDIT = 'audit',
}

interface LogMetadata {
  context?: string;

  idempotency?: string;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private _idempotencyKey: string;
  private _contextName = 'Logger';
  private readonly logger: Logger = createLogger();

  constructor(@Optional() private readonly loggersRepository?: LoggersRepository) {
    this.logger.configure({
      transports: [this.logTransportConsole()],
      exitOnError: false,
    });
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
    meta?: LogMetadata,
    userId?: string,
  ): Promise<void> {
    if (!this.loggersRepository) return;

    try {
      await this.loggersRepository.create({
        level,
        message,
        context,
        timestamp: new Date(),
        ...(userId && { userId }),
        ...(meta && { meta }),
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  error(message: string, meta?: Record<string, unknown>, auditable = false, userId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      idempotency: this._idempotencyKey,
      ...(meta || {}),
    };

    this.logger.log({
      level: LogLevel.ERROR,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.ERROR, message, this._contextName, metadata, userId);
    }
  }

  warn(message: string, meta?: Record<string, unknown>, auditable = false, userId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      idempotency: this._idempotencyKey,
      ...(meta || {}),
    };

    this.logger.log({
      level: LogLevel.WARN,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.WARN, message, this._contextName, metadata, userId);
    }
  }

  info(message: string, meta?: Record<string, unknown>, auditable = false, userId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      idempotency: this._idempotencyKey,
      ...(meta || {}),
    };

    this.logger.log({
      level: LogLevel.INFO,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.INFO, message, this._contextName, metadata, userId);
    }
  }

  debug(message: string, meta?: Record<string, unknown>, auditable = false, userId?: string): void {
    const metadata: LogMetadata = {
      context: this._contextName,
      idempotency: this._idempotencyKey,
      ...(meta || {}),
    };

    this.logger.log({
      level: LogLevel.DEBUG,
      message,
      meta: metadata,
    });

    if (auditable) {
      this.createAuditLog(LogLevel.DEBUG, message, this._contextName, metadata, userId);
    }
  }

  /**
   * Registra um log de auditoria, marcando o meta.audit = true para fácil filtragem.
   * @param message Mensagem de auditoria
   * @param meta Metadados adicionais
   * @param context Nome do contexto
   * @param userId ID do usuário responsável
   */
  audit(message: string, meta?: Record<string, unknown>, context?: string, userId?: string): void {
    this.logger.data(message, meta, true, userId);

    // Se desejar persistir audit logs no repositório, pode usar createAuditLog
    this.createAuditLog(LogLevel.AUDIT, message, context, meta, userId);
  }
}
