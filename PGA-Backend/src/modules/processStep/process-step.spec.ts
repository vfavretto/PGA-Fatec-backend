import { NotFoundException } from '@nestjs/common';
import { CreateProcessStepService } from './services/create-process-step.service';
import { FindAllProcessStepService } from './services/find-all-process-step.service';
import { FindOneProcessStepService } from './services/find-one-process-step.service';
import { UpdateProcessStepService } from './services/update-process-step.service';
import { DeleteProcessStepService } from './services/delete-process-step.service';

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

describe('CreateProcessStepService', () => {
  let service: CreateProcessStepService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateProcessStepService(mockRepo as any);
  });

  it('deve criar e retornar a etapa de processo', async () => {
    mockRepo.create.mockResolvedValue({ process_step_id: 1 });
    expect(await service.execute({ nome: 'Etapa 1' } as any)).toEqual({
      process_step_id: 1,
    });
  });
});

describe('FindAllProcessStepService', () => {
  let service: FindAllProcessStepService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllProcessStepService(mockRepo as any);
  });

  it('deve retornar todas as etapas', async () => {
    mockRepo.findAll.mockResolvedValue([{ process_step_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });

  it('deve filtrar por unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ etapa_id: 2 }]);
    const result = await service.execute({
      active_context: { tipo: 'unidade', id: 3 },
    });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith(3);
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ etapa_id: 4 }]);
    const result = await service.execute({
      active_context: { tipo: 'regional', id: 2 },
    });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith(2);
    expect(result).toHaveLength(1);
  });
});

describe('FindOneProcessStepService', () => {
  let service: FindOneProcessStepService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneProcessStepService(mockRepo as any);
  });

  it('deve retornar a etapa encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ etapa_id: 1 });
    expect(await service.execute('1')).toEqual({ etapa_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateProcessStepService', () => {
  let service: UpdateProcessStepService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateProcessStepService(mockRepo as any);
  });

  it('deve atualizar e retornar a etapa', async () => {
    mockRepo.findOne.mockResolvedValue({ process_step_id: 1 });
    mockRepo.update.mockResolvedValue({ etapa_id: 1, descricao: 'Novo' });
    expect(
      ((await service.execute('1', { descricao: 'Novo' } as any)) as any)
        .descricao,
    ).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('DeleteProcessStepService', () => {
  let service: DeleteProcessStepService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteProcessStepService(mockRepo as any);
  });

  it('deve deletar a etapa de processo', async () => {
    mockRepo.findOne.mockResolvedValue({ process_step_id: 1 });
    mockRepo.softDelete.mockResolvedValue({ process_step_id: 1 });
    await service.execute('1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('1');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});
