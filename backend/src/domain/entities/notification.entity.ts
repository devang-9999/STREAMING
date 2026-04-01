import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Stream } from './stream.entity';

export enum NotificationType {
  SCHEDULED = 'scheduled',
  REMINDER = 'reminder',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => Stream)
  stream: Stream;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @CreateDateColumn()
  createdAt: Date;
}
