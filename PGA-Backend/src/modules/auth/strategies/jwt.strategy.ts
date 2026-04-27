import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../config/prisma.service';
import { Request } from 'express';

function cookieOrBearerExtractor(req: Request): string | null {
  // Prefer cookie; fall back to Authorization header (for Swagger/mobile)
  const fromCookie = req?.cookies?.access_token ?? null;
  if (fromCookie) return fromCookie;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

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
      jwtFromRequest: cookieOrBearerExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.pessoa.findUnique({
      where: {
        pessoa_id: payload.pessoa_id,
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

    const active_context = (payload && (payload as any).active_context) || null;

    return {
      pessoa_id: user.pessoa_id,
      email: user.email,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
      active_context,
    };
  }
}
