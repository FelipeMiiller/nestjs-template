export class CreateLoggerDto {
  UserId?: string;
  level: string;
  message: string;
  context?: string;
  timestamp: Date;
}
