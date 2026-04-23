import { NotFoundException } from '@nestjs/common';
import { CreatePriorityActionService } from './services/create-priority-action.service';
import { FindAllPriorityActionService } from './services/find-all-priority-action.service';
import { FindOnePriorityActionService } from './services/find-one-priority-action.service';
import { UpdatePriorityActionService } from './services/update-priority-action.service';
import { DeletePriorityActionService } from './services/delete-priority-action.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreatePriorityActionService', () => {
  let service: CreatePriorityActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new CreatePriorityActionService(mockRepo as any); });

  it('deve criar e retornar ação prioritária', async () => {
    mockRepo.create.mockResolvedValue({ priority_action_id: 1 });
    expect(await service.execute({ descricao: 'PA 1' } as any)).toEqual({ priority_action_id: 1 });
  });
});

describe('FindAllPriorityActionService', () => {
  let service: FindAllPriorityActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllPriorityActionService(mockRepo as any); });

  it('deve retornar todas as ações prioritárias', async () => {
    mockRepo.findAll.mockResolvedValue([{ priority_action_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOnePriorityActionService', () => {
  let service: FindOnePriorityActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOnePriorityActionService(mockRepo as any); });

  it('deve retornar ação prioritária encontrada', async () => {
    mockRepo.findOne.mockResolvedValue({ priority_action_id: 1 });
    expect(await service.execute(1)).toEqual({ priority_action_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});

describe('UpdatePriorityActionService', () => {
  let service: UpdatePriorityActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdatePriorityActionService(mockRepo as any); });

  it('deve atualizar e retornar ação prioritária', async () => {
    mockRepo.findOne.mockResolvedValue({ priority_action_id: 1 });
    mockRepo.update.mockResolvedValue({ priority_action_id: 1, descricao: 'Novo' });
    expect((await service.execute(1, { descricao: 'Novo' } as any)).descricao).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99, {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeletePriorityActionService', () => {
  let service: DeletePriorityActionService;
  beforeEach(() => { jest.clearAllMocks(); service = new DeletePriorityActionService(mockRepo as any); });

  it('deve deletar a ação prioritária', async () => {
    mockRepo.findOne.mockResolvedValue({ priority_action_id: 1 });
    mockRepo.delete.mockResolvedValue({ priority_action_id: 1 });
    await service.execute(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});
