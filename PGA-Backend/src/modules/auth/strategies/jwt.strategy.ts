import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
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
    // Verificar se o usuário ainda existe no banco de dados
    const user = await this.prisma.pessoa.findUnique({
      where: { pessoa_id: payload.sub },
      select: { pessoa_id: true, email: true, nome: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não existe ou token inválido');
    }

    return { pessoa_id: payload.sub, email: payload.email, nome: user.nome };
  }
}