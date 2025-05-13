import { Inject, Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { softDeleteMiddleware } from './softDeleteMiddleware';
import { MODULE_OPTIONS_TOKEN } from './prisma.module-definition';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Optional()
    @Inject(MODULE_OPTIONS_TOKEN)
    private options?: PrismaClientOptions,
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
