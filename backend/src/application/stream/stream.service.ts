/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Stream, StreamStatus } from 'src/domain/entities/stream.entity';
import { User, UserRole } from 'src/domain/entities/user.entity';
import { Follow } from 'src/domain/entities/follow.entity';

import { CreateStreamDto } from './dto/create-stream.dto';

import { NotificationsService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { StreamsGateway } from './stream.gateway';
import { UpdateStreamStatusDto } from './dto/update-stream-status.dto.';

@Injectable()
export class StreamsService {
  constructor(
    @InjectRepository(Stream)
    private readonly streamRepo: Repository<Stream>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,

    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly streamsGateway: StreamsGateway,
  ) {}

  async createStream(dto: CreateStreamDto, creatorId: number) {
    const creator = await this.userRepo.findOne({
      where: { id: creatorId },
      relations: ['followers', 'followers.follower'],
    });

    if (!creator) throw new NotFoundException('Creator not found');

    if (creator.role !== UserRole.CREATOR) {
      throw new ForbiddenException('Only creators can create streams');
    }

    const stream = this.streamRepo.create({
      title: dto.title,
      description: dto.description,
      scheduledAt: new Date(dto.scheduledAt),
      creator,
      status: StreamStatus.SCHEDULED,
    });

    const savedStream = await this.streamRepo.save(stream);

    const followers = creator.followers.map((f) => f.follower);

    await Promise.all(
      followers.map((follower) =>
        this.notificationsService.createNotification({
          userId: follower.id,
          streamId: savedStream.id,
          message: `${creator.name} scheduled a new stream: "${savedStream.title}"`,
        }),
      ),
    );

    try {
      await Promise.all(
        followers.map((follower) =>
          this.emailService.sendStreamScheduledEmail(
            follower.email,
            follower.name,
            savedStream.title,
            savedStream.scheduledAt,
          ),
        ),
      );
    } catch (error) {
      console.error(error?.message);
    }

    this.streamsGateway.streamCreated(savedStream);

    return savedStream;
  }

  async getAllStreams() {
    return this.streamRepo.find({
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStreamStatus(
    streamId: number,
    dto: UpdateStreamStatusDto,
    userId: number,
  ) {
    const stream = await this.streamRepo.findOne({
      where: { id: streamId },
      relations: ['creator'],
    });

    if (!stream) throw new NotFoundException('Stream not found');

    if (stream.creator.id !== userId) {
      throw new ForbiddenException('Only creator can update stream');
    }

    if (stream.status === dto.status) return stream;

    stream.status = dto.status;

    const updatedStream = await this.streamRepo.save(stream);

    if (dto.status === StreamStatus.LIVE) {
      const followers = await this.followRepo.find({
        where: { following: { id: stream.creator.id } },
        relations: ['follower'],
      });

      await Promise.all(
        followers.map((f) =>
          this.notificationsService.createNotification({
            userId: f.follower.id,
            streamId: stream.id,
            message: `${stream.creator.name} is LIVE now: "${stream.title}"`,
          }),
        ),
      );

      try {
        await Promise.all(
          followers.map((f) =>
            this.emailService.sendStreamLiveEmail(
              f.follower.email,
              f.follower.name,
              stream.title,
            ),
          ),
        );
      } catch (error) {
        console.error(error?.message);
      }
    }

    if (dto.status === StreamStatus.CANCELLED) {
      const followers = await this.followRepo.find({
        where: { following: { id: stream.creator.id } },
        relations: ['follower'],
      });

      try {
        await Promise.all(
          followers.map((f) =>
            this.emailService.sendStreamCancelledEmail(
              f.follower.email,
              f.follower.name,
              stream.title,
            ),
          ),
        );
      } catch (error) {
        console.error(error?.message);
      }
    }

    if (dto.status === StreamStatus.COMPLETED) {
      const followers = await this.followRepo.find({
        where: { following: { id: stream.creator.id } },
        relations: ['follower'],
      });

      try {
        await Promise.all(
          followers.map((f) =>
            this.emailService.sendStreamCompletedEmail(
              f.follower.email,
              f.follower.name,
              stream.title,
            ),
          ),
        );
      } catch (error) {
        console.error(error?.message);
      }
    }

    this.streamsGateway.streamUpdated(updatedStream);

    return updatedStream;
  }

  async getCreatorStreams(creatorId: number) {
    return this.streamRepo.find({
      where: {
        creator: { id: creatorId },
      },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }
}
