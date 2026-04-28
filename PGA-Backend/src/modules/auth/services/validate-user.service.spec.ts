import { UnauthorizedException } from '@nestjs/common';
import { ValidateUserService } from './validate-user.service';
import * as bcrypt from 'bcrypt';

const mockPrisma = {
  pessoa: {
    findUnique: jest.fn(),
  },
};

describe('ValidateUserService', () => {
  let service: ValidateUserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ValidateUserService(mockPrisma as any);
  });

  it('deve retornar dados do usuário para credenciais válidas', async () => {
    const hashed = await bcrypt.hash('senha123', 10);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      email: 'user@test.com',
      senha: hashed,
      nome: 'Test',
      tipo_usuario: 'Diretor',
    });

    const result = await service.execute('user@test.com', 'senha123');

    expect(result).toBeDefined();
    expect(result.email).toBe('user@test.com');
    expect(result.senha).toBeUndefined();
  });

  it('deve lançar UnauthorizedException se usuário não encontrado', async () => {
    mockPrisma.pessoa.findUnique.mockResolvedValue(null);

    await expect(service.execute('notfound@test.com', 'any')).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se usuário não tem senha', async () => {
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      email: 'user@test.com',
      senha: null,
      nome: 'Test',
      tipo_usuario: 'Diretor',
    });

    await expect(service.execute('user@test.com', 'any')).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se senha for inválida', async () => {
    const hashed = await bcrypt.hash('correta', 10);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      email: 'user@test.com',
      senha: hashed,
      nome: 'Test',
      tipo_usuario: 'Diretor',
    });

    await expect(service.execute('user@test.com', 'errada')).rejects.toThrow(UnauthorizedException);
  });
});
