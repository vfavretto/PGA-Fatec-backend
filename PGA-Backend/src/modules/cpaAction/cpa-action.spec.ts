import { NotFoundException } from '@nestjs/common';
import { CreateCpaActionService } from './services/create-cpa-action.service';
import { FindAllCpaActionService } from './services/find-all-cpa-action.service';
import { FindOneCpaActionService } from './services/find-one-cpa-action.service';
import { UpdateCpaActionService } from './services/update-cpa-action.service';
import { DeleteCpaActionService } from './services/delete-cpa-action.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAllByUnit: jest.fn(),
  findAllByRegional: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('CreateCpaActionService', () => {
  let service: CreateCpaActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new CreateCpaActionService(mockRepo as any); });

  it('deve criar e retornar ação CPA', async () => {
    mockRepo.create.mockResolvedValue({ cpa_action_id: 1 });
    const result = await service.execute({ descricao: 'Ação 1' } as any);
    expect(result).toEqual({ cpa_action_id: 1 });
  });
});

describe('FindAllCpaActionService', () => {
  let service: FindAllCpaActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllCpaActionService(mockRepo as any); });

  it('deve retornar todas as ações CPA', async () => {
    mockRepo.findAll.mockResolvedValue([{ cpa_action_id: 1 }]);
    const result = await service.execute();
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por unidade quando active_context tipo unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ cpa_action_id: 2 }]);
    const result = await service.execute({ active_context: { tipo: 'unidade', id: 'uuid-5' } });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith('uuid-5');
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional quando active_context tipo regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ cpa_action_id: 3 }]);
    const result = await service.execute({ active_context: { tipo: 'regional', id: 'uuid-2' } });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith('uuid-2');
    expect(result).toHaveLength(1);
  });
});

describe('FindOneCpaActionService', () => {
  let service: FindOneCpaActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOneCpaActionService(mockRepo as any); });

  it('deve retornar ação CPA encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ cpa_action_id: 'uuid-1' });
    expect(await service.execute('uuid-1')).toEqual({ cpa_action_id: 'uuid-1' });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateCpaActionService', () => {
  let service: UpdateCpaActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdateCpaActionService(mockRepo as any); });

  it('deve atualizar e retornar ação CPA', async () => {
    mockRepo.findOne.mockResolvedValue({ cpa_action_id: 'uuid-1' });
    mockRepo.update.mockResolvedValue({ cpa_action_id: 'uuid-1', descricao: 'Novo' });
    const result = await service.execute('uuid-1', { descricao: 'Novo' } as any);
    expect(result.descricao).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99', {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeleteCpaActionService', () => {
  let service: DeleteCpaActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new DeleteCpaActionService(mockRepo as any); });

  it('deve deletar a ação CPA', async () => {
    mockRepo.findOne.mockResolvedValue({ cpa_action_id: 'uuid-1' });
    mockRepo.softDelete.mockResolvedValue({ cpa_action_id: 'uuid-1' });
    await service.execute('uuid-1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('uuid-1');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});
