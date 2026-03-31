import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from 'src/domain/entities/notification.entity';
import { Task } from 'src/domain/entities/stream.entity';
import { User } from 'src/domain/entities/user.entity';

import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';

import { TasksModule } from '../stream/stream.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User, Task]), TasksModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
