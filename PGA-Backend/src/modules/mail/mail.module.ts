import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SendPasswordReset } from './services/sendPasswordReset.service';
import { SendAccessApproved } from './services/sendAccessApproved.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"Sistema PGA Fatec" <noreply@pga.com>',
      },
    }),
  ],
  providers: [SendPasswordReset, SendAccessApproved],
  exports: [SendPasswordReset, SendAccessApproved],
})
export class MailModule {}
