import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/auth.controller';
import { LoginService } from '@/modules/auth/services/login.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let loginService: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginService = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', senha: 'password123' };
      const expectedResult = { access_token: 'token123' };

      // Mock do objeto de request
      const mockRequest = {
        user: {
          email: 'adm@example.com',
          senha: 'Senh@123',
        },
      };

      const executeSpy = jest
        .spyOn(loginService, 'execute')
        .mockResolvedValue(expectedResult);

      // Correct order: request first, then DTO
      const result = await controller.login(mockRequest, loginDto);

      expect(result).toBe(expectedResult);
      expect(executeSpy).toHaveBeenCalledWith(mockRequest.user);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto = { email: 'test@example.com', senha: 'wrongpassword' };

      // Mock do objeto de request (para consistência com o teste anterior)
      const mockRequest = {
        user: {
          nome: 'ADM',
          email: 'adm@example.com',
          senha: 'Senh@123',
          tipo_usuario: 'Administrativo',
        },
      };

      jest
        .spyOn(loginService, 'execute')
        .mockRejectedValue(new UnauthorizedException('Credenciais inválidas'));

      await expect(controller.login(mockRequest, loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
