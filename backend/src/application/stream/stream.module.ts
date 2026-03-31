import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from 'src/domain/entities/stream.entity';
import { ActivityLog } from 'src/domain/entities/activity-log.entity';
import { Notification } from 'src/domain/entities/notification.entity';

import { TasksController } from './stream.controller';
import { TasksService } from './stream.service';
import { TasksGateway } from './stream.gateway';

import { ActivityLogsService } from '../activity-log/activity-log.service';
import { NotificationsService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, ActivityLog, Notification])],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksGateway,
    ActivityLogsService,
    NotificationsService,
    EmailService,
  ],
  exports: [TasksService, TasksGateway],
})
export class TasksModule {}
