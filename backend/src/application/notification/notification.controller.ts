import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notificaton.dto';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.gaurd';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(dto);
  }

  @Get(':userId')
  getUserNotifications(@Param('userId') userId: number) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: number) {
    return this.notificationsService.markAsRead(id);
  }
}
