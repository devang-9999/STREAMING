/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.gaurd';
import { FollowersService } from './follower.service';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  followUser(@Req() req, @Param('id', ParseIntPipe) targetUserId: number) {
    return this.followersService.followUser(req.user.userId, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  unfollowUser(@Req() req, @Param('id', ParseIntPipe) targetUserId: number) {
    return this.followersService.unfollowUser(req.user.userId, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followers/:id')
  getFollowers(@Param('id', ParseIntPipe) userId: number) {
    return this.followersService.getFollowers(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following/:id')
  getFollowing(@Param('id', ParseIntPipe) userId: number) {
    return this.followersService.getFollowing(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('followers-count/:id')
  getFollowersCount(@Param('id', ParseIntPipe) userId: number) {
    return this.followersService.getFollowersCount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('following-count/:id')
  getFollowingCount(@Param('id', ParseIntPipe) userId: number) {
    return this.followersService.getFollowingCount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:id')
  getFollowStatus(@Req() req, @Param('id', ParseIntPipe) targetUserId: number) {
    return this.followersService.getFollowStatus(req.user.userId, targetUserId);
  }
}
