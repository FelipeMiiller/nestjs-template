import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig, { pathEnv } from 'src/config/app.config';
import typeormConfig from 'src/config/typeorm.config';
import { LoggerModule } from 'src/common/loggers/logger.module';
import { UsersModule } from 'src/modules/users/users.module';
import { UploadS3Module } from 'src/common/s3/uploader3.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import redisConfig from 'src/config/redis.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/common/prisma/prisma.module';

@Module({
  imports: [
    UploadS3Module,
    UsersModule,
    EventEmitterModule.forRoot(),
    PrismaModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          options: {
            datasources: {
              db: {
                url: configService.get('prisma.url'),
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redisConfig] })],
      useFactory: (configDatabase: ConfigType<typeof redisConfig>) => ({
        connection: {
          port: configDatabase.port,
          host: configDatabase.host,
        },
      }),
      inject: [redisConfig.KEY],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
    }),
    ,
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: [pathEnv, '.env'],
      isGlobal: true,
      load: [appConfig, typeormConfig],
    }),
  ],

  exports: [ConfigModule],
})
export class AppModule {}
