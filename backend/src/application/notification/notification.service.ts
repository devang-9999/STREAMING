import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/domain/entities/notification.entity';
import { Stream } from 'src/domain/entities/stream.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notificaton.dto';
import { User } from 'src/domain/entities/user.entity';
import { StreamsGateway } from '../stream/stream.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Stream)
    private streamRepo: Repository<Stream>,

    private streamsGateway: StreamsGateway,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const user = await this.userRepo.findOne({
      where: { id: dto.userId },
    });

    const stream = await this.streamRepo.findOne({
      where: { id: dto.streamId },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!stream) throw new NotFoundException('Stream not found');

    const notification = this.notificationRepo.create({
      user,
      stream,
      message: dto.message,
    });

    const saved = await this.notificationRepo.save(notification);

    this.streamsGateway.sendNotification(dto.userId, saved);

    return saved;
  }

  async getUserNotifications(userId: number) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      relations: ['stream'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    notification.isRead = true;

    return this.notificationRepo.save(notification);
  }
}
