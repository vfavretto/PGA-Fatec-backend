import { NotFoundException } from '@nestjs/common';
import { CreateWorkloadHaeService } from './services/create-workload-hae.service';
import { FindAllWorkloadHaeService } from './services/find-all-workload-hae.service';
import { FindOneWorkloadHaeService } from './services/find-one-workload-hae.service';
import { UpdateWorkloadHaeService } from './services/update-workload-hae.service';
import { DeleteWorkloadHaeService } from './services/delete-workload-hae.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockPrisma = { projetoPessoa: { count: jest.fn() } };

describe('CreateWorkloadHaeService', () => {
  let service: CreateWorkloadHaeService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateWorkloadHaeService(mockRepo as any);
  });

  it('deve criar e retornar a carga horária HAE', async () => {
    mockRepo.create.mockResolvedValue({ workload_hae_id: 1 });
    expect(await service.execute({ horas: 40 } as any)).toEqual({
      workload_hae_id: 1,
    });
  });
});

describe('FindAllWorkloadHaeService', () => {
  let service: FindAllWorkloadHaeService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllWorkloadHaeService(mockRepo as any);
  });

  it('deve retornar todas as cargas HAE', async () => {
    mockRepo.findAll.mockResolvedValue([{ workload_hae_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOneWorkloadHaeService', () => {
  let service: FindOneWorkloadHaeService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneWorkloadHaeService(mockRepo as any);
  });

  it('deve retornar a carga HAE encontrada', async () => {
    mockRepo.findOne.mockResolvedValue({ workload_hae_id: 1 });
    expect(await service.execute('1')).toEqual({ workload_hae_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateWorkloadHaeService', () => {
  let service: UpdateWorkloadHaeService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateWorkloadHaeService(mockRepo as any);
  });

  it('deve atualizar e retornar a carga HAE', async () => {
    mockRepo.findOne.mockResolvedValue({ workload_hae_id: 1 });
    mockRepo.update.mockResolvedValue({ id: 1, descricao: 'Novo' });
    expect(
      ((await service.execute('1', { descricao: 'Novo' } as any)) as any)
        .descricao,
    ).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('DeleteWorkloadHaeService', () => {
  let service: DeleteWorkloadHaeService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteWorkloadHaeService(mockRepo as any, mockPrisma as any);
  });

  it('deve deletar a carga HAE', async () => {
    mockRepo.findOne.mockResolvedValue({ workload_hae_id: 1 });
    mockPrisma.projetoPessoa.count.mockResolvedValue(0);
    mockRepo.softDelete.mockResolvedValue({ workload_hae_id: 1 });
    await service.execute('1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('1');
  });

  it('deve lançar ConflictException se vínculo em uso', async () => {
    mockRepo.findOne.mockResolvedValue({ workload_hae_id: 1 });
    mockPrisma.projetoPessoa.count.mockResolvedValue(3);
    const { ConflictException } = require('@nestjs/common');
    await expect(service.execute('1')).rejects.toThrow(ConflictException);
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});
