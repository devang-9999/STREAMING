/* eslint-disable no-empty */
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Stream, StreamStatus } from 'src/domain/entities/stream.entity';
import { Follow } from 'src/domain/entities/follow.entity';

import { NotificationsService } from 'src/application/notification/notification.service';
import { EmailService } from 'src/application/email/email.service';
import { StreamsGateway } from 'src/application/stream/stream.gateway';
import { NotificationType } from 'src/domain/entities/notification.entity';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(Stream)
    private readonly streamRepo: Repository<Stream>,

    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,

    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly streamsGateway: StreamsGateway,
  ) {}

  @Cron('* * * * *')
  async handleStreamReminders() {
    const now = new Date();
    const next15Min = new Date(now.getTime() + 15 * 60 * 1000);

    const streams = await this.streamRepo.find({
      where: {
        scheduledAt: Between(now, next15Min),
        status: StreamStatus.SCHEDULED,
        reminderSent: false,
      },
      relations: ['creator'],
    });

    for (const stream of streams) {
      const followers = await this.followRepo.find({
        where: { following: { id: stream.creator.id } },
        relations: ['follower'],
      });

      const followerIds: number[] = [];

      for (const f of followers) {
        const user = f.follower;

        followerIds.push(user.id);

        await this.notificationsService.createNotification({
          userId: user.id,
          streamId: stream.id,
          message: `${stream.creator.name}'s stream "${stream.title}" starts in 15 minutes`,
          type: NotificationType.REMINDER,
        });

        try {
          await this.emailService.sendStreamReminderEmail(
            user.email,
            user.name,
            stream.title,
            stream.scheduledAt,
          );
        } catch {}
      }

      this.streamsGateway.sendBulkNotification(followerIds, {
        message: `${stream.title} starts in 15 minutes`,
        streamId: stream.id,
      });

      stream.reminderSent = true;
      await this.streamRepo.save(stream);
    }
  }
}
