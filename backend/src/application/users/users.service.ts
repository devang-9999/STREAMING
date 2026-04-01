import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/domain/entities/user.entity';
import { UserRole } from 'src/common/userRole.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getAllCreators(currentUser: User) {
    if (currentUser.role !== UserRole.USER) {
      throw new ForbiddenException('Only users can view creators');
    }

    return this.userRepo.find({
      where: { role: UserRole.CREATOR },
      select: ['id', 'name', 'email', 'role'],
    });
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
