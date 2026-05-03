import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-token'),
    } as any;

    service = new LoginService(jwtService);
  });

  it('deve retornar access_token e refresh_token para usuário válido', async () => {
    const payload = {
      email: 'user@test.com',
      pessoa_id: 1,
      nome: 'Test User',
      tipo_usuario: 'Diretor',
    };

    const result = await service.execute(payload as any);

    expect(result.access_token).toBeDefined();
    expect(result.refresh_token).toBeDefined();
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
  });

  it('deve lançar UnauthorizedException se user for null', () => {
    expect(() => service.execute(null as any)).toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se email estiver ausente', () => {
    expect(() => service.execute({ pessoa_id: 1 } as any)).toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se pessoa_id estiver ausente', () => {
    expect(() => service.execute({ email: 'x@x.com' } as any)).toThrow(
      UnauthorizedException,
    );
  });
});
