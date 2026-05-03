import { AuthController } from './auth.controller';

const mockLoginService = { execute: jest.fn() };
const mockJwtService = { verify: jest.fn(), sign: jest.fn() };
const mockContextService = {
  getAvailableContexts: jest.fn(),
  selectContext: jest.fn(),
};
const mockRes = {
  clearCookie: jest.fn(),
  cookie: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(
      mockLoginService as any,
      mockJwtService as any,
      mockContextService as any,
    );
  });

  describe('login', () => {
    it('deve chamar loginService.execute com req.user', async () => {
      const tokenDto = { access_token: 'at', refresh_token: 'rt' };
      mockLoginService.execute.mockResolvedValue(tokenDto);

      const req = { user: { email: 'a@a.com', pessoa_id: 1 } };
      await controller.login(req, mockRes as any);

      expect(mockLoginService.execute).toHaveBeenCalledWith(req.user);
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
    it('deve chamar contextService.selectContext', async () => {
      mockContextService.selectContext.mockResolvedValue({ access_token: 'token', refresh_token: 'rt' });
      const result = await controller.selectContext(
        { user: { tipo_usuario: 'Diretor' } },
        { tipo: 'unidade', id: 1 } as any,
        mockRes as any,
      );
      expect(mockContextService.selectContext).toHaveBeenCalled();
      expect(result).toHaveProperty('ok');
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
    it('deve retornar novo access_token para refresh token válido', () => {
      mockJwtService.verify.mockReturnValue({ email: 'a@a.com', pessoa_id: 1 });
      mockJwtService.sign.mockReturnValue('new-access-token');

      const req = { cookies: { refresh_token: 'valid-refresh-token' } };
      const result = controller.refresh(req as any, mockRes as any);
      expect(result).toHaveProperty('ok');
    });

    it('deve retornar erro se refresh_token não fornecido', () => {
      const req = { cookies: {} };
      const result = controller.refresh(req as any, mockRes as any);
      expect(result).toHaveProperty('error');
    });

    it('deve retornar erro se refresh_token inválido', () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });
      const req = { cookies: { refresh_token: 'bad-token' } };
      const result = controller.refresh(req as any, mockRes as any);
      expect(result).toHaveProperty('error');
    });
  });
});
