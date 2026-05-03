import { ForgotPasswordService } from './forgot-password.service';

const mockRepo = { findByEmail: jest.fn() };
const mockSendPasswordReset = { execute: jest.fn() };
const mockJwt = { sign: jest.fn().mockReturnValue('token123') };

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ForgotPasswordService(mockRepo as any, mockSendPasswordReset as any, mockJwt as any);
  });

  it('deve lançar erro se usuário não encontrado', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    await expect(service.execute('a@b.com')).rejects.toThrow('Usuário não encontrado');
  });

  it('deve enviar email de reset se usuário encontrado', async () => {
    mockRepo.findByEmail.mockResolvedValue({ email: 'a@b.com' });
    mockSendPasswordReset.execute.mockResolvedValue(undefined);
    await service.execute('a@b.com');
    expect(mockSendPasswordReset.execute).toHaveBeenCalledWith('a@b.com', 'token123', false);
  });
});
