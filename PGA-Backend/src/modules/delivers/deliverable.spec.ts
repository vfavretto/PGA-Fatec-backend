import { NotFoundException } from '@nestjs/common';
import { CreateDeliverableService } from './services/create-deliverable.service';
import { FindAllDeliverableService } from './services/find-all-deliverable.service';
import { FindOneDeliverableService } from './services/find-one-deliverable.service';
import { UpdateDeliverableService } from './services/update-deliverable.service';
import { DeleteDeliverableService } from './services/delete-deliverable.service';

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

describe('CreateDeliverableService', () => {
  let service: CreateDeliverableService;
  beforeEach(() => { jest.clearAllMocks(); service = new CreateDeliverableService(mockRepo as any); });

  it('deve criar e retornar o entregável', async () => {
    mockRepo.create.mockResolvedValue({ deliverable_id: 1 });
    expect(await service.execute({ nome: 'Entregável 1' } as any)).toEqual({ deliverable_id: 1 });
  });
});

describe('FindAllDeliverableService', () => {
  let service: FindAllDeliverableService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllDeliverableService(mockRepo as any); });

  it('deve retornar todos os entregáveis', async () => {
    mockRepo.findAll.mockResolvedValue([{ deliverable_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });

  it('deve filtrar por unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ deliverable_id: 2 }]);
    const result = await service.execute({ active_context: { tipo: 'unidade', id: 'uuid-5' } });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith('uuid-5');
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ deliverable_id: 3 }]);
    const result = await service.execute({ active_context: { tipo: 'regional', id: 'uuid-2' } });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith('uuid-2');
    expect(result).toHaveLength(1);
  });
});

describe('FindOneDeliverableService', () => {
  let service: FindOneDeliverableService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOneDeliverableService(mockRepo as any); });

  it('deve retornar o entregável encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ entregavel_id: 'uuid-1' });
    expect(await service.execute('uuid-1')).toEqual({ entregavel_id: 'uuid-1' });
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateDeliverableService', () => {
  let service: UpdateDeliverableService;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdateDeliverableService(mockRepo as any); });

  it('deve atualizar e retornar o entregável', async () => {
    mockRepo.findOne.mockResolvedValue({ deliverable_id: 1 });
    mockRepo.update.mockResolvedValue({ entregavel_id: 1, descricao: 'Novo' });
    expect(((await service.execute('uuid-1', { descricao: 'Novo' } as any)) as any).descricao).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99', {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeleteDeliverableService', () => {
  let service: DeleteDeliverableService;
  beforeEach(() => { jest.clearAllMocks(); service = new DeleteDeliverableService(mockRepo as any); });

  it('deve deletar o entregável', async () => {
    mockRepo.findOne.mockResolvedValue({ deliverable_id: 1 });
    mockRepo.softDelete.mockResolvedValue({ deliverable_id: 1 });
    await service.execute('uuid-1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('uuid-1');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});
