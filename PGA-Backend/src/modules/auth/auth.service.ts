import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.pessoa.findUnique({
      where: { email },
      select: {
        pessoa_id: true,
        email: true,
        senha: true,
        nome: true,
      },
    });

    if (user && user.senha) {
      if (user && (await bcrypt.compare(password, user.senha))) {
        const { senha, ...result } = user;
        return result;
      }
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(user: any): Promise<TokenDto> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
