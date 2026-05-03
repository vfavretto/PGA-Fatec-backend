import {
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ProcessAccessRequestService } from './process-access-request.service';

const mockSolicitacao = {
  solicitacao_id: 1,
  nome: 'João',
  email: 'joao@test.com',
  status: 'Pendente',
  unidade_id: 5,
  unidade: { nome_unidade: 'Unidade X' },
};

const mockPrisma = {
  solicitacaoAcesso: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  pessoa: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  unidade: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  pessoaUnidade: { create: jest.fn() },
};

const mockSendApproved = { execute: jest.fn() };

describe('ProcessAccessRequestService', () => {
  let service: ProcessAccessRequestService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProcessAccessRequestService(
      mockPrisma as any,
      mockSendApproved as any,
    );
    mockPrisma.solicitacaoAcesso.update.mockResolvedValue({});
  });

  it('deve lançar BadRequestException se solicitação não encontrada', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(null);
    await expect(service.execute('1', '1', 'Aprovada')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve lançar BadRequestException se solicitação já processada', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue({
      ...mockSolicitacao,
      status: 'Aprovada',
    });
    await expect(service.execute('1', '1', 'Aprovada')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve lançar UnauthorizedException se processador não encontrado', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue(null);
    await expect(service.execute('1', '1', 'Aprovada')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se processador sem permissão', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Docente',
    });
    await expect(service.execute('1', '1', 'Aprovada')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar UnauthorizedException se Diretor tentar processar outra unidade', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Diretor',
    });
    mockPrisma.unidade.findFirst.mockResolvedValue({ unidade_id: 99 }); // outra unidade
    await expect(service.execute('1', '1', 'Aprovada')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('deve lançar BadRequestException se Aprovada sem tipoUsuario', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Administrador',
    });
    await expect(service.execute('1', '1', 'Aprovada')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve rejeitar solicitação com sucesso', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Administrador',
    });
    const result = await service.execute('1', '1', 'Rejeitada');
    expect(result.success).toBe(true);
  });

  it('deve aprovar solicitação e criar usuário Docente', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Administrador',
    });
    mockPrisma.pessoa.create.mockResolvedValue({
      pessoa_id: 10,
      email: 'joao@test.com',
    });
    mockPrisma.pessoaUnidade.create.mockResolvedValue({});
    mockSendApproved.execute.mockResolvedValue(undefined);
    const result = await service.execute(
      '1',
      '1',
      'Aprovada',
      'Docente' as any,
    );
    expect(result.success).toBe(true);
  });

  it('deve aprovar solicitação e criar usuário Diretor', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Administrador',
    });
    mockPrisma.unidade.findUnique.mockResolvedValue({
      diretor_id: null,
      nome_unidade: 'X',
    });
    mockPrisma.pessoa.create.mockResolvedValue({ pessoa_id: 10 });
    mockPrisma.pessoaUnidade.create.mockResolvedValue({});
    mockPrisma.unidade.update.mockResolvedValue({});
    mockSendApproved.execute.mockResolvedValue(undefined);
    const result = await service.execute(
      '1',
      '1',
      'Aprovada',
      'Diretor' as any,
    );
    expect(result.success).toBe(true);
  });

  it('deve lançar ConflictException se unidade já tem diretor', async () => {
    mockPrisma.solicitacaoAcesso.findUnique.mockResolvedValue(mockSolicitacao);
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      pessoa_id: 1,
      tipo_usuario: 'Administrador',
    });
    mockPrisma.unidade.findUnique.mockResolvedValue({
      diretor_id: 5,
      nome_unidade: 'X',
    });
    await expect(
      service.execute('1', '1', 'Aprovada', 'Diretor' as any),
    ).rejects.toThrow(ConflictException);
  });
});
