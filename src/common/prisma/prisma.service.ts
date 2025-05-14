import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { softDeleteMiddleware } from './softDeleteMiddleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    const prismaOptions = configService.get('prisma.postgres');
    super(prismaOptions);
  }

  async onModuleInit() {
    await this.$connect();
    softDeleteMiddleware(this);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
