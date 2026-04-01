import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NotificationType } from 'src/domain/entities/notification.entity';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  streamId: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}
