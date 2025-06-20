import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está configurado no ambiente');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.pessoa.findUnique({
      where: {
        pessoa_id: Number(payload.pessoa_id),
      },
      select: {
        pessoa_id: true,
        email: true,
        nome: true,
        tipo_usuario: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não existe ou token inválido');
    }

    return {
      pessoa_id: user.pessoa_id,
      email: user.email,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
    };
  }
}
