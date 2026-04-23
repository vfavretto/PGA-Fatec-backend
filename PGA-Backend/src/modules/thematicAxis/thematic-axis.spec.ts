import { NotFoundException } from '@nestjs/common';
import { CreateThematicAxisService } from './services/create-thematicAxis.service';
import { FindAllThematicAxisService } from './services/find-all-thematicAxis.service';
import { FindOneThematicAxisService } from './services/find-one-thematicAxis.service';
import { UpdateThematicAxisService } from './services/update-thematicAxis.service';
import { DeleteThematicAxisService } from './services/delete-thematicAxis.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('CreateThematicAxisService', () => {
  let service: CreateThematicAxisService;
  beforeEach(() => { jest.clearAllMocks(); service = new CreateThematicAxisService(mockRepo as any); });

  it('deve criar e retornar o eixo temático', async () => {
    mockRepo.create.mockResolvedValue({ thematic_axis_id: 1 });
    expect(await service.execute({ nome: 'Eixo 1' } as any)).toEqual({ thematic_axis_id: 1 });
  });
});

describe('FindAllThematicAxisService', () => {
  let service: FindAllThematicAxisService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindAllThematicAxisService(mockRepo as any); });

  it('deve retornar todos os eixos temáticos', async () => {
    mockRepo.findAll.mockResolvedValue([{ thematic_axis_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOneThematicAxisService', () => {
  let service: FindOneThematicAxisService;
  beforeEach(() => { jest.clearAllMocks(); service = new FindOneThematicAxisService(mockRepo as any); });

  it('deve retornar o eixo encontrado', async () => {
    mockRepo.findOne.mockResolvedValue({ eixo_id: 1 });
    expect(await service.execute(1)).toEqual({ eixo_id: 1 });
  });

  it('deve retornar null se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    expect(await service.execute(99)).toBeNull();
  });
});

describe('UpdateThematicAxisService', () => {
  let service: UpdateThematicAxisService;
  beforeEach(() => { jest.clearAllMocks(); service = new UpdateThematicAxisService(mockRepo as any); });

  it('deve atualizar e retornar o eixo', async () => {
    mockRepo.findOne.mockResolvedValue({ thematic_axis_id: 1 });
    mockRepo.update.mockResolvedValue({ eixo_id: 1, nome: 'Novo' });
    expect(((await service.execute(1, { nome: 'Novo' } as any)) as any).nome).toBe('Novo');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99, {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeleteThematicAxisService', () => {
  let service: DeleteThematicAxisService;
  beforeEach(() => { jest.clearAllMocks(); service = new DeleteThematicAxisService(mockRepo as any); });

  it('deve deletar o eixo temático', async () => {
    mockRepo.findOne.mockResolvedValue({ thematic_axis_id: 1 });
    mockRepo.softDelete.mockResolvedValue({ thematic_axis_id: 1 });
    await service.execute(1);
    expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute(99)).rejects.toThrow(NotFoundException);
  });
});
