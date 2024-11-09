import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/common/loggers/logger.module';
import { User, UserSchema } from './domain/user.schema';
import { UsersManagementProcessor } from './queues/users-management.processor';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule,
        MongooseModule.forRootAsync({
            inject: [ConfigService], useFactory: async (configService: ConfigService) => configService.get('prisma'),
        
     }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersManagementProcessor],
})
export class UsersManagementModule {}
