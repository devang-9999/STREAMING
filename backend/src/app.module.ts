import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from './infrastructure/database/typeorm-config';

import { AuthModule } from './application/auth/auth.module';
import { EmailModule } from './application/email/email.module';
import { TasksModule } from './application/stream/stream.module';
import { ActivityLogsModule } from './application/activity-log/activity-log.module';
import { NotificationsModule } from './application/notification/notification.module';
import { SeedModule } from './infrastructure/seeder/seed.module';
import { UsersModule } from './application/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(dataSourceOptions),
    SeedModule,
    AuthModule,
    EmailModule,
    TasksModule,
    ActivityLogsModule,
    NotificationsModule,
    UsersModule,
  ],
})
export class AppModule {}
