import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRegionalService } from './services/create-regional.service';
import { ListRegionaisService } from './services/list-regionais.service';
import { GetRegionalService } from './services/get-regional.service';
import { ReviewRegionalPgaService } from './services/review-regional-pga.service';
import { FindRegionalByResponsavelService } from './services/find-regional-by-responsavel.service';
import { GetRegionalPgaService } from './services/get-regional-pga.service';
import { GetRegionalProjectService } from './services/get-regional-project.service';
import { ListRegionalPgasService } from './services/list-regional-pgas.service';
import { ListRegionalProjectsService } from './services/list-regional-projects.service';
import { ListRegionalUnitsService } from './services/list-regional-units.service';
import { ReviewRegionalProjectService } from './services/review-regional-project.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findPgaForRegional: jest.fn(),
  updatePgaReview: jest.fn(),
  findUnitsForRegional: jest.fn(),
  findPgasByUnitsForRegional: jest.fn(),
  findProjectsByUnitsForRegional: jest.fn(),
  findRegionalByResponsavelId: jest.fn(),
  findProjectForRegional: jest.fn(),
  findPgasByRegional: jest.fn(),
  findProjectsByRegional: jest.fn(),
  findUnitsByRegional: jest.fn(),
  updateProjectReview: jest.fn(),
};

describe('CreateRegionalService', () => {
  let service: CreateRegionalService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateRegionalService(mockRepo as any);
  });

  it('deve criar e retornar regional', async () => {
    mockRepo.create.mockResolvedValue({ regional_id: 1, nome: 'Regional SP' });
    const result = await service.execute({ nome: 'Regional SP' } as any);
    expect(result).toEqual({ regional_id: 1, nome: 'Regional SP' });
  });
});

describe('ListRegionaisService', () => {
  let service: ListRegionaisService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ListRegionaisService(mockRepo as any);
  });

  it('deve retornar lista de regionais', async () => {
    mockRepo.findAll.mockResolvedValue([{ regional_id: 1 }, { regional_id: 2 }]);
    const result = await service.execute();
    expect(result).toHaveLength(2);
  });
});

describe('GetRegionalService', () => {
  let service: GetRegionalService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GetRegionalService(mockRepo as any);
  });

  it('deve retornar regional encontrada', async () => {
    mockRepo.findById.mockResolvedValue({ regional_id: 1 });
    const result = await service.execute(1);
    expect(result).toEqual({ regional_id: 1 });
  });

  it('deve lançar NotFoundException se regional não encontrada', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});

describe('ReviewRegionalPgaService', () => {
  let service: ReviewRegionalPgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReviewRegionalPgaService(mockRepo as any);
  });

  it('deve lançar BadRequestException para status inválido', async () => {
    await expect(
      service.execute(1, 1, { status: 'EmElaboracao' as any, parecer: '' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException se PGA não encontrado para a regional', async () => {
    mockRepo.findPgaForRegional.mockResolvedValue(null);
    await expect(
      service.execute(1, 99, { status: 'Aprovado' as any, parecer: '' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve aprovar PGA encontrado', async () => {
    mockRepo.findPgaForRegional.mockResolvedValue({ pga_id: 1 });
    mockRepo.updatePgaReview.mockResolvedValue({ pga_id: 1, status: 'Aprovado' });

    const result = await service.execute(1, 1, { status: 'Aprovado' as any, parecer: 'OK' });
    expect(mockRepo.updatePgaReview).toHaveBeenCalled();
    expect(result.status).toBe('Aprovado');
  });

  it('deve reprovar PGA encontrado', async () => {
    mockRepo.findPgaForRegional.mockResolvedValue({ pga_id: 1 });
    mockRepo.updatePgaReview.mockResolvedValue({ pga_id: 1, status: 'Reprovado' });

    const result = await service.execute(1, 1, { status: 'Reprovado' as any, parecer: 'Não aprovado' });
    expect(result.status).toBe('Reprovado');
  });
});

describe('FindRegionalByResponsavelService', () => {
  let service: FindRegionalByResponsavelService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindRegionalByResponsavelService(mockRepo as any); });

  it('deve retornar regionais por responsável', async () => {
    mockRepo.findRegionalByResponsavelId.mockResolvedValue([{ regional_id: 1 }]);
    const result = await service.execute(10);
    expect(mockRepo.findRegionalByResponsavelId).toHaveBeenCalledWith(10);
    expect(result).toHaveLength(1);
  });
});

describe('GetRegionalPgaService', () => {
  let service: GetRegionalPgaService;
  beforeEach(() => { jest.clearAllMocks(); service = new GetRegionalPgaService(mockRepo as any); });

  it('deve retornar PGA da regional', async () => {
    mockRepo.findPgaForRegional.mockResolvedValue({ pga_id: 5 });
    const result = await service.execute(1, 5);
    expect(result).toEqual({ pga_id: 5 });
  });

  it('deve lançar NotFoundException se PGA não encontrado', async () => {
    mockRepo.findPgaForRegional.mockResolvedValue(null);
    await expect(service.execute(1, 99)).rejects.toThrow(NotFoundException);
  });
});

describe('GetRegionalProjectService', () => {
  let service: GetRegionalProjectService;
  beforeEach(() => { jest.clearAllMocks(); service = new GetRegionalProjectService(mockRepo as any); });

  it('deve retornar projeto da regional', async () => {
    mockRepo.findProjectForRegional.mockResolvedValue({ acao_projeto_id: 3 });
    const result = await service.execute(1, 3);
    expect(result).toEqual({ acao_projeto_id: 3 });
  });

  it('deve lançar NotFoundException se projeto não encontrado', async () => {
    mockRepo.findProjectForRegional.mockResolvedValue(null);
    await expect(service.execute(1, 99)).rejects.toThrow(NotFoundException);
  });
});

describe('ListRegionalPgasService', () => {
  let service: ListRegionalPgasService;
  beforeEach(() => { jest.clearAllMocks(); service = new ListRegionalPgasService(mockRepo as any); });

  it('deve retornar PGAs da regional com filtros', async () => {
    mockRepo.findPgasByRegional.mockResolvedValue([{ pga_id: 1 }]);
    const result = await service.execute(1, {} as any);
    expect(mockRepo.findPgasByRegional).toHaveBeenCalledWith(1, {});
    expect(result).toHaveLength(1);
  });
});

describe('ListRegionalProjectsService', () => {
  let service: ListRegionalProjectsService;
  beforeEach(() => { jest.clearAllMocks(); service = new ListRegionalProjectsService(mockRepo as any); });

  it('deve retornar projetos da regional com filtros', async () => {
    mockRepo.findProjectsByRegional.mockResolvedValue([{ acao_projeto_id: 1 }]);
    const result = await service.execute(1, {} as any);
    expect(mockRepo.findProjectsByRegional).toHaveBeenCalledWith(1, {});
    expect(result).toHaveLength(1);
  });
});

describe('ListRegionalUnitsService', () => {
  let service: ListRegionalUnitsService;
  beforeEach(() => { jest.clearAllMocks(); service = new ListRegionalUnitsService(mockRepo as any); });

  it('deve retornar unidades da regional', async () => {
    mockRepo.findUnitsByRegional.mockResolvedValue([{ unidade_id: 1 }]);
    const result = await service.execute(1);
    expect(mockRepo.findUnitsByRegional).toHaveBeenCalledWith(1);
    expect(result).toHaveLength(1);
  });
});

describe('ReviewRegionalProjectService', () => {
  let service: ReviewRegionalProjectService;
  beforeEach(() => { jest.clearAllMocks(); service = new ReviewRegionalProjectService(mockRepo as any); });

  it('deve lançar BadRequestException para status inválido', async () => {
    await expect(
      service.execute(1, 1, { status: 'EmElaboracao' as any, parecer: '' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar NotFoundException se projeto não encontrado', async () => {
    mockRepo.findProjectForRegional.mockResolvedValue(null);
    await expect(
      service.execute(1, 99, { status: 'Aprovado' as any, parecer: '' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve aprovar projeto', async () => {
    mockRepo.findProjectForRegional.mockResolvedValue({ acao_projeto_id: 1 });
    mockRepo.updateProjectReview.mockResolvedValue({ acao_projeto_id: 1, status: 'Aprovado' });
    const result = await service.execute(1, 1, { status: 'Aprovado' as any, parecer: 'OK' });
    expect(mockRepo.updateProjectReview).toHaveBeenCalled();
    expect((result as any).status).toBe('Aprovado');
  });

  it('deve reprovar projeto', async () => {
    mockRepo.findProjectForRegional.mockResolvedValue({ acao_projeto_id: 1 });
    mockRepo.updateProjectReview.mockResolvedValue({ acao_projeto_id: 1, status: 'Reprovado' });
    const result = await service.execute(1, 1, { status: 'Reprovado' as any, parecer: 'Não aprovado' });
    expect((result as any).status).toBe('Reprovado');
  });
});
