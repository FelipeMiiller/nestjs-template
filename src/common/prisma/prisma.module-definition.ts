import { ConfigurableModuleBuilder } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface ConfigModuleOptions {
  options?: Prisma.PrismaClientOptions;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
