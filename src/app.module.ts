import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig, { pathEnv } from 'src/config/app.config';
import typeormConfig from 'src/config/typeorm.config';
import { LoggerModule } from 'src/common/loggers/logger.module';
//import { UsersModule } from 'src/modules/users/users.module';
import { UploadS3Module } from 'src/common/s3/uploader3.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import redisConfig from 'src/config/redis.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from 'src/config/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [pathEnv, '.env'],
      isGlobal: true,
      load: [appConfig, typeormConfig, mongoConfig],
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
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
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('mongo.uri'),
          dbName: configService.get<string>('mongo.dbName'),
        };
      },
    }),
    UploadS3Module,
    LoggerModule,
    // UsersModule,
  ],

  exports: [ConfigModule],
})
export class AppModule {}
