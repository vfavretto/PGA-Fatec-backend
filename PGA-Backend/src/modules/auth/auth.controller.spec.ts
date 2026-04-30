import { AuthController } from './auth.controller';

const mockLoginService = { execute: jest.fn() };
const mockJwtService = { verify: jest.fn(), sign: jest.fn() };
const mockContextService = {
  getAvailableContexts: jest.fn(),
  selectContext: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let mockRes: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    controller = new AuthController(
      mockLoginService as any,
      mockJwtService as any,
      mockContextService as any,
    );
  });

  describe('login', () => {
    it('deve chamar loginService.execute com req.user e retornar user', async () => {
      const tokenDto = { access_token: 'at', refresh_token: 'rt' };
      mockLoginService.execute.mockResolvedValue(tokenDto);

      const req = { user: { email: 'a@a.com', pessoa_id: 'uuid-1' } };
      const result = await controller.login(req, mockRes);

      expect(mockLoginService.execute).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({ user: req.user });
    });
  });

  describe('contexts', () => {
    it('deve retornar contextos disponíveis para o usuário', async () => {
      mockContextService.getAvailableContexts.mockResolvedValue({ unidades: [] });
      const result = await controller.contexts({ user: { tipo_usuario: 'Diretor', pessoa_id: 1 } });
      expect(result).toEqual({ unidades: [] });
    });
  });

  describe('selectContext', () => {
    it('deve chamar contextService.selectContext e retornar ok', async () => {
      mockContextService.selectContext.mockResolvedValue({ access_token: 'token', refresh_token: 'rt' });
      const result = await controller.selectContext(
        { user: { tipo_usuario: 'Diretor' } },
        { tipo: 'unidade', id: 'uuid-1' } as any,
        mockRes,
      );
      expect(mockContextService.selectContext).toHaveBeenCalled();
      expect((result as any).ok).toBe(true);
    });
  });

  describe('me', () => {
    it('deve retornar o usuário atual', () => {
      const user = { pessoa_id: 1, nome: 'Test' };
      const result = controller.me(user);
      expect(result).toBe(user);
    });
  });

  describe('refresh', () => {
    it('deve retornar ok para refresh token válido', () => {
      mockJwtService.verify.mockReturnValue({ email: 'a@a.com', pessoa_id: 1 });
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = controller.refresh({ cookies: { refresh_token: 'valid-refresh-token' } } as any, mockRes);
      expect(result).toEqual({ ok: true });
    });

    it('deve retornar erro se refresh_token não fornecido', () => {
      const result = controller.refresh({ cookies: {} } as any, mockRes);
      expect(result).toHaveProperty('error');
    });

    it('deve retornar erro se refresh_token inválido', () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });
      const result = controller.refresh({ cookies: { refresh_token: 'bad-token' } } as any, mockRes);
      expect(result).toHaveProperty('error');
    });
  });
});
