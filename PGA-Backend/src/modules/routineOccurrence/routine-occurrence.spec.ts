import { NotFoundException } from '@nestjs/common';
import { CreateRoutineOccurrenceService } from './services/create-routine-occurrence.service';
import { FindAllRoutineOccurrenceService } from './services/find-all-routine-occurrence.service';
import { FindOneRoutineOccurrenceService } from './services/find-one-routine-occurrence.service';
import { UpdateRoutineOccurrenceService } from './services/update-routine-occurrence.service';
import { DeleteRoutineOccurrenceService } from './services/delete-routine-occurrence.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('CreateRoutineOccurrenceService', () => {
  let service: CreateRoutineOccurrenceService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateRoutineOccurrenceService(mockRepo as any);
  });

  it('deve criar e retornar a ocorrência de rotina', async () => {
    mockRepo.create.mockResolvedValue({ occurrence_id: 1 });
    expect(await service.execute({ data: '2024-01-01' } as any)).toEqual({
      occurrence_id: 1,
    });
  });
});

describe('FindAllRoutineOccurrenceService', () => {
  let service: FindAllRoutineOccurrenceService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllRoutineOccurrenceService(mockRepo as any);
  });

  it('deve retornar todas as ocorrências', async () => {
    mockRepo.findAll.mockResolvedValue([{ occurrence_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOneRoutineOccurrenceService', () => {
  let service: FindOneRoutineOccurrenceService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneRoutineOccurrenceService(mockRepo as any);
  });

  it('deve retornar a ocorrência encontrada', async () => {
    mockRepo.findOne.mockResolvedValue({ occurrence_id: 1 });
    expect(await service.execute('1')).toEqual({ occurrence_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateRoutineOccurrenceService', () => {
  let service: UpdateRoutineOccurrenceService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateRoutineOccurrenceService(mockRepo as any);
  });

  it('deve atualizar e retornar a ocorrência', async () => {
    mockRepo.findOne.mockResolvedValue({ occurrence_id: 1 });
    mockRepo.update.mockResolvedValue({
      occurrence_id: 1,
      status: 'Concluída',
    });
    expect(
      (await service.execute('1', { status: 'Concluída' } as any)).status,
    ).toBe('Concluída');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('DeleteRoutineOccurrenceService', () => {
  let service: DeleteRoutineOccurrenceService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteRoutineOccurrenceService(mockRepo as any);
  });

  it('deve deletar a ocorrência', async () => {
    mockRepo.findOne.mockResolvedValue({ occurrence_id: 1 });
    mockRepo.softDelete.mockResolvedValue({ occurrence_id: 1 });
    await service.execute('1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('1');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});
