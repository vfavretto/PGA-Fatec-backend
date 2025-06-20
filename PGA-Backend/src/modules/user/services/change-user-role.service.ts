import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { PrismaService } from '../../../config/prisma.service';
import { TipoUsuario } from '@prisma/client';

@Injectable()
export class ChangeUserRoleService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    userId: number,
    novoTipo: TipoUsuario,
    unidadeId?: number,
    usuarioLogadoId?: number,
  ) {
    // 1. Verificar se o usuário existe
    const usuario = await this.userRepository.findById(userId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // 2. Verificar permissões do usuário logado
    if (usuarioLogadoId) {
      const usuarioLogado = await this.userRepository.findById(usuarioLogadoId);
      const podeAlterarTipo =
        usuarioLogado?.tipo_usuario === 'Administrador' ||
        usuarioLogado?.tipo_usuario === 'CPS';

      if (!podeAlterarTipo) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar o cargo de usuários',
        );
      }
    }

    // 3. Processar a alteração em uma transação
    return this.prisma.$transaction(async (tx) => {
      // Dados para auditoria
      const dadosAntigos = { ...usuario };

      // 3.1 Caso esteja removendo o tipo Diretor
      if (usuario.tipo_usuario === 'Diretor' && novoTipo !== 'Diretor') {
        // Verificar se o usuário é diretor de alguma unidade
        const unidadeDirigida = await tx.unidade.findFirst({
          where: { diretor_id: userId },
        });

        if (unidadeDirigida) {
          // Remover vínculo como diretor
          await tx.unidade.update({
            where: { unidade_id: unidadeDirigida.unidade_id },
            data: { diretor_id: null },
          });
        }
      }

      // 3.2 Caso esteja definindo como Diretor
      if (novoTipo === 'Diretor') {
        if (!unidadeId) {
          throw new ForbiddenException(
            'É necessário informar uma unidade ao definir um usuário como Diretor',
          );
        }

        // Verificar se a unidade existe
        const unidade = await tx.unidade.findUnique({
          where: { unidade_id: unidadeId },
          include: { diretor: true },
        });

        if (!unidade) {
          throw new NotFoundException('Unidade não encontrada');
        }

        // Verificar se já existe diretor
        if (unidade.diretor_id && unidade.diretor_id !== userId) {
          throw new ConflictException(
            `A unidade já possui um diretor (${unidade.diretor!.nome}). Remova o diretor atual antes de definir um novo.`,
          );
        }

        // Definir como diretor da unidade
        await tx.unidade.update({
          where: { unidade_id: unidadeId },
          data: { diretor_id: userId },
        });
      }

      // 3.3 Atualizar o tipo do usuário
      const usuarioAtualizado = await tx.pessoa.update({
        where: { pessoa_id: userId },
        data: { tipo_usuario: novoTipo },
      });
    });
  }
}
