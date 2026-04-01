import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Follow } from 'src/domain/entities/follow.entity';
import { User } from 'src/domain/entities/user.entity';
import { FollowersController } from './follower.controller';
import { FollowersService } from './follower.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
