import { NotFoundException } from '@nestjs/common';
import { CreateThemeService } from './services/create-theme.service';
import { FindAllThemeService } from './services/find-all-theme.service';
import { FindOneThemeService } from './services/find-one-theme.service';
import { UpdateThemeService } from './services/update-theme.service';
import { DeleteThemeService } from './services/delete-theme.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  softDelete: jest.fn(),
};

describe('CreateThemeService', () => {
  let service: CreateThemeService;
  beforeEach(() => { jest.clearAllMocks(); service = new CreateThemeService(mockRepo as any); });

  it('deve criar e retornar o tema', async () => {
    mockRepo.create.mockResolvedValue({ theme_id: 1 });
    expect(await service.execute({ nome: 'Tema 1' } as any)).toEqual({ theme_id: 1 });
  });
});

describe('FindAllThemeService', () => {
  let service: FindAllThemeService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllThemeService(mockRepo as any); });

  it('deve retornar todos os temas', async () => {
    mockRepo.findAll.mockResolvedValue([{ theme_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOneThemeService', () => {
  let service: FindOneThemeService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOneThemeService(mockRepo as any); });

  it('deve retornar o tema encontrado', async () => {
    mockRepo.findOne.mockResolvedValue({ tema_id: 1 });
    expect(await service.execute(1)).toEqual({ tema_id: 1 });
  });

  it('deve retornar null se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    expect(await service.execute(99)).toBeNull();
  });
});

describe('UpdateThemeService', () => {
  let service: UpdateThemeService;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdateThemeService(mockRepo as any); });

  it('deve atualizar e retornar o tema', async () => {
    mockRepo.findOne.mockResolvedValue({ theme_id: 1 });
    mockRepo.update.mockResolvedValue({ tema_id: 1, descricao: 'Novo' });
    expect(((await service.execute(1, { descricao: 'Novo' } as any)) as any).descricao).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99, {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeleteThemeService', () => {
  let service: DeleteThemeService;
  beforeEach(() => { jest.clearAllMocks(); service = new DeleteThemeService(mockRepo as any); });

  it('deve deletar o tema', async () => {
    mockRepo.findOne.mockResolvedValue({ tema_id: 1 });
    mockRepo.delete.mockResolvedValue({ tema_id: 1 });
    await service.execute(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});
