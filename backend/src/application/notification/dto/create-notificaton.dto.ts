import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  streamId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
