/* eslint-disable @typescript-eslint/no-unsafe-return */
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

  async sendStreamScheduledEmail(
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
        <p>A new stream has been scheduled:</p>
        <p><b>${streamTitle}</b></p>
        <p><b>Scheduled At:</b> ${scheduledAt.toLocaleString()}</p>
        <p>Don't miss it!</p>
      `,
    });
  }

  async sendStreamReminderEmail(
    userEmail: string,
    userName: string,
    streamTitle: string,
    scheduledAt: Date,
  ) {
    return this.transporter.sendMail({
      to: userEmail,
      subject: `Reminder: ${streamTitle} starts in 15 minutes`,
      html: `
        <h3>Hello ${userName},</h3>
        <p>Your followed creator is going live soon.</p>
        <p><b>${streamTitle}</b></p>
        <p><b>Starts At:</b> ${scheduledAt.toLocaleString()}</p>
        <p><b>Starting in 15 minutes!</b></p>
        <p>Be ready 🎥</p>
      `,
    });
  }

  async sendStreamLiveEmail(
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

  async sendStreamCancelledEmail(
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

  async sendStreamCompletedEmail(
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
