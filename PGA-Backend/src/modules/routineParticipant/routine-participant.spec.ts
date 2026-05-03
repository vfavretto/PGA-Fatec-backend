import { NotFoundException } from '@nestjs/common';
import { CreateRoutineParticipantService } from './services/create-routine-participant.service';
import { FindAllRoutineParticipantService } from './services/find-all-routine-participant.service';
import { FindOneRoutineParticipantService } from './services/find-one-routine-participant.service';
import { UpdateRoutineParticipantService } from './services/update-routine-participant.service';
import { DeleteRoutineParticipantService } from './services/delete-routine-participant.service';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('CreateRoutineParticipantService', () => {
  let service: CreateRoutineParticipantService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateRoutineParticipantService(mockRepo as any);
  });

  it('deve criar e retornar o participante', async () => {
    mockRepo.create.mockResolvedValue({ participant_id: 1 });
    expect(await service.execute({ nome: 'João' } as any)).toEqual({
      participant_id: 1,
    });
  });
});

describe('FindAllRoutineParticipantService', () => {
  let service: FindAllRoutineParticipantService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllRoutineParticipantService(mockRepo as any);
  });

  it('deve retornar todos os participantes', async () => {
    mockRepo.findAll.mockResolvedValue([{ participant_id: 1 }]);
    expect(await service.execute()).toHaveLength(1);
  });
});

describe('FindOneRoutineParticipantService', () => {
  let service: FindOneRoutineParticipantService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneRoutineParticipantService(mockRepo as any);
  });

  it('deve retornar o participante encontrado', async () => {
    mockRepo.findOne.mockResolvedValue({ participant_id: 1 });
    expect(await service.execute('1')).toEqual({ participant_id: 1 });
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('UpdateRoutineParticipantService', () => {
  let service: UpdateRoutineParticipantService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateRoutineParticipantService(mockRepo as any);
  });

  it('deve atualizar e retornar o participante', async () => {
    mockRepo.findOne.mockResolvedValue({ participant_id: 1 });
    mockRepo.update.mockResolvedValue({
      rotina_participante_id: 1,
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

describe('DeleteRoutineParticipantService', () => {
  let service: DeleteRoutineParticipantService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteRoutineParticipantService(mockRepo as any);
  });

  it('deve deletar o participante', async () => {
    mockRepo.findOne.mockResolvedValue({ participant_id: 1 });
    mockRepo.softDelete.mockResolvedValue({ participant_id: 1 });
    await service.execute('1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('1');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});
