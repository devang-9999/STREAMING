import { IsEnum } from 'class-validator';

export enum StreamStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateStreamStatusDto {
  @IsEnum(StreamStatus)
  status: StreamStatus;
}
