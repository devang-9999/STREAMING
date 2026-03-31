import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  sendStreamScheduledEmail(
    userEmail: string,
    userName: string,
    streamTitle: string,
    scheduledAt: Date,
  ) {
    return this.transporter.sendMail({
      to: userEmail,
      subject: `New Stream Scheduled: ${streamTitle}`,
      html: `
        <h3>Hello ${userName},</h3>
        <p>A new stream has been scheduled: <b>${streamTitle}</b>.</p>
        <p><b>Scheduled At:</b> ${scheduledAt.toLocaleString()}</p>
        <p>Don't miss it!</p>
      `,
    });
  }

  sendStreamLiveEmail(
    userEmail: string,
    userName: string,
    streamTitle: string,
  ) {
    return this.transporter.sendMail({
      to: userEmail,
      subject: `Live Now: ${streamTitle}`,
      html: `
        <h3>Hello ${userName},</h3>
        <p>The stream <b>${streamTitle}</b> is now LIVE.</p>
        <p>Join now and enjoy the stream!</p>
      `,
    });
  }

  sendStreamCancelledEmail(
    userEmail: string,
    userName: string,
    streamTitle: string,
  ) {
    return this.transporter.sendMail({
      to: userEmail,
      subject: `Stream Cancelled: ${streamTitle}`,
      html: `
        <h3>Hello ${userName},</h3>
        <p>The stream <b>${streamTitle}</b> has been cancelled.</p>
        <p>We’ll notify you when it's rescheduled.</p>
      `,
    });
  }

  sendStreamCompletedEmail(
    userEmail: string,
    userName: string,
    streamTitle: string,
  ) {
    return this.transporter.sendMail({
      to: userEmail,
      subject: `Stream Ended: ${streamTitle}`,
      html: `
        <h3>Hello ${userName},</h3>
        <p>The stream <b>${streamTitle}</b> has ended.</p>
        <p>Stay tuned for more upcoming streams.</p>
      `,
    });
  }
}
