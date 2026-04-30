import { NotFoundException } from '@nestjs/common';
import { CreateProject1Service } from './services/createProject1.service';
import { FindAllProject1Service } from './services/findAllProject1.service';
import { FindOneProject1Service } from './services/findOneProject1.service';
import { UpdateProject1Service } from './services/updateProject1.service';
import { DeleteProject1Service } from './services/deleteProject1.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAllByUnit: jest.fn(),
  findAllByRegional: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockPrisma = {
  $transaction: jest.fn(),
  eixoTematico: { findUnique: jest.fn() },
  acaoProjeto: { count: jest.fn(), create: jest.fn(), update: jest.fn(), findUnique: jest.fn() },
  acaoProjetoSituacaoProblema: { deleteMany: jest.fn(), createMany: jest.fn(), create: jest.fn() },
  projetoPessoa: { deleteMany: jest.fn(), update: jest.fn(), create: jest.fn() },
  etapaProcesso: { deleteMany: jest.fn(), update: jest.fn(), create: jest.fn() },
};

describe('CreateProject1Service', () => {
  let service: CreateProject1Service;
  beforeEach(() => { jest.clearAllMocks(); service = new CreateProject1Service(mockPrisma as any); });

  it('deve criar e retornar o projeto', async () => {
    mockPrisma.eixoTematico.findUnique.mockResolvedValue({ eixo_id: 1, numero: 1 });
    mockPrisma.acaoProjeto.count.mockResolvedValue(0);
    mockPrisma.acaoProjeto.create.mockResolvedValue({ acao_projeto_id: 1 });
    expect(await service.execute({ titulo: 'Projeto 1', eixo_id: 1, pga_id: 1 } as any)).toEqual({ acao_projeto_id: 1 });
  });

  it('deve criar projeto com situacoes_problema e retornar via findUnique', async () => {
    mockPrisma.eixoTematico.findUnique.mockResolvedValue({ eixo_id: 1, numero: 1 });
    mockPrisma.acaoProjeto.count.mockResolvedValue(0);
    mockPrisma.acaoProjeto.create.mockResolvedValue({ acao_projeto_id: 1 });
    mockPrisma.acaoProjetoSituacaoProblema.create.mockResolvedValue({});
    mockPrisma.acaoProjeto.findUnique.mockResolvedValue({ acao_projeto_id: 1, situacoesProblemas: [] });
    const result = await service.execute({ titulo: 'Projeto 1', eixo_id: 1, pga_id: 1, situacao_problema_ids: [1, 2] } as any);
    expect(result).toBeDefined();
  });

  it('deve lançar erro se eixo não encontrado', async () => {
    mockPrisma.eixoTematico.findUnique.mockResolvedValue(null);
    await expect(service.execute({ titulo: 'Projeto 1', eixo_id: 99, pga_id: 1 } as any)).rejects.toThrow();
  });
});

describe('FindAllProject1Service', () => {
  let service: FindAllProject1Service;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllProject1Service(mockRepo as any); });

  it('deve retornar todos os projetos', async () => {
    mockRepo.findAll.mockResolvedValue([{ acao_projeto_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });

  it('deve filtrar por unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ acao_projeto_id: 2 }]);
    const result = await service.execute({ active_context: { tipo: 'unidade', id: 'uuid-3' } });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith('uuid-3');
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ acao_projeto_id: 3 }]);
    const result = await service.execute({ active_context: { tipo: 'regional', id: 'uuid-1' } });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith('uuid-1');
    expect(result).toHaveLength(1);
  });
});

describe('FindOneProject1Service', () => {
  let service: FindOneProject1Service;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOneProject1Service(mockRepo as any); });

  it('deve retornar o projeto encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ acao_projeto_id: 1 });
    expect(await service.execute('uuid-1')).toEqual({ acao_projeto_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateProject1Service', () => {
  let service: UpdateProject1Service;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdateProject1Service(mockRepo as any, mockPrisma as any); });

  it('deve atualizar e retornar o projeto', async () => {
    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 1, titulo: 'Novo' });
    const result = await service.execute('uuid-1', { titulo: 'Novo' } as any);
    expect((result as any).titulo).toBe('Novo');
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('deve atualizar situacoes_problema_ids vazias (só deleteMany)', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.acaoProjetoSituacaoProblema.deleteMany.mockResolvedValue({});
    await service.execute('uuid-1', { situacoes_problema_ids: [] } as any);
    expect(mockPrisma.acaoProjetoSituacaoProblema.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.acaoProjetoSituacaoProblema.createMany).not.toHaveBeenCalled();
  });

  it('deve atualizar situacoes_problema_ids com valores válidos (deleteMany + createMany)', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.acaoProjetoSituacaoProblema.deleteMany.mockResolvedValue({});
    mockPrisma.acaoProjetoSituacaoProblema.createMany.mockResolvedValue({});
    await service.execute('uuid-1', { situacoes_problema_ids: [1, 2] } as any);
    expect(mockPrisma.acaoProjetoSituacaoProblema.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.acaoProjetoSituacaoProblema.createMany).toHaveBeenCalled();
  });

  it('deve criar novas pessoas (sem projeto_pessoa_id)', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.projetoPessoa.deleteMany.mockResolvedValue({});
    mockPrisma.projetoPessoa.create.mockResolvedValue({});
    const pessoas = [{ pessoa_id: 10, papel: 'Colaborador' }];
    await service.execute('uuid-1', { pessoas } as any);
    expect(mockPrisma.projetoPessoa.create).toHaveBeenCalled();
  });

  it('deve atualizar pessoas existentes (com projeto_pessoa_id)', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.projetoPessoa.deleteMany.mockResolvedValue({});
    mockPrisma.projetoPessoa.update.mockResolvedValue({});
    const pessoas = [{ pessoa_id: 10, projeto_pessoa_id: 5, papel: 'Líder' }];
    await service.execute('uuid-1', { pessoas } as any);
    expect(mockPrisma.projetoPessoa.update).toHaveBeenCalled();
  });

  it('deve criar novas etapas (sem etapa_id)', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.etapaProcesso.deleteMany.mockResolvedValue({});
    mockPrisma.etapaProcesso.create.mockResolvedValue({});
    const etapas = [{ descricao: 'Etapa nova' }];
    await service.execute('uuid-1', { etapas } as any);
    expect(mockPrisma.etapaProcesso.create).toHaveBeenCalled();
  });

  it('deve atualizar etapas existentes (com etapa_id)', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.etapaProcesso.deleteMany.mockResolvedValue({});
    mockPrisma.etapaProcesso.update.mockResolvedValue({});
    const etapas = [{ etapa_id: 7, descricao: 'Etapa existente' }];
    await service.execute('uuid-1', { etapas } as any);
    expect(mockPrisma.etapaProcesso.update).toHaveBeenCalled();
  });
});

describe('DeleteProject1Service', () => {
  let service: DeleteProject1Service;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteProject1Service(mockRepo as any, mockPrisma as any);
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });

  it('deve executar $transaction para excluir o projeto e dependências', async () => {
    mockRepo.findOne.mockResolvedValue({ acao_projeto_id: 'uuid-1' });
    mockPrisma.$transaction.mockImplementation(async (fn: any) =>
      fn({ etapaProcesso: { updateMany: jest.fn() }, projetoPessoa: { updateMany: jest.fn() }, anexo: { updateMany: jest.fn() }, acaoProjetoSituacaoProblema: { updateMany: jest.fn() } }),
    );
    await service.execute('uuid-1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});
