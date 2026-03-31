/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.gaurd';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('scheduled')
  sendScheduledEmail(@Body() body) {
    return this.emailService.sendStreamScheduledEmail(
      body.email,
      body.name,
      body.streamTitle,
      new Date(body.scheduledAt),
    );
  }

  @Post('live')
  sendLiveEmail(@Body() body) {
    return this.emailService.sendStreamLiveEmail(
      body.email,
      body.name,
      body.streamTitle,
    );
  }

  @Post('cancelled')
  sendCancelledEmail(@Body() body) {
    return this.emailService.sendStreamCancelledEmail(
      body.email,
      body.name,
      body.streamTitle,
    );
  }

  @Post('completed')
  sendCompletedEmail(@Body() body) {
    return this.emailService.sendStreamCompletedEmail(
      body.email,
      body.name,
      body.streamTitle,
    );
  }
}
