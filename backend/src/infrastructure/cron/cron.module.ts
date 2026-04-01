import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CronService } from './cron.service';

import { Stream } from 'src/domain/entities/stream.entity';
import { Follow } from 'src/domain/entities/follow.entity';
import { NotificationsModule } from 'src/application/notification/notification.module';
import { EmailModule } from 'src/application/email/email.module';
import { StreamsModule } from 'src/application/stream/stream.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stream, Follow]),
    NotificationsModule,
    EmailModule,
    StreamsModule,
  ],
  providers: [CronService],
})
export class CronModule {}
