import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { Pessoa } from '@prisma/client';
import { PrismaService } from '../../../config/prisma.service';
import { AuditRepository } from '../../audit/repositories/audit.repository';
import { TipoOperacaoAuditoria } from '@prisma/client';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
    private readonly auditRepository: AuditRepository,
  ) {}

  async execute(
    id: number,
    usuarioLogadoId?: number,
    motivo?: string,
  ): Promise<Pessoa> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificações lógicas (mantidas do seu código)
    const projetosVinculados = await this.prisma.projetoPessoa.count({
      where: {
        pessoa_id: id,
        ativo: true,
      },
    });

    if (projetosVinculados > 0) {
      throw new ConflictException(
        'Este usuário não pode ser excluído pois está vinculado a projetos ativos',
      );
    }

    const coordenadorEmCursos = await this.prisma.curso.count({
      where: {
        coordenador_id: id,
        ativo: true,
      },
    });

    if (coordenadorEmCursos > 0) {
      throw new ConflictException(
        'Este usuário não pode ser excluído pois é coordenador de cursos ativos',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.pessoaUnidade.updateMany({
        where: {
          pessoa_id: id,
          ativo: true,
        },
        data: { ativo: false },
      });

      await this.auditRepository.createAuditLog({
        tabela: 'pessoa_unidade',
        registro_id: id,
        ano: new Date().getFullYear(),
        operacao: TipoOperacaoAuditoria.DELETE,
        dados_antes: { pessoa_id: id, ativo: true },
        dados_depois: { pessoa_id: id, ativo: false },
        usuario_id: usuarioLogadoId,
        motivo,
      });

      const updatedUser = await tx.pessoa.update({
        where: { pessoa_id: id },
        data: {
          ativo: false,
          atualizado_por: usuarioLogadoId,
          atualizado_em: new Date(),
        },
      });

      // Registrar na auditoria a alteração do usuário
      await this.auditRepository.createAuditLog({
        tabela: 'pessoa',
        registro_id: id,
        ano: new Date().getFullYear(),
        operacao: TipoOperacaoAuditoria.DELETE,
        dados_antes: { ...user, ativo: true },
        dados_depois: updatedUser,
        usuario_id: usuarioLogadoId,
        motivo,
      });

      return updatedUser;
    });
  }
}
