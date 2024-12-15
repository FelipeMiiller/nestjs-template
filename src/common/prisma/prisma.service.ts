import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { softDeleteMiddleware } from './softDeleteMiddleware';
import { MODULE_OPTIONS_TOKEN } from './prisma.module-definition';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Optional()
    @Inject(MODULE_OPTIONS_TOKEN)
    private options?: Prisma.PrismaClientOptions,
  ) {
    super(options);
  }

  async onModuleInit() {
    await this.$connect();
    softDeleteMiddleware(this);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
