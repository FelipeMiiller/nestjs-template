import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './prisma.module-definition';

@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (options) => options,
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule extends ConfigurableModuleClass {}
