import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('scheduled')
  sendScheduledEmail(
    @Body()
    body: {
      email: string;
      name: string;
      title: string;
      scheduledAt: Date;
    },
  ) {
    return this.emailService.sendStreamScheduledEmail(
      body.email,
      body.name,
      body.title,
      new Date(body.scheduledAt),
    );
  }

  @Post('reminder')
  sendReminderEmail(
    @Body()
    body: {
      email: string;
      name: string;
      title: string;
      scheduledAt: Date;
    },
  ) {
    return this.emailService.sendStreamReminderEmail(
      body.email,
      body.name,
      body.title,
      new Date(body.scheduledAt),
    );
  }

  @Post('live')
  sendLiveEmail(
    @Body()
    body: {
      email: string;
      name: string;
      title: string;
    },
  ) {
    return this.emailService.sendStreamLiveEmail(
      body.email,
      body.name,
      body.title,
    );
  }

  @Post('cancelled')
  sendCancelledEmail(
    @Body()
    body: {
      email: string;
      name: string;
      title: string;
    },
  ) {
    return this.emailService.sendStreamCancelledEmail(
      body.email,
      body.name,
      body.title,
    );
  }

  @Post('completed')
  sendCompletedEmail(
    @Body()
    body: {
      email: string;
      name: string;
      title: string;
    },
  ) {
    return this.emailService.sendStreamCompletedEmail(
      body.email,
      body.name,
      body.title,
    );
  }
}
