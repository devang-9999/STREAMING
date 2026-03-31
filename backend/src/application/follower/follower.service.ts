import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/domain/entities/follow.entity';
import { User, UserRole } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async followUser(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    const targetUser = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.role !== UserRole.CREATOR) {
      throw new ForbiddenException('You can only follow creators');
    }

    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (existingFollow) {
      return { message: 'Already following' };
    }

    const follow = this.followRepository.create({
      follower: currentUser,
      following: targetUser,
    });

    await this.followRepository.save(follow);

    return { message: 'Creator followed successfully' };
  }

  async unfollowUser(currentUserId: number, targetUserId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    if (!follow) {
      throw new NotFoundException('Follow not found');
    }

    await this.followRepository.remove(follow);

    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: number) {
    const followers = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    return followers.map((f) => ({
      id: f.follower.id,
      name: f.follower.name,
      email: f.follower.email,
    }));
  }

  async getFollowing(userId: number) {
    const following = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return following.map((f) => ({
      id: f.following.id,
      name: f.following.name,
      email: f.following.email,
    }));
  }

  async getFollowingCount(userId: number) {
    const count = await this.followRepository.count({
      where: { follower: { id: userId } },
    });

    return { count };
  }

  async getFollowersCount(userId: number) {
    const count = await this.followRepository.count({
      where: { following: { id: userId } },
    });

    return { count };
  }

  async getFollowStatus(currentUserId: number, targetUserId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });

    return {
      isFollowing: !!follow,
    };
  }
}
