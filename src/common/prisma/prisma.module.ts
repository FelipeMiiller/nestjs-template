import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MODULE_OPTIONS_TOKEN } from './prisma.module-definition';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: (options: PrismaClientOptions) => new PrismaService(options),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {
  static forRootAsync(options: {
    imports?: any[];
    isGlobal?: boolean;
    useFactory: (...args: any[]) => Promise<PrismaClientOptions> | PrismaClientOptions;
    inject?: any[];
  }): DynamicModule {
    const asyncProviders: Provider[] = [
      {
        provide: MODULE_OPTIONS_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
    return {
      module: PrismaModule,
      providers: [
        ...asyncProviders,
        {
          provide: PrismaService,
          useFactory: (prismaOptions: PrismaClientOptions) => new PrismaService(prismaOptions),
          inject: [MODULE_OPTIONS_TOKEN],
        },
      ],
      exports: [PrismaService],
    };
  }
}
