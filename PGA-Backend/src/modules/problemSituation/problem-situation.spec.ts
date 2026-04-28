import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProblemSituationService } from './services/create-problemSituation.service';
import { FindAllProblemSituationService } from './services/find-all-problemSituation.service';
import { FindOneProblemSituationService } from './services/find-one-problemSituation.service';
import { UpdateProblemSituationService } from './services/update-problemSituation.service';
import { DeleteProblemSituationService } from './services/delete-problemSituation.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByCodigoCategoria: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('CreateProblemSituationService', () => {
  let service: CreateProblemSituationService;
  beforeEach(() => { jest.clearAllMocks(); service = new CreateProblemSituationService(mockRepo as any); });

  it('deve criar quando código não está em uso', async () => {
    mockRepo.findByCodigoCategoria.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue({ problem_situation_id: 1 });
    expect(await service.execute({ codigo_categoria: 'A1', descricao: 'Problema 1' } as any)).toEqual({ problem_situation_id: 1 });
  });

  it('deve lançar ConflictException se código já está em uso por situação ativa', async () => {
    mockRepo.findByCodigoCategoria.mockResolvedValue({ situacao_id: 2, ativo: true });
    await expect(service.execute({ codigo_categoria: 'A1' } as any)).rejects.toThrow(ConflictException);
  });
});

describe('FindAllProblemSituationService', () => {
  let service: FindAllProblemSituationService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllProblemSituationService(mockRepo as any); });

  it('deve retornar todas as situações problema', async () => {
    mockRepo.findAll.mockResolvedValue([{ problem_situation_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOneProblemSituationService', () => {
  let service: FindOneProblemSituationService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOneProblemSituationService(mockRepo as any); });

  it('deve retornar situação problema encontrada', async () => {
    mockRepo.findOne.mockResolvedValue({ problem_situation_id: 1 });
    expect(await service.execute(1)).toEqual({ problem_situation_id: 1 });
  });

  it('deve retornar null se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    expect(await service.execute(99)).toBeNull();
  });
});

describe('UpdateProblemSituationService', () => {
  let service: UpdateProblemSituationService;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdateProblemSituationService(mockRepo as any); });

  it('deve atualizar e retornar situação problema', async () => {
    mockRepo.findOne.mockResolvedValue({ problem_situation_id: 1, situacao_id: 1 });
    mockRepo.findByCodigoCategoria.mockResolvedValue(null);
    mockRepo.update.mockResolvedValue({ problem_situation_id: 1, descricao: 'Novo' });
    expect((await service.execute(1, { descricao: 'Novo' } as any)).descricao).toBe('Novo');
  });

  it('deve lançar ConflictException se código em uso por outra situação ativa', async () => {
    mockRepo.findOne.mockResolvedValue({ situacao_id: 1 });
    mockRepo.findByCodigoCategoria.mockResolvedValue({ situacao_id: 99, ativo: true });
    await expect(service.execute(1, { codigo_categoria: 'X1' } as any)).rejects.toThrow(ConflictException);
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99, {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeleteProblemSituationService', () => {
  let service: DeleteProblemSituationService;
  beforeEach(() => { jest.clearAllMocks(); service = new DeleteProblemSituationService(mockRepo as any); });

  it('deve deletar a situação problema', async () => {
    mockRepo.findOne.mockResolvedValue({ problem_situation_id: 1 });
    mockRepo.softDelete.mockResolvedValue({ problem_situation_id: 1 });
    await service.execute(1);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});
