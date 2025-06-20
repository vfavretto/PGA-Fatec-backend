import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
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

    const processador = await this.prisma.pessoa.findUnique({
      where: { pessoa_id: usuarioId },
      select: { pessoa_id: true, tipo_usuario: true },
    });

    if (!processador) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

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

    if (processador.tipo_usuario === 'Diretor') {
      const unidadeDiretor = await this.prisma.unidade.findFirst({
        where: { 
          diretor_id: usuarioId,
          ativo: true
        },
      });

      if (!unidadeDiretor || unidadeDiretor.unidade_id !== solicitacao.unidade_id) {
        throw new UnauthorizedException(
          'Você não pode processar solicitações de outras unidades'
        );
      }
    }

    if (status === 'Aprovada') {
      if (!tipoUsuario) {
        throw new BadRequestException(
          'Tipo de usuário é obrigatório para aprovação',
        );
      }

      const nivelProcessador = this.getNivelUsuario(processador.tipo_usuario);
      const nivelSolicitado = this.getNivelUsuario(tipoUsuario);

      if (processador.tipo_usuario === 'Administrador' || processador.tipo_usuario === 'CPS') {
      } else {
        if (nivelSolicitado <= nivelProcessador) {
          throw new UnauthorizedException(
            'Você não pode criar usuários do mesmo nível ou superior ao seu',
          );
        }
      }
    }

    await this.prisma.solicitacaoAcesso.update({
      where: { solicitacao_id: solicitacaoId },
      data: {
        status: status as any,
        data_processamento: new Date(),
        processado_por: usuarioId,
        tipo_usuario_concedido: status === 'Aprovada' ? tipoUsuario : null,
      },
    });

    if (status === 'Aprovada' && tipoUsuario) {
      const tempPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await this.hashPassword(tempPassword);

      if (tipoUsuario === 'Diretor') {
        const unidadeAtual = await this.prisma.unidade.findUnique({
          where: { unidade_id: solicitacao.unidade_id },
          select: { diretor_id: true, nome_completo: true }
        });

        if (unidadeAtual?.diretor_id) {
          throw new ConflictException(`A unidade ${unidadeAtual.nome_completo} já possui um diretor atribuído. Remova o diretor atual antes de atribuir um novo.`);
        }
      }

      const novoUsuario = await this.prisma.pessoa.create({
        data: {
          nome: solicitacao.nome,
          email: solicitacao.email,
          tipo_usuario: tipoUsuario,
          senha: hashedPassword,
        },
      });

      await this.prisma.pessoaUnidade.create({
        data: {
          pessoa_id: novoUsuario.pessoa_id,
          unidade_id: solicitacao.unidade_id,
          data_vinculo: new Date(),
        },
      });

      if (tipoUsuario === 'Diretor') {
        await this.prisma.unidade.update({
          where: { unidade_id: solicitacao.unidade_id },
          data: { diretor_id: novoUsuario.pessoa_id },
        });
      }

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
      return {
        success: true,
        message: `Solicitação rejeitada com sucesso`,
      };
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

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
