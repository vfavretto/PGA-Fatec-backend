import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dto/token.dto';
import { LoginPayload } from '../interfaces/loginPayload.interface';

@Injectable()
export class LoginService {
  constructor(private jwtService: JwtService) {}

  execute(user: LoginPayload): Promise<TokenDto> {
    if (!user || !user.email || !user.pessoa_id) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      email: user.email,
      pessoa_id: user.pessoa_id,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
    };

    // create an access token (shorter lived)
    const access = this.jwtService.sign(payload, { expiresIn: '24h' });
    // create a refresh token (longer lived) - same payload signed again
    const refresh = this.jwtService.sign(payload, { expiresIn: '30d' });

    return Promise.resolve({
      access_token: access,
      refresh_token: refresh,
    });
  }
}
