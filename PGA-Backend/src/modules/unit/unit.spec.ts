import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUnitService } from './services/create-unit.service';
import { FindAllUnitsService } from './services/find-all-units.service';
import { FindOneUnitService } from './services/find-one-unit.service';
import { UpdateUnitService } from './services/update-unit.service';
import { DeleteUnitService } from './services/delete-unit.service';
import { UnitController } from './unit.controller';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  findAllByRegional: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockPrisma = {
  regional: { findUnique: jest.fn() },
  pGA: { count: jest.fn() },
};

describe('CreateUnitService', () => {
  let service: CreateUnitService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateUnitService(mockRepo as any, mockPrisma as any);
  });

  it('deve criar unidade quando regional existe', async () => {
    mockPrisma.regional.findUnique.mockResolvedValue({ regional_id: 1 });
    mockRepo.create.mockResolvedValue({ unidade_id: 1 });

    const result = await service.execute({
      regional_id: 1,
      nome_unidade: 'U1',
    } as any);
    expect(result).toEqual({ unidade_id: 1 });
  });

  it('deve lançar NotFoundException se regional não existe', async () => {
    mockPrisma.regional.findUnique.mockResolvedValue(null);
    await expect(
      service.execute({ regional_id: 99, nome_unidade: 'U1' } as any),
    ).rejects.toThrow(NotFoundException);
  });
});

describe('FindAllUnitsService', () => {
  let service: FindAllUnitsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllUnitsService(mockRepo as any);
  });

  it('deve retornar todas as unidades sem contexto', async () => {
    mockRepo.findAll.mockResolvedValue([{ unidade_id: 1 }]);
    const result = await service.execute();
    expect(result).toHaveLength(1);
  });

  it('deve retornar unidade específica no contexto de unidade', async () => {
    mockRepo.findOne.mockResolvedValue({ unidade_id: 5 });
    const result = await service.execute({
      active_context: { tipo: 'unidade', id: 5 },
    });
    expect(result).toEqual([{ unidade_id: 5 }]);
  });

  it('deve retornar array vazio se unidade do contexto não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await service.execute({
      active_context: { tipo: 'unidade', id: 99 },
    });
    expect(result).toEqual([]);
  });

  it('deve filtrar por regional quando contexto é regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ unidade_id: 2 }]);
    await service.execute({ active_context: { tipo: 'regional', id: 3 } });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith(3);
  });
});

describe('FindOneUnitService', () => {
  let service: FindOneUnitService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneUnitService(mockRepo as any);
  });

  it('deve retornar unidade encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ unidade_id: 1 });
    const result = await service.execute('1');
    expect(result).toEqual({ unidade_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateUnitService', () => {
  let service: UpdateUnitService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateUnitService(mockRepo as any);
  });

  it('deve atualizar e retornar unidade', async () => {
    mockRepo.findOne.mockResolvedValue({ unidade_id: 1 });
    mockRepo.update.mockResolvedValue({ unidade_id: 1, nome_unidade: 'Novo' });

    const result = await service.execute('1', { nome_unidade: 'Novo' } as any);
    expect(result.nome_unidade).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('DeleteUnitService', () => {
  let service: DeleteUnitService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteUnitService(mockRepo as any, mockPrisma as any);
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se há PGAs ativos', async () => {
    mockRepo.findOne.mockResolvedValue({ unidade_id: 1 });
    mockPrisma.pGA.count.mockResolvedValue(1);
    await expect(service.execute('1')).rejects.toThrow(ConflictException);
  });

  it('deve excluir quando sem dependências', async () => {
    mockRepo.findOne.mockResolvedValue({ unidade_id: 1 });
    mockPrisma.pGA.count.mockResolvedValue(0);
    mockRepo.softDelete.mockResolvedValue({ unidade_id: 1, ativo: false });

    await service.execute('1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('1');
  });
});

describe('UnitController', () => {
  const mockCreate = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockFindOne = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };
  let controller: UnitController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UnitController(
      mockCreate as any,
      mockFindAll as any,
      mockFindOne as any,
      mockUpdate as any,
      mockDelete as any,
    );
  });

  it('create deve chamar createUnitService', async () => {
    mockCreate.execute.mockResolvedValue({ unidade_id: 1 });
    await controller.create({ regional_id: 1, nome_unidade: 'U1' } as any);
    expect(mockCreate.execute).toHaveBeenCalled();
  });

  it('findAll deve passar o user', async () => {
    mockFindAll.execute.mockResolvedValue([]);
    await controller.findAll({ user: { pessoa_id: 1 } });
    expect(mockFindAll.execute).toHaveBeenCalledWith({ pessoa_id: 1 });
  });
});
