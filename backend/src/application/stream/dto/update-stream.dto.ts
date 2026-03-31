import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateStreamDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
