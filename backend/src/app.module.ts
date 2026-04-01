import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { dataSourceOptions } from './infrastructure/database/typeorm-config';

import { AuthModule } from './application/auth/auth.module';
import { EmailModule } from './application/email/email.module';
import { NotificationsModule } from './application/notification/notification.module';
import { UsersModule } from './application/users/users.module';
import { StreamsModule } from './application/stream/stream.module';
import { CronModule } from './infrastructure/cron/cron.module';
import { FollowersModule } from './application/follower/follower.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => dataSourceOptions,
    }),

    AuthModule,
    UsersModule,
    StreamsModule,
    NotificationsModule,
    EmailModule,
    CronModule,
    FollowersModule,
  ],
})
export class AppModule {}
