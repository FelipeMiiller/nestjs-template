import { Processor } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { UserCreatedEvent } from 'src/common/events/user-created.event';
import { LoggerService } from 'src/common/loggers/domain/logger.service';
import { User } from '../domain/user.schema';
import { Scope } from '@nestjs/common';

@Processor({
  name: 'users',
  scope: Scope.REQUEST,
})
export class UsersManagementProcessor {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
    this.loggerService.contextName = UsersManagementProcessor.name;
  }

  async process(job: Job<UserCreatedEvent, any, string>): Promise<any> {
    switch (job.name) {
      case 'user.created': {
        await this.verify(job);
      }
      case 'user.email.send': {
        await this.sendEmail(job);
        break;
      }
    }
  }

  private async verify({ data }: Job<UserCreatedEvent>) {
    this.loggerService.info(`Called method: ${this.verify.name}()`);
    const createdUser = await this.userModel.create(data);
    this.loggerService.info(`USER CREATED: ${JSON.stringify(createdUser)}`);
  }

  private async sendEmail({ data }: Job<UserCreatedEvent>) {
    this.loggerService.info(`Called method: ${this.sendEmail.name}()`);
    const createdUser = await this.userModel.create(data);
    this.loggerService.info(`USER SEND EMAIL: ${JSON.stringify(createdUser)}`);
  }
}
