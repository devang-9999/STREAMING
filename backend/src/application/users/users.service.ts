import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from 'src/domain/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getAllCreators() {
    return this.userRepo.find({
      where: {
        role: UserRole.CREATOR,
      },
      select: ['id', 'name', 'email'],
    });
  }
}
