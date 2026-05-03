import { NotFoundException } from '@nestjs/common';
import { CreateInstitutionalRoutineService } from './services/create-institutional-routine.service';
import { FindAllInstitutionalRoutineService } from './services/find-all-institutional-routine.service';
import { FindOneInstitutionalRoutineService } from './services/find-one-institutional-routine.service';
import { UpdateInstitutionalRoutineService } from './services/update-institutional-routine.service';
import { DeleteInstitutionalRoutineService } from './services/delete-institutional-routine.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  findAllByUnit: jest.fn(),
  findAllByRegional: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockPrisma = { $transaction: jest.fn() };

describe('CreateInstitutionalRoutineService', () => {
  let service: CreateInstitutionalRoutineService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateInstitutionalRoutineService(mockRepo as any);
  });

  it('deve criar e retornar a rotina institucional', async () => {
    mockRepo.create.mockResolvedValue({ rotina_id: 1 });
    expect(await service.execute({ descricao: 'Rotina 1' } as any)).toEqual({
      rotina_id: 1,
    });
  });
});

describe('FindAllInstitutionalRoutineService', () => {
  let service: FindAllInstitutionalRoutineService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllInstitutionalRoutineService(mockRepo as any);
  });

  it('deve retornar todas as rotinas', async () => {
    mockRepo.findAll.mockResolvedValue([{ rotina_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });

  it('deve filtrar por unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ rotina_id: 2 }]);
    const result = await service.execute({
      active_context: { tipo: 'unidade', id: 5 },
    });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith(5);
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ rotina_id: 3 }]);
    const result = await service.execute({
      active_context: { tipo: 'regional', id: 2 },
    });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith(2);
    expect(result).toHaveLength(1);
  });
});

describe('FindOneInstitutionalRoutineService', () => {
  let service: FindOneInstitutionalRoutineService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneInstitutionalRoutineService(mockRepo as any);
  });

  it('deve retornar rotina encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ rotina_id: 1 });
    expect(await service.execute('1')).toEqual({ rotina_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateInstitutionalRoutineService', () => {
  let service: UpdateInstitutionalRoutineService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateInstitutionalRoutineService(mockRepo as any);
  });

  it('deve atualizar e retornar a rotina', async () => {
    mockRepo.findOne.mockResolvedValue({ rotina_id: 1 });
    mockRepo.update.mockResolvedValue({ rotina_id: 1, descricao: 'Novo' });
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

describe('DeleteInstitutionalRoutineService', () => {
  let service: DeleteInstitutionalRoutineService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteInstitutionalRoutineService(
      mockRepo as any,
      mockPrisma as any,
    );
  });

  it('deve deletar a rotina via $transaction', async () => {
    mockRepo.findOne.mockResolvedValue({ rotina_id: 1 });
    mockPrisma.$transaction.mockImplementation(async (fn: any) =>
      fn({
        rotinaOcorrencia: { updateMany: jest.fn() },
        rotinaParticipante: { updateMany: jest.fn() },
        rotinaInstitucional: { update: jest.fn() },
      }),
    );
    await service.execute('1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});
