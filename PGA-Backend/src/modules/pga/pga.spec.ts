import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreatePgaService } from './services/create-pga.service';
import { FindAllPgaService } from './services/find-all-pga.service';
import { FindOnePgaService } from './services/find-one-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { DeletePgaService } from './services/delete-pga.service';
import { SubmitPgaService } from './services/submit-pga.service';
import { PgaController } from './pga.controller';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAllByUnit: jest.fn(),
  findAllByRegional: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  update: jest.fn(),
  updateWorkflow: jest.fn(),
  delete: jest.fn(),
};

const mockPrisma = {
  unidade: { findUnique: jest.fn() },
  acaoProjeto: { count: jest.fn() },
  pessoa: { findUnique: jest.fn() },
  $transaction: jest.fn(),
};

// ─── CreatePgaService ────────────────────────────────────────────────────────
describe('CreatePgaService', () => {
  let service: CreatePgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreatePgaService(mockRepo as any, mockPrisma as any);
  });

  it('deve criar PGA quando unidade existe', async () => {
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: 1 });
    mockRepo.create.mockResolvedValue({ pga_id: 1 });

    const dto = { unidade_id: 1, ano: 2025 } as any;
    const result = await service.execute(dto);

    expect(result).toEqual({ pga_id: 1 });
  });

  it('deve lançar NotFoundException se unidade não existe', async () => {
    mockPrisma.unidade.findUnique.mockResolvedValue(null);

    await expect(service.execute({ unidade_id: 99, ano: 2025 } as any)).rejects.toThrow(NotFoundException);
  });
});

// ─── FindAllPgaService ───────────────────────────────────────────────────────
describe('FindAllPgaService', () => {
  let service: FindAllPgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllPgaService(mockRepo as any);
  });

  it('deve retornar todos os PGAs sem contexto', async () => {
    mockRepo.findAll.mockResolvedValue([{ pga_id: 1 }]);
    const result = await service.execute({ tipo_usuario: 'Administrador' });
    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por unidade quando contexto é unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ pga_id: 2 }]);
    await service.execute({ tipo_usuario: 'Administrador', active_context: { tipo: 'unidade', id: 'uuid-3' } });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith('uuid-3', false);
  });

  it('deve filtrar por regional quando contexto é regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([]);
    await service.execute({ active_context: { tipo: 'regional', id: 'uuid-4' } });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith('uuid-4');
  });
});

// ─── FindOnePgaService ───────────────────────────────────────────────────────
describe('FindOnePgaService', () => {
  let service: FindOnePgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOnePgaService(mockRepo as any);
  });

  it('deve retornar PGA encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ pga_id: 'uuid-1' });
    const result = await service.execute('uuid-1');
    expect(result).toEqual({ pga_id: 'uuid-1' });
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});

// ─── UpdatePgaService ────────────────────────────────────────────────────────
describe('UpdatePgaService', () => {
  let service: UpdatePgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdatePgaService(mockRepo as any, mockPrisma as any);
  });

  it('deve atualizar PGA', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'Rascunho' });
    mockRepo.update.mockResolvedValue({ pga_id: 'uuid-1', ano: 2026 });

    const result = await service.execute('uuid-1', { ano: 2026 } as any, { tipo_usuario: 'Administrador' });
    expect(result.ano).toBe(2026);
  });

  it('deve definir data_elaboracao ao submeter PGA', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'Rascunho' });
    mockRepo.update.mockResolvedValue({ pga_id: 'uuid-1', status: 'Submetido' });
    await service.execute('uuid-1', { status: 'Submetido' } as any, { tipo_usuario: 'Administrador' });
    expect(mockRepo.update).toHaveBeenCalledWith('uuid-1', expect.objectContaining({ data_elaboracao: expect.any(Date) }));
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99', {} as any)).rejects.toThrow(NotFoundException);
  });
});

// ─── DeletePgaService ────────────────────────────────────────────────────────
describe('DeletePgaService', () => {
  let service: DeletePgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeletePgaService(mockRepo as any, mockPrisma as any);
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se há ações de projeto ativas', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1' });
    mockPrisma.acaoProjeto.count.mockResolvedValue(3);

    await expect(service.execute('uuid-1')).rejects.toThrow(ConflictException);
  });

  it('deve executar transação de delete sem conflitos', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1' });
    mockPrisma.acaoProjeto.count.mockResolvedValue(0);
    mockPrisma.$transaction.mockResolvedValue({ pga_id: 'uuid-1', ativo: false });

    await service.execute('uuid-1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});

// ─── SubmitPgaService ────────────────────────────────────────────────────────
describe('SubmitPgaService', () => {
  let service: SubmitPgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SubmitPgaService(mockRepo as any, mockPrisma as any);
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99', 'uuid-1')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar BadRequestException se PGA não está EmElaboracao', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'Submetido' });
    await expect(service.execute('uuid-1', 'uuid-1')).rejects.toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException se pessoa não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'EmElaboracao' });
    mockPrisma.pessoa.findUnique.mockResolvedValue(null);

    await expect(service.execute('uuid-1', 'uuid-99')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ForbiddenException se Diretor tentar submeter PGA de outra unidade', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'EmElaboracao', unidade_id: 'uuid-10' });
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      tipo_usuario: 'Diretor',
      unidades: [{ unidade_id: 'uuid-20' }],
    });

    await expect(service.execute('uuid-1', 'uuid-1')).rejects.toThrow(ForbiddenException);
  });

  it('deve submeter PGA quando Diretor é da mesma unidade', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'EmElaboracao', unidade_id: 'uuid-10' });
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      tipo_usuario: 'Diretor',
      unidades: [{ unidade_id: 'uuid-10' }],
    });
    mockRepo.updateWorkflow.mockResolvedValue({ pga_id: 'uuid-1', status: 'Submetido' });

    const result = await service.execute('uuid-1', 'uuid-1');
    expect(mockRepo.updateWorkflow).toHaveBeenCalled();
  });

  it('deve submeter PGA para Administrador sem restrição de unidade', async () => {
    mockRepo.findOne.mockResolvedValue({ pga_id: 'uuid-1', status: 'EmElaboracao', unidade_id: 'uuid-10' });
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      tipo_usuario: 'Administrador',
      unidades: [],
    });
    mockRepo.updateWorkflow.mockResolvedValue({ pga_id: 'uuid-1', status: 'Submetido' });

    await service.execute('uuid-1', 'uuid-1');
    expect(mockRepo.updateWorkflow).toHaveBeenCalled();
  });
});

// ─── PgaController ───────────────────────────────────────────────────────────
describe('PgaController', () => {
  const mockCreate = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockFindOne = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };
  const mockSubmit = { execute: jest.fn() };
  const mockPublish = { execute: jest.fn() };
  const mockReviewRegional = { execute: jest.fn() };
  const mockReviewCps = { execute: jest.fn() };
  const mockExportCsv = { execute: jest.fn() };
  const mockExportPdf = { execute: jest.fn() };
  let controller: PgaController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new PgaController(
      mockCreate as any,
      mockFindAll as any,
      mockFindOne as any,
      mockUpdate as any,
      mockDelete as any,
      mockSubmit as any,
      mockPublish as any,
      mockReviewRegional as any,
      mockReviewCps as any,
      mockExportCsv as any,
      mockExportPdf as any,
    );
  });

  it('create deve chamar createPgaService', async () => {
    mockCreate.execute.mockResolvedValue({ pga_id: 1 });
    await controller.create({ unidade_id: 'uuid-1', ano: 2025 } as any, {} as any);
    expect(mockCreate.execute).toHaveBeenCalled();
  });

  it('findAll deve passar o user', async () => {
    mockFindAll.execute.mockResolvedValue([]);
    await controller.findAll({ user: { pessoa_id: 1 } });
    expect(mockFindAll.execute).toHaveBeenCalledWith({ pessoa_id: 1 });
  });
});
