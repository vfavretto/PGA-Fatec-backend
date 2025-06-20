import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendAccessApproved {
  constructor(private mailerService: MailerService) {}

  async execute(
    email: string,
    nome: string,
    senha: string,
    unidade: string,
    tipoUsuario: string,
  ) {
    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Acesso Aprovado - Sistema PGA Fatec',
      html: `
        <h1>Bem-vindo(a) ao Sistema PGA Fatec!</h1>
        <p>Olá ${nome},</p>
        <p>Sua solicitação de acesso para a unidade <strong>${unidade}</strong> foi aprovada com o perfil de <strong>${tipoUsuario}</strong>.</p>
        
        <h2>Suas credenciais de acesso:</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Senha temporária:</strong> ${senha}</p>
        
        <p>Acesse o sistema através do link abaixo:</p>
        <a href="${loginUrl}" style="background-color:#ae0f0a;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;display:inline-block;margin:10px 0;">Acessar o Sistema PGA</a>
        
        <p><strong>Importante:</strong> Por razões de segurança, recomendamos que você altere sua senha temporária no primeiro acesso.</p>
        
        <p>Em caso de dúvidas, entre em contato com o administrador do sistema.</p>
        
        <p>Atenciosamente,<br>
        Equipe PGA Fatec</p>
      `,
    });
  }
}
