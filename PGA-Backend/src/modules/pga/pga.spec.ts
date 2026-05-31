import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
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

    await expect(
      service.execute({ unidade_id: 99, ano: 2025 } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar BadRequestException se não-template sem unidade_id', async () => {
    await expect(
      service.execute({ ano: 2025 } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve criar template sem verificar unidade', async () => {
    mockRepo.create.mockResolvedValue({ pga_id: 2, is_template: true });
    const result = await service.execute(
      { is_template: true, ano: 2025 } as any,
      { pessoa_id: 'p-1' },
    );
    expect(mockPrisma.unidade.findUnique).not.toHaveBeenCalled();
    expect(result.is_template).toBe(true);
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
    await service.execute({
      tipo_usuario: 'Administrador',
      active_context: { tipo: 'unidade', id: 'uuid-3' },
    });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith('uuid-3', false);
  });

  it('deve filtrar por regional quando contexto é regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([]);
    await service.execute({
      active_context: { tipo: 'regional', id: 'uuid-4' },
    });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith('uuid-4');
  });

  it('deve filtrar por unidade para usuário não-admin com contexto unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ pga_id: 5 }]);
    await service.execute({
      tipo_usuario: 'Diretor',
      active_context: { tipo: 'unidade', id: 'uuid-5' },
    });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith('uuid-5', false);
  });

  it('deve retornar lista vazia quando usuário não tem contexto ativo', async () => {
    const result = await service.execute({ tipo_usuario: 'Diretor' });
    expect(result).toEqual([]);
  });

  it('deve retornar lista vazia quando user é undefined', async () => {
    const result = await service.execute(undefined);
    expect(result).toEqual([]);
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
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Rascunho',
    });
    mockRepo.update.mockResolvedValue({ pga_id: 'uuid-1', ano: 2026 });

    const result = await service.execute('uuid-1', { ano: 2026 } as any, {
      tipo_usuario: 'Administrador',
    });
    expect(result.ano).toBe(2026);
  });

  it('deve definir data_elaboracao ao submeter PGA', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Rascunho',
    });
    mockRepo.update.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Submetido',
    });
    await service.execute('uuid-1', { status: 'Submetido' } as any, {
      tipo_usuario: 'Administrador',
    });
    expect(mockRepo.update).toHaveBeenCalledWith(
      'uuid-1',
      expect.objectContaining({ data_elaboracao: expect.any(Date) }),
    );
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-99', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar ForbiddenException para Diretor com contexto de unidade incorreto', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    await expect(
      service.execute('uuid-1', {} as any, {
        tipo_usuario: 'Diretor',
        active_context: { tipo: 'unidade', id: 'uuid-99' },
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar ForbiddenException para Diretor tentando editar PGA com status Submetido', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Submetido',
      unidade_id: 'uuid-10',
    });
    await expect(
      service.execute('uuid-1', {} as any, {
        tipo_usuario: 'Diretor',
        active_context: { tipo: 'unidade', id: 'uuid-10' },
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar ForbiddenException para usuário sem permissão (não-Diretor, não-Admin)', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    await expect(
      service.execute('uuid-1', {} as any, { tipo_usuario: 'Docente' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve lançar ForbiddenException quando user é undefined (cobre branch ?? do tipo)', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    await expect(
      service.execute('uuid-1', {} as any, undefined),
    ).rejects.toThrow(ForbiddenException);
  });

  it('deve atualizar PGA para Diretor com contexto correto e EmElaboracao', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    mockRepo.update.mockResolvedValue({ pga_id: 'uuid-1', ano: 2025 });
    const result = await service.execute(
      'uuid-1',
      { ano: 2025 } as any,
      {
        tipo_usuario: 'Diretor',
        active_context: { tipo: 'unidade', id: 'uuid-10' },
      },
    );
    expect(result.ano).toBe(2025);
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
    const mockTx = {
      pGASituacaoProblema: { updateMany: jest.fn().mockResolvedValue({}) },
    };
    mockPrisma.$transaction.mockImplementation(async (fn: any) => fn(mockTx));
    mockRepo.delete.mockResolvedValue({ pga_id: 'uuid-1', ativo: false });

    await service.execute('uuid-1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
    expect(mockTx.pGASituacaoProblema.updateMany).toHaveBeenCalled();
    expect(mockRepo.delete).toHaveBeenCalledWith('uuid-1');
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
    await expect(service.execute('uuid-99', 'uuid-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar BadRequestException se PGA não está EmElaboracao', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Submetido',
    });
    await expect(service.execute('uuid-1', 'uuid-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve lançar NotFoundException se pessoa não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
    });
    mockPrisma.pessoa.findUnique.mockResolvedValue(null);

    await expect(service.execute('uuid-1', 'uuid-99')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar ForbiddenException se Diretor tentar submeter PGA de outra unidade', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      tipo_usuario: 'Diretor',
      unidades: [{ unidade_id: 'uuid-20' }],
    });

    await expect(service.execute('uuid-1', 'uuid-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('deve submeter PGA quando Diretor é da mesma unidade', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      tipo_usuario: 'Diretor',
      unidades: [{ unidade_id: 'uuid-10' }],
    });
    mockRepo.updateWorkflow.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Submetido',
    });

    await service.execute('uuid-1', 'uuid-1');
    expect(mockRepo.updateWorkflow).toHaveBeenCalled();
  });

  it('deve submeter PGA para Administrador sem restrição de unidade', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'EmElaboracao',
      unidade_id: 'uuid-10',
    });
    mockPrisma.pessoa.findUnique.mockResolvedValue({
      tipo_usuario: 'Administrador',
      unidades: [],
    });
    mockRepo.updateWorkflow.mockResolvedValue({
      pga_id: 'uuid-1',
      status: 'Submetido',
    });

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
    await controller.create(
      { unidade_id: 'uuid-1', ano: 2025 } as any,
      {} as any,
    );
    expect(mockCreate.execute).toHaveBeenCalled();
  });

  it('findAll deve passar o user', async () => {
    mockFindAll.execute.mockResolvedValue([]);
    await controller.findAll({ user: { pessoa_id: 1 } });
    expect(mockFindAll.execute).toHaveBeenCalledWith({ pessoa_id: 1 });
  });
});

// ─── PublishPgaService ───────────────────────────────────────────────────────
import { PublishPgaService } from './services/publish-pga.service';

describe('PublishPgaService', () => {
  let service: PublishPgaService;

  const mockRepo = {
    findOne: jest.fn(),
    updateWorkflow: jest.fn(),
  };

  const mockPrisma = {
    pGA: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    unidade: { findMany: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PublishPgaService(mockRepo as any, mockPrisma as any);
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('uuid-1', 'pessoa-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar BadRequestException se PGA não é template', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      is_template: false,
      status: 'EmElaboracao',
    });
    await expect(service.execute('uuid-1', 'pessoa-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve lançar BadRequestException se PGA não está EmElaboracao', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      is_template: true,
      status: 'Publicado',
    });
    await expect(service.execute('uuid-1', 'pessoa-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve lançar BadRequestException se já existem cópias', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      is_template: true,
      status: 'EmElaboracao',
    });
    mockPrisma.pGA.findFirst.mockResolvedValue({ pga_id: 'uuid-copia' });
    await expect(service.execute('uuid-1', 'pessoa-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve lançar BadRequestException se não há unidades ativas', async () => {
    mockRepo.findOne.mockResolvedValue({
      pga_id: 'uuid-1',
      is_template: true,
      status: 'EmElaboracao',
    });
    mockPrisma.pGA.findFirst.mockResolvedValue(null);
    mockPrisma.unidade.findMany.mockResolvedValue([]);
    await expect(service.execute('uuid-1', 'pessoa-1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('deve publicar template e criar cópias para unidades ativas', async () => {
    const template = {
      pga_id: 'uuid-1',
      is_template: true,
      status: 'EmElaboracao',
      ano: 2025,
      versao: 1,
      analise_cenario: null,
      configuracoes_snapshot: null,
      data_limite_submissao: null,
    };
    mockRepo.findOne.mockResolvedValue(template);
    mockPrisma.pGA.findFirst.mockResolvedValue(null);
    mockPrisma.unidade.findMany.mockResolvedValue([
      { unidade_id: 'u-1' },
      { unidade_id: 'u-2' },
    ]);

    const txMock = {
      pGA: {
        update: jest.fn().mockResolvedValue({}),
        create: jest
          .fn()
          .mockResolvedValueOnce({ pga_id: 'c-1', unidade_id: 'u-1' })
          .mockResolvedValueOnce({ pga_id: 'c-2', unidade_id: 'u-2' }),
      },
    };
    mockPrisma.$transaction.mockImplementation((fn: any) => fn(txMock));

    const result = await service.execute('uuid-1', 'pessoa-1');

    expect(result.copias_geradas).toBe(2);
    expect(result.template_pga_id).toBe('uuid-1');
    expect(txMock.pGA.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { pga_id: 'uuid-1' } }),
    );
  });
});

// ─── ReviewPgaCpsService ─────────────────────────────────────────────────────
import { ReviewPgaCpsService } from './services/review-pga-cps.service';

describe('ReviewPgaCpsService', () => {
  let service: ReviewPgaCpsService;

  const mockRepo = {
    findOne: jest.fn(),
    updateWorkflow: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReviewPgaCpsService(mockRepo as any);
  });

  describe('aprovar', () => {
    it('deve lançar NotFoundException se PGA não encontrado', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar BadRequestException se status não é AguardandoCPS', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'EmElaboracao',
      });
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve aprovar PGA com parecer', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AguardandoCPS',
      });
      mockRepo.updateWorkflow.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AprovadoCPS',
      });

      const result = await service.aprovar('uuid-1', 'pessoa-1', 'Aprovado!');
      expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ status: 'AprovadoCPS', parecer_cps: 'Aprovado!' }),
      );
      expect(result.status).toBe('AprovadoCPS');
    });

    it('deve aprovar PGA sem parecer (null)', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AguardandoCPS',
      });
      mockRepo.updateWorkflow.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AprovadoCPS',
      });

      await service.aprovar('uuid-1', 'pessoa-1');
      expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ parecer_cps: null }),
      );
    });
  });

  describe('reprovar', () => {
    it('deve lançar BadRequestException se parecer vazio', async () => {
      await expect(service.reprovar('uuid-1', 'pessoa-1', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se parecer só tem espaços', async () => {
      await expect(
        service.reprovar('uuid-1', 'pessoa-1', '   '),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se PGA não encontrado', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.reprovar('uuid-1', 'pessoa-1', 'reprovado'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException se status não é AguardandoCPS', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
      });
      await expect(
        service.reprovar('uuid-1', 'pessoa-1', 'parecer'),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve reprovar PGA com parecer', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AguardandoCPS',
      });
      mockRepo.updateWorkflow.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Reprovado',
      });

      const result = await service.reprovar('uuid-1', 'pessoa-1', 'Reprovado!');
      expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ status: 'Reprovado', parecer_cps: 'Reprovado!' }),
      );
      expect(result.status).toBe('Reprovado');
    });
  });
});

// ─── ReviewPgaRegionalService ────────────────────────────────────────────────
import { ReviewPgaRegionalService } from './services/review-pga-regional.service';

describe('ReviewPgaRegionalService', () => {
  let service: ReviewPgaRegionalService;

  const mockRepo = {
    findOne: jest.fn(),
    updateWorkflow: jest.fn(),
  };

  const mockPrisma = {
    unidade: { findUnique: jest.fn() },
    pessoaRegional: { findFirst: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReviewPgaRegionalService(mockRepo as any, mockPrisma as any);
  });

  describe('aprovar', () => {
    it('deve lançar NotFoundException se PGA não encontrado', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar BadRequestException se status não é Submetido', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'EmElaboracao',
        unidade_id: 'u-1',
      });
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se unidade_id é null (template)', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
        unidade_id: null,
      });
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar NotFoundException se unidade não encontrada', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
        unidade_id: 'u-1',
      });
      mockPrisma.unidade.findUnique.mockResolvedValue(null);
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ForbiddenException se usuário não tem vínculo com a regional', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
        unidade_id: 'u-1',
      });
      mockPrisma.unidade.findUnique.mockResolvedValue({ regional_id: 'r-1' });
      mockPrisma.pessoaRegional.findFirst.mockResolvedValue(null);
      await expect(service.aprovar('uuid-1', 'pessoa-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve aprovar PGA regional com sucesso', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
        unidade_id: 'u-1',
      });
      mockPrisma.unidade.findUnique.mockResolvedValue({ regional_id: 'r-1' });
      mockPrisma.pessoaRegional.findFirst.mockResolvedValue({ ativo: true });
      mockRepo.updateWorkflow.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AguardandoCPS',
      });

      const result = await service.aprovar('uuid-1', 'pessoa-1', 'OK');
      expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ status: 'AguardandoCPS' }),
      );
      expect(result.status).toBe('AguardandoCPS');
    });

    it('deve aprovar PGA regional sem parecer', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
        unidade_id: 'u-1',
      });
      mockPrisma.unidade.findUnique.mockResolvedValue({ regional_id: 'r-1' });
      mockPrisma.pessoaRegional.findFirst.mockResolvedValue({ ativo: true });
      mockRepo.updateWorkflow.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AguardandoCPS',
      });

      await service.aprovar('uuid-1', 'pessoa-1');
      expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ parecer_regional: null }),
      );
    });
  });

  describe('reprovar', () => {
    it('deve lançar BadRequestException se parecer vazio', async () => {
      await expect(service.reprovar('uuid-1', 'pessoa-1', '')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar NotFoundException se PGA não encontrado', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(
        service.reprovar('uuid-1', 'pessoa-1', 'parecer'),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException se status não é Submetido', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'AguardandoCPS',
        unidade_id: 'u-1',
      });
      await expect(
        service.reprovar('uuid-1', 'pessoa-1', 'parecer'),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve reprovar PGA regional com sucesso', async () => {
      mockRepo.findOne.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Submetido',
        unidade_id: 'u-1',
      });
      mockPrisma.unidade.findUnique.mockResolvedValue({ regional_id: 'r-1' });
      mockPrisma.pessoaRegional.findFirst.mockResolvedValue({ ativo: true });
      mockRepo.updateWorkflow.mockResolvedValue({
        pga_id: 'uuid-1',
        status: 'Reprovado',
      });

      await service.reprovar('uuid-1', 'pessoa-1', 'Rejeitado!');
      expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
        'uuid-1',
        expect.objectContaining({ status: 'Reprovado', parecer_regional: 'Rejeitado!' }),
      );
    });
  });
});
