import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from '../dto/token.dto';
import { LoginPayload } from '../interfaces/loginPayload.interface';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async execute(user: LoginPayload): Promise<TokenDto> {
    if (!user || !user.email || !user.pessoa_id) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { 
      email: user.email, 
      pessoa_id: user.pessoa_id,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
    };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}