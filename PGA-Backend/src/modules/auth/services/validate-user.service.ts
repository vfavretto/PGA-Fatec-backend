import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ValidateUserService {
  constructor(private prisma: PrismaService) {}

  async execute(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.pessoa.findUnique({
        where: { email },
        select: {
          pessoa_id: true,
          email: true,
          senha: true,
          nome: true,
          tipo_usuario: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      if (!user.senha) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, user.senha);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const { senha, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro na autenticação');
    }
  }
}
