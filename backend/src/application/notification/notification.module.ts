import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from 'src/domain/entities/notification.entity';
import { User } from 'src/domain/entities/user.entity';
import { Stream } from 'src/domain/entities/stream.entity';

import { NotificationsService } from './notification.service';
import { NotificationsController } from './notification.controller';
import { StreamsModule } from '../stream/stream.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, User, Stream]),
    forwardRef(() => StreamsModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
