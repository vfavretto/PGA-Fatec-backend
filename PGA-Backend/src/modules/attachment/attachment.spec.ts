/**
 * Testes unitários para o módulo attachment
 * Cobre: Create, FindAll, FindOne, Update, Delete, FindByDeliverable, FindByProcessStep
 */
import { NotFoundException } from '@nestjs/common';
import { CreateAttachmentService } from './services/create-attachment.service';
import { FindAllAttachmentService } from './services/find-all-attachment.service';
import { FindOneAttachmentService } from './services/find-one-attachment.service';
import { UpdateAttachmentService } from './services/update-attachment.service';
import { DeleteAttachmentService } from './services/delete-attachment.service';
import { FindByDeliverableService } from './services/find-by-deliverable.service';
import { FindByProcessStepService } from './services/find-by-process-step.service';
import { AttachmentController } from './attachment.controller';

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findAllByUnit: jest.fn(),
  findAllByRegional: jest.fn(),
  findOne: jest.fn(),
  findOneWithContext: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByEntregavel: jest.fn(),
  findByEntregavelWithContext: jest.fn(),
  findByEtapaProcesso: jest.fn(),
  findByEtapaProcessoWithContext: jest.fn(),
};

describe('CreateAttachmentService', () => {
  let service: CreateAttachmentService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new CreateAttachmentService(mockRepo as any);
  });

  it('deve criar e retornar o anexo', async () => {
    mockRepo.create.mockResolvedValue({ attachment_id: 1 });
    const result = await service.execute({ nome: 'doc.pdf' } as any);
    expect(result).toEqual({ attachment_id: 1 });
  });
});

describe('FindAllAttachmentService', () => {
  let service: FindAllAttachmentService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindAllAttachmentService(mockRepo as any);
  });

  it('deve retornar todos os anexos', async () => {
    mockRepo.findAll.mockResolvedValue([{ attachment_id: 1 }]);
    const result = await service.execute();
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por unidade', async () => {
    mockRepo.findAllByUnit.mockResolvedValue([{ attachment_id: 2 }]);
    const result = await service.execute({
      active_context: { tipo: 'unidade', id: 5 },
    });
    expect(mockRepo.findAllByUnit).toHaveBeenCalledWith(5);
    expect(result).toHaveLength(1);
  });

  it('deve filtrar por regional', async () => {
    mockRepo.findAllByRegional.mockResolvedValue([{ attachment_id: 3 }]);
    const result = await service.execute({
      active_context: { tipo: 'regional', id: 2 },
    });
    expect(mockRepo.findAllByRegional).toHaveBeenCalledWith(2);
    expect(result).toHaveLength(1);
  });
});

describe('FindOneAttachmentService', () => {
  let service: FindOneAttachmentService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindOneAttachmentService(mockRepo as any);
  });

  it('deve retornar anexo encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue({ anexo_id: 1 });
    const result = await service.execute('1');
    expect(result).toEqual({ anexo_id: 1 });
  });

  it('deve retornar null se não encontrado', async () => {
    mockRepo.findOneWithContext.mockResolvedValue(null);
    const result = await service.execute('99');
    expect(result).toBeNull();
  });
});

describe('UpdateAttachmentService', () => {
  let service: UpdateAttachmentService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateAttachmentService(mockRepo as any);
  });

  it('deve atualizar o anexo', async () => {
    mockRepo.update.mockResolvedValue({ anexo_id: 1, item: 'Documento' });
    const result = await service.execute('1', { item: 'Documento' } as any);
    expect((result as any).item).toBe('Documento');
  });

  it('deve chamar update com os dados corretos', async () => {
    mockRepo.update.mockResolvedValue({ anexo_id: 1 });
    await service.execute('1', {} as any);
    expect(mockRepo.update).toHaveBeenCalledWith('1', {});
  });
});

describe('DeleteAttachmentService', () => {
  let service: DeleteAttachmentService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new DeleteAttachmentService(mockRepo as any);
  });

  it('deve deletar o anexo', async () => {
    mockRepo.findOne.mockResolvedValue({ attachment_id: 1 });
    mockRepo.delete.mockResolvedValue({ attachment_id: 1 });
    await service.execute('1');
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });

  it('deve lançar NotFoundException se não encontrado', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.execute('99')).rejects.toThrow(NotFoundException);
  });
});

describe('FindByDeliverableService', () => {
  let service: FindByDeliverableService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindByDeliverableService(mockRepo as any);
  });

  it('deve retornar anexos do entregável', async () => {
    mockRepo.findByEntregavel.mockResolvedValue([{ attachment_id: 1 }]);
    const result = await service.execute('5');
    expect(mockRepo.findByEntregavel).toHaveBeenCalledWith('5');
    expect(result).toHaveLength(1);
  });

  it('deve usar contexto ativo quando fornecido', async () => {
    mockRepo.findByEntregavelWithContext.mockResolvedValue([
      { attachment_id: 2 },
    ]);
    const result = await service.execute('5', {
      active_context: { tipo: 'unidade', id: 1 },
    });
    expect(mockRepo.findByEntregavelWithContext).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});

describe('FindByProcessStepService', () => {
  let service: FindByProcessStepService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new FindByProcessStepService(mockRepo as any);
  });

  it('deve retornar anexos da etapa de processo', async () => {
    mockRepo.findByEtapaProcesso.mockResolvedValue([{ attachment_id: 2 }]);
    const result = await service.execute('3');
    expect(mockRepo.findByEtapaProcesso).toHaveBeenCalledWith('3');
    expect(result).toHaveLength(1);
  });

  it('deve usar contexto ativo quando fornecido', async () => {
    mockRepo.findByEtapaProcessoWithContext.mockResolvedValue([
      { attachment_id: 3 },
    ]);
    const result = await service.execute('3', {
      active_context: { tipo: 'regional', id: 1 },
    });
    expect(mockRepo.findByEtapaProcessoWithContext).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});
