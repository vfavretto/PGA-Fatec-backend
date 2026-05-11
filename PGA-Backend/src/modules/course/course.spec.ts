import { NotFoundException } from '@nestjs/common';
import { CreateCourseService } from './services/create-course.service';
import { FindAllCourseService } from './services/find-all-course.service';
import { FindOneCourseService } from './services/find-one-course.service';
import { UpdateCourseService } from './services/update-course.service';
import { DeleteCourseService } from './services/delete-course.service';
import { CourseController } from './course.controller';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  findByUnitId: jest.fn(),
  findAllByRegional: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockPrisma = {
  rotinaInstitucional: { count: jest.fn() },
};

describe('CreateCourseService', () => {
  let service: CreateCourseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateCourseService(mockRepo as any);
  });

  it('deve criar e retornar o curso', async () => {
    const dto = { nome: 'TSI', unidade_id: 'uuid-1', tipo: 'Superior' as any, status: 'Ativo' as any };
    const created = { curso_id: 1, ...dto };
    mockRepo.create.mockResolvedValue(created);

    const result = await service.execute(dto);
    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(created);
  });
});

describe('FindAllCourseService', () => {
  let service: FindAllCourseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllCourseService(mockRepo as any);
  });

  it('deve retornar todos os cursos sem contexto', async () => {
    mockRepo.findAll.mockResolvedValue([{ curso_id: 1 }]);
    const result = await service.execute();
    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por unidade quando contexto é unidade', async () => {
    mockRepo.findByUnitId.mockResolvedValue([{ curso_id: 2 }]);
    const result = await service.execute({ active_context: { tipo: 'unidade', id: 'uuid-5' } });
    expect(mockRepo.findByUnitId).toHaveBeenCalledWith('uuid-5');
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional quando contexto é regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ curso_id: 3 }]);
    const result = await service.execute({ active_context: { tipo: 'regional', id: 'uuid-2' } });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith('uuid-2');
  });
});

describe('FindOneCourseService', () => {
  let service: FindOneCourseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneCourseService(mockRepo as any);
  });

  it('deve retornar o curso encontrado', async () => {
    const course = { curso_id: 1, nome: 'TSI' };
    mockRepo.findOneWithContext.mockResolvedValue(course);

    const result = await service.execute('uuid-1');
    expect(result).toBe(course);
  });

  it('deve lançar NotFoundException se curso não encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);

    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateCourseService', () => {
  let service: UpdateCourseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateCourseService(mockRepo as any);
  });

  it('deve atualizar e retornar o curso', async () => {
    const course = { curso_id: 1, nome: 'TSI' };
    mockRepo.findOne.mockResolvedValue(course);
    mockRepo.update.mockResolvedValue({ ...course, nome: 'Novo Nome' });

    const result = await service.execute('uuid-1', { nome: 'Novo Nome' } as any);
    expect(result.nome).toBe('Novo Nome');
  });

  it('deve lançar NotFoundException se curso não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.execute('uuid-99', {} as any)).rejects.toThrow(NotFoundException);
  });
});

describe('DeleteCourseService', () => {
  let service: DeleteCourseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteCourseService(mockRepo as any, mockPrisma as any);
  });

  it('deve lançar NotFoundException se curso não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.execute('uuid-99')).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se há rotinas vinculadas', async () => {
    mockRepo.findOne.mockResolvedValue({ curso_id: 'uuid-1' });
    mockPrisma.rotinaInstitucional.count.mockResolvedValue(2);

    await expect(service.execute('uuid-1')).rejects.toThrow();
  });

  it('deve excluir o curso quando sem dependências', async () => {
    mockRepo.findOne.mockResolvedValue({ curso_id: 'uuid-1' });
    mockPrisma.rotinaInstitucional.count.mockResolvedValue(0);
    mockRepo.softDelete.mockResolvedValue({ curso_id: 'uuid-1', ativo: false });

    const result = await service.execute('uuid-1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('uuid-1');
  });
});

describe('CourseController', () => {
  const mockCreate = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockFindOne = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };
  let controller: CourseController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CourseController(
      mockCreate as any,
      mockFindAll as any,
      mockFindOne as any,
      mockUpdate as any,
      mockDelete as any,
    );
  });

  it('create deve chamar createService', async () => {
    mockCreate.execute.mockResolvedValue({ curso_id: 1 });
    const dto = { nome: 'TSI', unidade_id: 'uuid-1', tipo: 'Superior' as any, status: 'Ativo' as any };
    await controller.create(dto);
    expect(mockCreate.execute).toHaveBeenCalledWith(dto);
  });

  it('findAll deve passar o user', async () => {
    mockFindAll.execute.mockResolvedValue([]);
    await controller.findAll({ user: { pessoa_id: 1 } });
    expect(mockFindAll.execute).toHaveBeenCalledWith({ pessoa_id: 1 });
  });

  it('findOne deve passar id e user', async () => {
    mockFindOne.execute.mockResolvedValue({ curso_id: 'uuid-1' });
    await controller.findOne({ user: {} }, 'uuid-1');
    expect(mockFindOne.execute).toHaveBeenCalledWith('uuid-1', {});
  });

  it('update deve passar id e dto', async () => {
    mockUpdate.execute.mockResolvedValue({ curso_id: 'uuid-1' });
    await controller.update('uuid-1', {} as any);
    expect(mockUpdate.execute).toHaveBeenCalledWith('uuid-1', {});
  });

  it('delete deve passar id', async () => {
    mockDelete.execute.mockResolvedValue({ curso_id: 'uuid-1', ativo: false });
    await controller.delete('uuid-1');
    expect(mockDelete.execute).toHaveBeenCalledWith('uuid-1');
  });
});
