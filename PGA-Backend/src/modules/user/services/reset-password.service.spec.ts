import { UnauthorizedException } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import * as bcrypt from 'bcrypt';

const mockRepo = { findByEmail: jest.fn(), update: jest.fn() };
const mockJwt = { verify: jest.fn() };

describe('ResetPasswordService', () => {
  let service: ResetPasswordService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ResetPasswordService(mockRepo as any, mockJwt as any);
  });

  it('deve resetar a senha com token válido', async () => {
    mockJwt.verify.mockReturnValue({ email: 'user@test.com' });
    mockRepo.findByEmail.mockResolvedValue({
      pessoa_id: 1,
      email: 'user@test.com',
    });
    mockRepo.update.mockResolvedValue({});

    await expect(
      service.execute('valid-token', 'newPass123'),
    ).resolves.toBeUndefined();
    expect(mockRepo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ senha: expect.any(String) }),
    );
  });

  it('deve lançar UnauthorizedException se token inválido', async () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    await expect(service.execute('bad-token', 'newPass')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se usuário não encontrado pelo email do token', async () => {
    mockJwt.verify.mockReturnValue({ email: 'ghost@test.com' });
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(service.execute('token', 'newPass')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
