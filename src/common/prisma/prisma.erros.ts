import { HttpException, HttpStatus } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export class PrismaException extends HttpException {
  constructor(error: any) {
    const { message, statusCode } = PrismaException.handleError(error);
    super(message, statusCode);
  }

  getStatus(): number {
    return this.getResponse()['statusCode'] || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  static handleError(error: PrismaClientKnownRequestError | Error): {
    message: string;
    details?: string;
    statusCode: number;
    code?: string;
    meta?: Record<string, any>;
  } {
    if (error instanceof PrismaClientKnownRequestError) {
      const { code, meta } = error;
      console.log('code', code, 'meta', meta);
      switch (code) {
        case 'P2002':
          const fields = meta?.target;

          // Ensure fields is an array before calling join
          const fieldNames = Array.isArray(fields)
            ? fields.join(', ')
            : typeof fields === 'string'
              ? fields
              : 'campo desconhecido';
          return {
            message: `Já existe um registro com ${
              Array.isArray(fields) && fields.length > 1 ? 'estes campos' : 'este campo'
            }: ${fieldNames}`,
            details: 'Já existe um registro com esse valor único.',
            statusCode: HttpStatus.CONFLICT,
            code,
            meta,
          };

        case 'P2018':
          return {
            message: 'Registros relacionados não encontrados',
            details: meta?.details
              ? ` ${JSON.stringify(meta)}`
              : 'Os registros relacionados necessários não foram encontrados.',
            statusCode: HttpStatus.BAD_REQUEST,
            code,
            meta,
          };

        case 'P2025':
          return {
            message: 'Registro não encontrado no banco de dados',
            details: 'Nenhum registro correspondente foi encontrado no banco de dados.',
            statusCode: HttpStatus.NOT_FOUND,
            code,
            meta,
          };

        case 'P2003':
          return {
            message: 'Violação de chave estrangeira',
            details: 'O registro que está sendo referenciado não existe ou foi removido.',
            statusCode: HttpStatus.BAD_REQUEST,
            code,
            meta,
          };

        case 'P2014':
          return {
            message: 'Violação de integridade relacional',
            details: 'A operação resultaria em registros órfãos ou violaria restrições do banco.',
            statusCode: HttpStatus.BAD_REQUEST,
            code,
            meta,
          };

        default:
          return {
            message: `Erro do banco de dados: ${error.message}`,
            details: 'Ocorreu um erro interno do banco de dados.',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            code,
            meta,
          };
      }
    }

    if (error instanceof PrismaClientValidationError) {
      const errorMessage = error.message;
      console.log('errorMessage', errorMessage);
      const lines = errorMessage.split('\n');

      const missingArgLine = lines.find((line) => line.includes('Argument'));
      const dataLine = lines.find((line) => line.includes('data:'));
      const unknownFieldLine = lines.find((line) => line.includes('Unknown argument'));

      let formattedMessage = 'Erro de validação nos dados enviados';
      let details = '';

      if (missingArgLine) {
        const fieldMatch = missingArgLine.match(/Argument `(.+)` is missing/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          formattedMessage = `Campo obrigatório '${fieldName}' não foi informado`;
        }
      }

      if (dataLine) {
        const dataStart = lines.indexOf(dataLine);
        const dataEnd = lines.findIndex((line, index) => index > dataStart && line.includes('}'));

        if (dataStart > -1 && dataEnd > -1) {
          const data = lines
            .slice(dataStart, dataEnd + 1)
            .map((line) => line.trim())
            .join('\n');
          details = `Dados enviados:\n${data}`;
        }
      }

      if (unknownFieldLine) {
        const fieldMatch = unknownFieldLine.match(/Unknown argument `(.+)`/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          formattedMessage = `Campo desconhecido '${fieldName}'`;
        }
      }

      return {
        message: formattedMessage,
        details: details || errorMessage,
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
      };
    }

    return {
      message: error.message || 'Erro interno do servidor',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'UNKNOWN_ERROR',
    };
  }
}
