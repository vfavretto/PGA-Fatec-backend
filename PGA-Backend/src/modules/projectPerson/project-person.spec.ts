import { NotFoundException } from '@nestjs/common';
import { CreateProjectPersonService } from './services/create-project-person.service';
import { FindAllProjectPersonService } from './services/find-all-project-person.service';
import { FindOneProjectPersonService } from './services/find-one-project-person.service';
import { UpdateProjectPersonService } from './services/update-project-person.service';
import { DeleteProjectPersonService } from './services/delete-project-person.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAllByUnit: jest.fn(),
  findAllByRegional: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateProjectPersonService', () => {
  let service: CreateProjectPersonService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateProjectPersonService(mockRepo as any);
  });

  it('deve criar e retornar a associação projeto-pessoa', async () => {
    mockRepo.create.mockResolvedValue({ projeto_pessoa_id: 1 });
    expect(
      await service.execute({ pessoa_id: 1, acao_projeto_id: 1 } as any),
    ).toEqual({ projeto_pessoa_id: 1 });
  });
});

describe('FindAllProjectPersonService', () => {
  let service: FindAllProjectPersonService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllProjectPersonService(mockRepo as any);
  });

  it('deve retornar todas as associações', async () => {
    mockRepo.findAll.mockResolvedValue([{ projeto_pessoa_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });

  it('deve filtrar por unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ projeto_pessoa_id: 2 }]);
    const result = await service.execute({
      active_context: { tipo: 'unidade', id: 3 },
    });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith(3);
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ projeto_pessoa_id: 3 }]);
    const result = await service.execute({
      active_context: { tipo: 'regional', id: 1 },
    });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith(1);
    expect(result).toHaveLength(1);
  });
});

describe('FindOneProjectPersonService', () => {
  let service: FindOneProjectPersonService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneProjectPersonService(mockRepo as any);
  });

  it('deve retornar a associação encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ projeto_pessoa_id: 1 });
    expect(await service.execute('1')).toEqual({ projeto_pessoa_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrada', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateProjectPersonService', () => {
  let service: UpdateProjectPersonService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateProjectPersonService(mockRepo as any);
  });

  it('deve atualizar e retornar a associação', async () => {
    mockRepo.findOne.mockResolvedValue({ projeto_pessoa_id: 1 });
    mockRepo.update.mockResolvedValue({
      projeto_pessoa_id: 1,
      papel: 'Coordenador',
    });
    expect(
      ((await service.execute('1', { papel: 'Coordenador' } as any)) as any)
        .papel,
    ).toBe('Coordenador');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('DeleteProjectPersonService', () => {
  let service: DeleteProjectPersonService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteProjectPersonService(mockRepo as any);
  });

  it('deve deletar a associação', async () => {
    mockRepo.findOne.mockResolvedValue({ projeto_pessoa_id: 1 });
    mockRepo.delete.mockResolvedValue({ projeto_pessoa_id: 1 });
    await service.execute('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});
