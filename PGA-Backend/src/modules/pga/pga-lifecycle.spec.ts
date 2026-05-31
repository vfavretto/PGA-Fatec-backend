/**
 * Testes Baseados em Estados — Ciclo de Vida do PGA
 * Referência: casos-de-teste-estados.md
 *
 * A) Cobertura de Estados  → CT-EST-01
 * B) Cobertura de Transições → CT-TRANS-01, CT-TRANS-02
 * C) Cobertura de Caminhos  → CT-CAM-01 … CT-CAM-06
 */

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StatusPGA } from '@prisma/client';
import { CreatePgaService } from './services/create-pga.service';
import { UpdatePgaService } from './services/update-pga.service';
import { SubmitPgaService } from './services/submit-pga.service';
import { ReviewRegionalPgaService } from '../regional/services/review-regional-pga.service';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockRepo = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  updateWorkflow: jest.fn(),
};

const mockPrisma = {
  unidade: { findUnique: jest.fn() },
  pessoa: { findUnique: jest.fn() },
};

const mockRegionalRepo = {
  findPgaForRegional: jest.fn(),
  updatePgaReview: jest.fn(),
};

// ── Constantes ───────────────────────────────────────────────────────────────

const PGA_ID = 'pga-001';
const UNIT_ID = 'unit-001';
const REGIONAL_ID = 'regional-001';

const ADMIN = { tipo_usuario: 'Administrador', pessoa_id: 'admin-001' };
const DIRETOR = {
  tipo_usuario: 'Diretor',
  pessoa_id: 'dir-001',
  active_context: { tipo: 'unidade', id: UNIT_ID },
};

const PESSOA_ADMIN = { tipo_usuario: 'Administrador', unidades: [] };
const PESSOA_DIRETOR = {
  tipo_usuario: 'Diretor',
  unidades: [{ unidade_id: UNIT_ID }],
};

// ── Helper ───────────────────────────────────────────────────────────────────

function makePga(status: StatusPGA, extra: object = {}) {
  return { pga_id: PGA_ID, unidade_id: UNIT_ID, ano: 2025, status, ...extra };
}

// ═══════════════════════════════════════════════════════════════════════════
// A) COBERTURA DE ESTADOS
// ═══════════════════════════════════════════════════════════════════════════

describe('A) Cobertura de Estados', () => {
  let createSvc: CreatePgaService;
  let updateSvc: UpdatePgaService;
  let submitSvc: SubmitPgaService;
  let reviewSvc: ReviewRegionalPgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    createSvc = new CreatePgaService(mockRepo as any, mockPrisma as any);
    updateSvc = new UpdatePgaService(mockRepo as any, mockPrisma as any);
    submitSvc = new SubmitPgaService(mockRepo as any, mockPrisma as any);
    reviewSvc = new ReviewRegionalPgaService(mockRegionalRepo as any);
  });

  /**
   * CT-EST-01 — Fluxo completo percorrendo todos os 4 estados.
   * EmElaboracao → Submetido → Reprovado → EmElaboracao → Submetido → Aprovado
   */
  it('CT-EST-01: deve visitar os 4 estados — EmElaboracao, Submetido, Reprovado, Aprovado', async () => {
    // ── Etapa 1: Criar PGA → estado EmElaboracao ─────────────────────────
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));

    const created = await createSvc.execute(
      { unidade_id: UNIT_ID, ano: 2025 } as any,
      ADMIN,
    );
    expect(created.status).toBe(StatusPGA.EmElaboracao); // Estado 1 ✓

    // ── Etapa 2: Submeter PGA → estado Submetido ─────────────────────────
    mockRepo.findOne.mockResolvedValueOnce(
      makePga(StatusPGA.EmElaboracao),
    );
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));

    const submitted = await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);
    expect(submitted.status).toBe(StatusPGA.Submetido); // Estado 2 ✓

    // ── Etapa 3: Regional reprova → estado Reprovado ──────────────────────
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Reprovado, { parecer_regional: 'Faltam ações CPA' }),
    );

    const rejected = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Reprovado,
      parecer: 'Faltam ações CPA',
    });
    expect(rejected.status).toBe(StatusPGA.Reprovado); // Estado 3 ✓
    expect((rejected as any).parecer_regional).toBe('Faltam ações CPA');

    // ── Etapa 4: Coordenador reabre → estado EmElaboracao ─────────────────
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.Reprovado));
    mockRepo.update.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));

    const reopened = await updateSvc.execute(
      PGA_ID,
      { status: StatusPGA.EmElaboracao } as any,
      ADMIN,
    );
    expect(reopened.status).toBe(StatusPGA.EmElaboracao); // Estado 4 ✓ (reaberto)

    // ── Etapa 5: Resubmeter → estado Submetido ───────────────────────────
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));

    const resubmitted = await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);
    expect(resubmitted.status).toBe(StatusPGA.Submetido);

    // ── Etapa 6: Regional aprova → estado Aprovado ───────────────────────
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado, { parecer_regional: 'Aprovado sem ressalvas' }),
    );

    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
      parecer: 'Aprovado sem ressalvas',
    });
    expect(approved.status).toBe(StatusPGA.Aprovado); // Estado final ✓
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// B) COBERTURA DE TRANSIÇÕES
// ═══════════════════════════════════════════════════════════════════════════

describe('B) Cobertura de Transições', () => {
  let createSvc: CreatePgaService;
  let updateSvc: UpdatePgaService;
  let submitSvc: SubmitPgaService;
  let reviewSvc: ReviewRegionalPgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    createSvc = new CreatePgaService(mockRepo as any, mockPrisma as any);
    updateSvc = new UpdatePgaService(mockRepo as any, mockPrisma as any);
    submitSvc = new SubmitPgaService(mockRepo as any, mockPrisma as any);
    reviewSvc = new ReviewRegionalPgaService(mockRegionalRepo as any);
  });

  /**
   * CT-TRANS-01 — Fluxo de aprovação direta.
   * Cobre: T1 (criar), T3 (submeter), T4 (aprovar)
   */
  it('CT-TRANS-01: T1 criar → T3 submeter → T4 aprovar', async () => {
    // T1: — → EmElaboracao (POST /pga)
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));

    const created = await createSvc.execute(
      { unidade_id: UNIT_ID, ano: 2025 } as any,
    );
    expect(created.status).toBe(StatusPGA.EmElaboracao);
    expect(mockRepo.create).toHaveBeenCalledTimes(1);

    // T3: EmElaboracao → Submetido (POST /pga/:id/submeter)
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));

    const submitted = await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);
    expect(submitted.status).toBe(StatusPGA.Submetido);
    expect(mockRepo.updateWorkflow).toHaveBeenCalledWith(
      PGA_ID,
      expect.objectContaining({ status: StatusPGA.Submetido }),
    );

    // T4: Submetido → Aprovado (PATCH /regional/pgas/:id/avaliacao)
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado, {
        parecer_regional: 'Conforme padrões institucionais',
        data_parecer_regional: new Date(),
        regional_responsavel_id: REGIONAL_ID,
      }),
    );

    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
      parecer: 'Conforme padrões institucionais',
    });
    expect(approved.status).toBe(StatusPGA.Aprovado);
    expect((approved as any).parecer_regional).toBe('Conforme padrões institucionais');
    expect((approved as any).regional_responsavel_id).toBe(REGIONAL_ID);
  });

  /**
   * CT-TRANS-02 — Fluxo de reprovação com edição.
   * Cobre: T5 (reprovar), T6 (reabrir), T2 (editar)
   */
  it('CT-TRANS-02: T5 reprovar → T6 reabrir → T2 editar (sem mudar status)', async () => {
    // Pré-requisito: PGA já submetido (T1 + T3)
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));
    await createSvc.execute({ unidade_id: UNIT_ID, ano: 2025 } as any);

    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);

    // T5: Submetido → Reprovado
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Reprovado, { parecer_regional: 'Faltam detalhes' }),
    );

    const rejected = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Reprovado,
      parecer: 'Faltam detalhes',
    });
    expect(rejected.status).toBe(StatusPGA.Reprovado);
    expect((rejected as any).parecer_regional).toBe('Faltam detalhes');

    // T6: Reprovado → EmElaboracao (PUT /pga/:id com status=EmElaboracao)
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.Reprovado));
    mockRepo.update.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));

    const reopened = await updateSvc.execute(
      PGA_ID,
      { status: StatusPGA.EmElaboracao } as any,
      ADMIN,
    );
    expect(reopened.status).toBe(StatusPGA.EmElaboracao);

    // T2: EmElaboracao → EmElaboracao (edição sem mudança de status)
    const updatedTitle = 'PGA Revisado 2025';
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockRepo.update.mockResolvedValueOnce(
      makePga(StatusPGA.EmElaboracao, { titulo: updatedTitle }),
    );

    const edited = await updateSvc.execute(
      PGA_ID,
      { titulo: updatedTitle } as any,
      ADMIN,
    );
    expect(edited.status).toBe(StatusPGA.EmElaboracao);
    expect((edited as any).titulo).toBe(updatedTitle);
    // Não deve ter setado data_elaboracao pois não submeteu
    expect(mockRepo.update).toHaveBeenLastCalledWith(
      PGA_ID,
      expect.not.objectContaining({ data_elaboracao: expect.anything() }),
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// C) COBERTURA DE CAMINHOS
// ═══════════════════════════════════════════════════════════════════════════

describe('C) Cobertura de Caminhos', () => {
  let createSvc: CreatePgaService;
  let updateSvc: UpdatePgaService;
  let submitSvc: SubmitPgaService;
  let reviewSvc: ReviewRegionalPgaService;

  beforeEach(() => {
    jest.clearAllMocks();
    createSvc = new CreatePgaService(mockRepo as any, mockPrisma as any);
    updateSvc = new UpdatePgaService(mockRepo as any, mockPrisma as any);
    submitSvc = new SubmitPgaService(mockRepo as any, mockPrisma as any);
    reviewSvc = new ReviewRegionalPgaService(mockRegionalRepo as any);
  });

  /**
   * CT-CAM-01 — Caminho principal (happy path).
   * EmElaboracao → Submetido → Aprovado
   */
  it('CT-CAM-01: caminho principal — criar, submeter e aprovar', async () => {
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));
    const created = await createSvc.execute(
      { unidade_id: UNIT_ID, ano: 2025 } as any,
    );
    expect(created.status).toBe(StatusPGA.EmElaboracao);

    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_DIRETOR);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    const submitted = await submitSvc.execute(PGA_ID, DIRETOR.pessoa_id);
    expect(submitted.status).toBe(StatusPGA.Submetido);

    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado, { parecer_regional: 'Conforme padrões institucionais' }),
    );
    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
      parecer: 'Conforme padrões institucionais',
    });
    expect(approved.status).toBe(StatusPGA.Aprovado);
  });

  /**
   * CT-CAM-02 — Caminho com reprovação e resubmissão (1 ciclo).
   * EmElaboracao → Submetido → Reprovado → EmElaboracao → Submetido → Aprovado
   */
  it('CT-CAM-02: 1 ciclo de reprovação e resubmissão', async () => {
    // 1. Criar
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));
    await createSvc.execute({ unidade_id: UNIT_ID, ano: 2025 } as any);

    // 2. Submeter
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    const submitted = await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);
    expect(submitted.status).toBe(StatusPGA.Submetido);

    // 3. Reprovar
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Reprovado, { parecer_regional: 'Ações prioritárias insuficientes' }),
    );
    const rejected = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Reprovado,
      parecer: 'Ações prioritárias insuficientes',
    });
    expect(rejected.status).toBe(StatusPGA.Reprovado);

    // 4. Reabrir para correção
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.Reprovado));
    mockRepo.update.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    const reopened = await updateSvc.execute(
      PGA_ID,
      { status: StatusPGA.EmElaboracao } as any,
      ADMIN,
    );
    expect(reopened.status).toBe(StatusPGA.EmElaboracao);

    // 5. Resubmeter
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    const resubmitted = await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);
    expect(resubmitted.status).toBe(StatusPGA.Submetido);

    // 6. Aprovar
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado),
    );
    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
    });
    expect(approved.status).toBe(StatusPGA.Aprovado);
  });

  /**
   * CT-CAM-03 — Caminho com múltiplas reprovações (2 ciclos).
   * EmElaboracao → Sub → Rep → Elab → Sub → Rep → Elab → Sub → Aprovado
   */
  it('CT-CAM-03: 2 ciclos de reprovação — aprovação na terceira submissão', async () => {
    // 1. Criar
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));
    await createSvc.execute({ unidade_id: UNIT_ID, ano: 2025 } as any);

    // 2. 1ª submissão
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);

    // 3. 1ª reprovação
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Reprovado, { parecer_regional: 'Faltam rotinas institucionais' }),
    );
    const rep1 = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Reprovado,
      parecer: 'Faltam rotinas institucionais',
    });
    expect(rep1.status).toBe(StatusPGA.Reprovado);

    // 4. 1ª reabertura
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.Reprovado));
    mockRepo.update.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    await updateSvc.execute(PGA_ID, { status: StatusPGA.EmElaboracao } as any, ADMIN);

    // 5. 2ª submissão
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);

    // 6. 2ª reprovação
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Reprovado, { parecer_regional: 'Situações-problema incompletas' }),
    );
    const rep2 = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Reprovado,
      parecer: 'Situações-problema incompletas',
    });
    expect(rep2.status).toBe(StatusPGA.Reprovado);
    expect((rep2 as any).parecer_regional).toBe('Situações-problema incompletas');

    // 7. 2ª reabertura
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.Reprovado));
    mockRepo.update.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    await updateSvc.execute(PGA_ID, { status: StatusPGA.EmElaboracao } as any, ADMIN);

    // 8. 3ª submissão
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);

    // 9. Aprovação final
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado),
    );
    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
    });
    expect(approved.status).toBe(StatusPGA.Aprovado);

    // Verifica contagens totais de chamadas
    expect(mockRepo.updateWorkflow).toHaveBeenCalledTimes(3); // 3 submissões
    expect(mockRepo.update).toHaveBeenCalledTimes(2);         // 2 reabertura
    expect(mockRegionalRepo.updatePgaReview).toHaveBeenCalledTimes(3); // 2 reprovações + 1 aprovação
  });

  /**
   * CT-CAM-04 — Caminho com edição antes de submeter (auto-transição T2).
   * EmElaboracao → EmElaboracao (edição) → EmElaboracao (edição) → Submetido → Aprovado
   */
  it('CT-CAM-04: múltiplas edições antes de submeter — status permanece EmElaboracao', async () => {
    // 1. Criar com dados mínimos
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));
    const created = await createSvc.execute({ unidade_id: UNIT_ID, ano: 2025 } as any);
    expect(created.status).toBe(StatusPGA.EmElaboracao);

    // 2. 1ª edição: adicionar ações CPA
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockRepo.update.mockResolvedValueOnce(
      makePga(StatusPGA.EmElaboracao, { acoes_cpa: 'Ação 1' }),
    );
    const edit1 = await updateSvc.execute(
      PGA_ID,
      { acoes_cpa: 'Ação 1' } as any,
      ADMIN,
    );
    expect(edit1.status).toBe(StatusPGA.EmElaboracao);

    // 3. 2ª edição: vincular situações-problema
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockRepo.update.mockResolvedValueOnce(
      makePga(StatusPGA.EmElaboracao, { situacoes_problema: 'SP-01' }),
    );
    const edit2 = await updateSvc.execute(
      PGA_ID,
      { situacoes_problema: 'SP-01' } as any,
      ADMIN,
    );
    expect(edit2.status).toBe(StatusPGA.EmElaboracao);

    // Nenhuma das edições deve ter alterado o status
    expect(mockRepo.update).toHaveBeenCalledTimes(2);
    mockRepo.update.mock.calls.forEach((call) => {
      expect(call[1]).not.toHaveProperty('data_elaboracao');
    });

    // 4. Submeter PGA completo
    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_DIRETOR);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    const submitted = await submitSvc.execute(PGA_ID, DIRETOR.pessoa_id);
    expect(submitted.status).toBe(StatusPGA.Submetido);

    // 5. Aprovar
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado),
    );
    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
    });
    expect(approved.status).toBe(StatusPGA.Aprovado);
  });

  /**
   * CT-CAM-05 — Caminho de erro: tentativa de aprovação com status inválido.
   * Regional envia status "EmElaboracao" no endpoint de avaliação → 400 BadRequest.
   */
  it('CT-CAM-05: status inválido na avaliação regional retorna BadRequestException', async () => {
    // Pré-req: PGA submetido
    mockPrisma.unidade.findUnique.mockResolvedValue({ unidade_id: UNIT_ID });
    mockRepo.create.mockResolvedValue(makePga(StatusPGA.EmElaboracao));
    await createSvc.execute({ unidade_id: UNIT_ID, ano: 2025 } as any);

    mockRepo.findOne.mockResolvedValueOnce(makePga(StatusPGA.EmElaboracao));
    mockPrisma.pessoa.findUnique.mockResolvedValueOnce(PESSOA_ADMIN);
    mockRepo.updateWorkflow.mockResolvedValueOnce(makePga(StatusPGA.Submetido));
    const submitted = await submitSvc.execute(PGA_ID, ADMIN.pessoa_id);
    expect(submitted.status).toBe(StatusPGA.Submetido);

    // Tentativa com status inválido → deve lançar BadRequestException
    await expect(
      reviewSvc.execute(REGIONAL_ID, PGA_ID, {
        status: StatusPGA.EmElaboracao as any,
        parecer: 'Qualquer',
      }),
    ).rejects.toThrow(BadRequestException);

    // findPgaForRegional NÃO deve ter sido chamado (validação ocorre antes)
    expect(mockRegionalRepo.findPgaForRegional).not.toHaveBeenCalled();

    // Avaliação correta após o erro — PGA continua Submetido
    mockRegionalRepo.findPgaForRegional.mockResolvedValueOnce(
      makePga(StatusPGA.Submetido),
    );
    mockRegionalRepo.updatePgaReview.mockResolvedValueOnce(
      makePga(StatusPGA.Aprovado),
    );
    const approved = await reviewSvc.execute(REGIONAL_ID, PGA_ID, {
      status: StatusPGA.Aprovado,
    });
    expect(approved.status).toBe(StatusPGA.Aprovado);
  });

  /**
   * CT-CAM-06 — Caminho de erro: PGA inexistente.
   * Submeter ID que não existe → 404 NotFoundException.
   */
  it('CT-CAM-06: PGA inexistente ao submeter retorna NotFoundException', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(
      submitSvc.execute('id-inexistente', ADMIN.pessoa_id),
    ).rejects.toThrow(NotFoundException);

    expect(mockRepo.updateWorkflow).not.toHaveBeenCalled();
  });
});
