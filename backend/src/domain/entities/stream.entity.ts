import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum StreamStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Stream {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({
    type: 'enum',
    enum: StreamStatus,
    default: StreamStatus.SCHEDULED,
  })
  status: StreamStatus;

  @ManyToOne(() => User, (user) => user.createdStreams, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
