import { PrismaClientOptions } from '@prisma/client/runtime/library';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface ConfigModuleOptions {
  options?: PrismaClientOptions;
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
