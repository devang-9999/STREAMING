import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Notification,
  NotificationType,
} from 'src/domain/entities/notification.entity';
import { Stream } from 'src/domain/entities/stream.entity';
import { User } from 'src/domain/entities/user.entity';

import { StreamsGateway } from '../stream/stream.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Stream)
    private readonly streamRepo: Repository<Stream>,

    private readonly streamsGateway: StreamsGateway,
  ) {}

  async createNotification(data: {
    userId: number;
    streamId: number;
    message: string;
    type: NotificationType;
  }) {
    const user = await this.userRepo.findOne({
      where: { id: data.userId },
    });

    const stream = await this.streamRepo.findOne({
      where: { id: data.streamId },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!stream) throw new NotFoundException('Stream not found');

    const notification = this.notificationRepo.create({
      user,
      stream,
      message: data.message,
      type: data.type,
    });

    const saved = await this.notificationRepo.save(notification);

    this.streamsGateway.sendNotification(data.userId, saved);

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

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;

    return this.notificationRepo.save(notification);
  }
}
