import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendPasswordReset {
  constructor(private mailerService: MailerService) {}

  async execute(email: string, token: string, firstAccess = false) {
    const baseLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const resetLink = firstAccess ? `${baseLink}&firstAccess=true` : baseLink;

    const subject = firstAccess
      ? 'Acesso Liberado - PGA Fatec'
      : 'Redefinição de Senha - PGA Fatec';

    const html = firstAccess
      ? `
        <h1>Acesso Liberado!</h1>
        <p>Seu cadastro no sistema PGA Fatec foi realizado com sucesso.</p>
        <p>Clique no link abaixo para definir sua senha e acessar o sistema:</p>
        <a href="${resetLink}">Definir Minha Senha</a>
        <p>O link expira em 1 hora.</p>
      `
      : `
        <h1>Redefinição de Senha</h1>
        <p>Você solicitou a redefinição de senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
        <p>O link expira em 1 hora.</p>
      `;

    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
