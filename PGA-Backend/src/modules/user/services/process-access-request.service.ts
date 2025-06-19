import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { SendAccessApproved } from '../../mail/services/sendAccessApproved.service';
import { TipoUsuario } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class ProcessAccessRequestService {
  constructor(
    private prisma: PrismaService,
    private sendAccessApproved: SendAccessApproved,
  ) {}

  async execute(
    solicitacaoId: number,
    usuarioId: number,
    status: string,
    tipoUsuario?: TipoUsuario,
  ) {
    // Buscar solicitação
    const solicitacao = await this.prisma.solicitacaoAcesso.findUnique({
      where: { solicitacao_id: solicitacaoId },
      include: { unidade: true },
    });

    if (!solicitacao) {
      throw new BadRequestException('Solicitação não encontrada');
    }

    if (solicitacao.status !== 'Pendente') {
      throw new BadRequestException('Esta solicitação já foi processada');
    }

    // Buscar usuário processador
    const processador = await this.prisma.pessoa.findUnique({
      where: { pessoa_id: usuarioId },
      select: { pessoa_id: true, tipo_usuario: true },
    });

    // Verificar se o processador existe
    if (!processador) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificar se tem permissão para processar
    const permissaoProcessar = [
      'Administrador',
      'CPS',
      'Regional',
      'Diretor',
    ].includes(processador.tipo_usuario);

    if (!permissaoProcessar) {
      throw new UnauthorizedException(
        'Você não tem permissão para processar solicitações de acesso',
      );
    }

    // Se for Diretor, verificar se a unidade é dele
    if (processador.tipo_usuario === 'Diretor') {
      // Correção 1: usar diretor_nome em vez de diretor_id
      const unidadeDiretor = await this.prisma.unidade.findFirst({
        where: { diretor_nome: { contains: usuarioId.toString() } },
      });

      if (
        !unidadeDiretor ||
        unidadeDiretor.unidade_id !== solicitacao.unidade_id
      ) {
        throw new UnauthorizedException(
          'Você não pode processar solicitações de outras unidades',
        );
      }
    }

    // Verificar se o tipo de usuario é compatível com quem está aprovando
    if (status === 'Aprovada') {
      if (!tipoUsuario) {
        throw new BadRequestException(
          'Tipo de usuário é obrigatório para aprovação',
        );
      }

      // Verificar hierarquia
      const nivelProcessador = this.getNivelUsuario(processador.tipo_usuario);
      const nivelSolicitado = this.getNivelUsuario(tipoUsuario);

      if (nivelSolicitado >= nivelProcessador) {
        throw new UnauthorizedException(
          'Você não pode criar usuários do mesmo nível ou superior ao seu',
        );
      }
    }

    // Atualizar o status da solicitação
    await this.prisma.solicitacaoAcesso.update({
      where: { solicitacao_id: solicitacaoId },
      data: {
        status: status as any,
        data_processamento: new Date(),
        processado_por: usuarioId,
        tipo_usuario_concedido: status === 'Aprovada' ? tipoUsuario : null,
      },
    });

    // Se foi aprovada, criar o usuário e enviar email
    if (status === 'Aprovada' && tipoUsuario) {
      // Gerar senha temporária
      const tempPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await this.hashPassword(tempPassword);

      // 1. Criar o usuário
      const novoUsuario = await this.prisma.pessoa.create({
        data: {
          nome: solicitacao.nome,
          email: solicitacao.email,
          tipo_usuario: tipoUsuario,
          senha: hashedPassword,
        },
      });

      // 2. Criar o vínculo com a unidade na tabela PessoaUnidade
      await this.prisma.pessoaUnidade.create({
        data: {
          pessoa_id: novoUsuario.pessoa_id,
          unidade_id: solicitacao.unidade_id,
          data_vinculo: new Date(),
        },
      });

      await this.sendAccessApproved.execute(
        solicitacao.email,
        solicitacao.nome,
        tempPassword,
        solicitacao.unidade.nome_completo,
        tipoUsuario as string,
      );

      return {
        success: true,
        message: `Solicitação aprovada e usuário criado. Email enviado para ${solicitacao.email}`,
      };
    } else {
      // Se foi rejeitada
      return {
        success: true,
        message: `Solicitação rejeitada com sucesso`,
      };
    }
  }

  // Helper para hash de senha
  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Helper para obter nível numérico do tipo de usuário
  private getNivelUsuario(tipoUsuario: string): number {
    const niveis = {
      Administrador: 0,
      CPS: 0,
      Regional: 1,
      Diretor: 2,
      Coordenador: 3,
      Administrativo: 3,
      Docente: 4,
    };

    return niveis[tipoUsuario] || 999;
  }
}
