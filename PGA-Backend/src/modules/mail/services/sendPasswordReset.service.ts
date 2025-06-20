import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendPasswordReset {
  constructor(private mailerService: MailerService) {}

  async execute(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Redefinição de Senha - PGA Fatec',
      html: `
        <h1>Redefinição de Senha</h1>
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
        <p>O link expira em 1 hora.</p>
      `,
    });
  }
}
