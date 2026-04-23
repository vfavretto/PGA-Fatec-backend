import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateUserService } from './create-user.service';

const mockRepo = {
  countActiveUsers: jest.fn(),
  create: jest.fn(),
  findByEmail: jest.fn(),
};
const mockPrisma = {
  pessoaUnidade: { findMany: jest.fn() },
};
const mockForgotPassword = { execute: jest.fn() };

describe('CreateUserService', () => {
  let service: CreateUserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateUserService(mockRepo as any, mockPrisma as any, mockForgotPassword as any);
  });

  it('deve criar primeiro usuário como Administrador (total=0)', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(0);
    mockRepo.create.mockResolvedValue({ email: 'a@b.com' });
    mockForgotPassword.execute.mockResolvedValue(undefined);
    const result = await service.execute({ tipo_usuario: 'Docente' } as any);
    expect(result.user).toBeDefined();
  });

  it('deve lançar ForbiddenException se sem reqUser e total > 0', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    await expect(service.execute({ tipo_usuario: 'Docente' } as any, null)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar ForbiddenException se reqUser sem tipo autorizado', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    await expect(service.execute({ tipo_usuario: 'Docente' } as any, { tipo_usuario: 'Docente' } as any)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar BadRequestException se Diretor sem unidade_id', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    await expect(service.execute({ tipo_usuario: 'Docente' } as any, { tipo_usuario: 'Diretor', pessoa_id: 1 } as any)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar ForbiddenException se Diretor tentar criar fora da unidade', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    mockPrisma.pessoaUnidade.findMany.mockResolvedValue([{ unidade_id: 2 }]);
    await expect(service.execute({ tipo_usuario: 'Docente', unidade_id: 99 } as any, { tipo_usuario: 'Diretor', pessoa_id: 1 } as any)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar ForbiddenException se Diretor tentar criar Administrador', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    mockPrisma.pessoaUnidade.findMany.mockResolvedValue([{ unidade_id: 5 }]);
    await expect(service.execute({ tipo_usuario: 'Administrador', unidade_id: 5 } as any, { tipo_usuario: 'Diretor', pessoa_id: 1 } as any)).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar BadRequestException se Regional sem regional_id', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    await expect(service.execute({ tipo_usuario: 'Regional' } as any, { tipo_usuario: 'Administrador' } as any)).rejects.toThrow(BadRequestException);
  });

  it('deve lançar BadRequestException se Docente sem unidade_id', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    await expect(service.execute({ tipo_usuario: 'Docente' } as any, { tipo_usuario: 'Administrador' } as any)).rejects.toThrow(BadRequestException);
  });

  it('deve criar usuário com senha se fornecida', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    mockRepo.create.mockResolvedValue({ email: 'a@b.com' });
    const result = await service.execute({ tipo_usuario: 'Docente', unidade_id: 1, senha: 'pass123' } as any, { tipo_usuario: 'Administrador' } as any);
    expect(result.email_sent).toBe(false);
  });

  it('deve criar usuário sem senha e enviar email', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    mockRepo.create.mockResolvedValue({ email: 'a@b.com' });
    mockForgotPassword.execute.mockResolvedValue(undefined);
    const result = await service.execute({ tipo_usuario: 'Docente', unidade_id: 1 } as any, { tipo_usuario: 'Administrador' } as any);
    expect(result.email_sent).toBe(true);
  });

  it('deve lidar com falha ao enviar email (email_sent=false)', async () => {
    mockRepo.countActiveUsers.mockResolvedValue(5);
    mockRepo.create.mockResolvedValue({ email: 'a@b.com' });
    mockForgotPassword.execute.mockRejectedValue(new Error('smtp fail'));
    const result = await service.execute({ tipo_usuario: 'Docente', unidade_id: 1 } as any, { tipo_usuario: 'Administrador' } as any);
    expect(result.email_sent).toBe(false);
  });
});
