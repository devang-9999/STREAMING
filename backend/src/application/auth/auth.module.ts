import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from 'src/infrastructure/jwt/jwt.strategy';
import { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN as StringValue,
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
