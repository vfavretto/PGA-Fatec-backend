import { AuditLogService } from './services/audit-log.service';
import { VersionManagerService } from './services/version-manager.service';

const mockPrisma = {
  configuracaoAuditoria: {
    create: jest.fn(),
    findMany: jest.fn(),
    groupBy: jest.fn(),
    count: jest.fn(),
  },
};

const mockVersionRepo = {
  getSituacoesProblemaByYear: jest.fn(),
  getEixosTematicosByYear: jest.fn(),
  getPrioridadesByYear: jest.fn(),
  getTemasByYear: jest.fn(),
  getEntregaveisByYear: jest.fn(),
  getPessoasByYear: jest.fn(),
};

describe('AuditLogService', () => {
  let service: AuditLogService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuditLogService(mockPrisma as any);
  });

  it('deve criar log de auditoria', async () => {
    mockPrisma.configuracaoAuditoria.create.mockResolvedValue({ auditoria_id: 1 });

    const dto = {
      tabela: 'pga',
      registro_id: 'uuid-1',
      ano: 2024,
      operacao: 'CREATE' as any,
      dados_antes: null,
      dados_depois: {},
      usuario_id: 'uuid-1',
      motivo: 'test',
    };

    const result = await service.createLog(dto);
    expect(result).toEqual({ auditoria_id: 1 });
    expect(mockPrisma.configuracaoAuditoria.create).toHaveBeenCalled();
  });

  it('deve relançar erro se create falhar', async () => {
    mockPrisma.configuracaoAuditoria.create.mockRejectedValue(new Error('DB error'));

    await expect(service.createLog({
      tabela: 'pga',
      registro_id: 'uuid-1',
      ano: 2024,
      operacao: 'CREATE' as any,
      dados_antes: null,
      dados_depois: {},
      usuario_id: 'uuid-1',
      motivo: '',
    })).rejects.toThrow('DB error');
  });

  it('deve retornar relatório de mudanças por ano', async () => {
    mockPrisma.configuracaoAuditoria.findMany.mockResolvedValue([
      { tabela: 'pga', operacao: 'CREATE', usuario: { nome: 'Admin' }, data_operacao: new Date(), dados_antes: null, dados_depois: {} },
    ]);

    const result = await service.getChangesReport(2024);
    expect(result).toBeDefined();
  });
});

describe('VersionManagerService', () => {
  let service: VersionManagerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VersionManagerService(mockVersionRepo as any);
  });

  it('deve retornar configurações por ano', async () => {
    mockVersionRepo.getSituacoesProblemaByYear.mockResolvedValue([]);
    mockVersionRepo.getEixosTematicosByYear.mockResolvedValue([]);
    mockVersionRepo.getPrioridadesByYear.mockResolvedValue([]);
    mockVersionRepo.getTemasByYear.mockResolvedValue([]);
    mockVersionRepo.getEntregaveisByYear.mockResolvedValue([]);
    mockVersionRepo.getPessoasByYear.mockResolvedValue([]);

    const result = await service.getConfigurationsByYear(2024);
    expect(result.ano).toBe(2024);
    expect(result.configuracoes).toBeDefined();
  });

  it('deve retornar situações problema por ano', async () => {
    mockVersionRepo.getSituacoesProblemaByYear.mockResolvedValue([{ id: 1 }]);
    const result = await service.getSituacoesProblemaByYear(2024);
    expect(result).toHaveLength(1);
  });

  it('deve retornar eixos temáticos por ano', async () => {
    mockVersionRepo.getEixosTematicosByYear.mockResolvedValue([{ id: 1 }]);
    const result = await service.getEixosTematicosByYear(2024);
    expect(result).toHaveLength(1);
  });
});
