import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StreamsService } from './stream.service';
import { StreamsController } from './stream.controller';
import { StreamsGateway } from './stream.gateway';

import { Stream } from 'src/domain/entities/stream.entity';
import { User } from 'src/domain/entities/user.entity';
import { Follow } from 'src/domain/entities/follow.entity';
import { Notification } from 'src/domain/entities/notification.entity';

import { NotificationsModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stream, User, Follow, Notification]),

    forwardRef(() => NotificationsModule),

    EmailModule,
  ],
  controllers: [StreamsController],

  providers: [StreamsService, StreamsGateway],

  exports: [StreamsService, StreamsGateway],
})
export class StreamsModule {}
