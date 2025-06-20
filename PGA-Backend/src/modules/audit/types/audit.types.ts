export interface ReportEntry {
  tabela: string;
  operacao: string;
  count: number;
  registros: Array<{
    registro_id: number;
    data_operacao: Date;
    usuario: string;
    motivo: string | null;
  }>;
}

export interface YearSummary {
  ano: number;
  total_operacoes: number;
  operacoes_por_tipo: Record<string, number>;
}

export interface AuditSummaryResponse {
  periodo: { inicio: number; fim: number };
  anos: YearSummary[];
  timestamp: Date;
}

export interface ChangesReportResponse {
  ano: number;
  resumo: ReportEntry[];
  total_operacoes: number;
  timestamp: Date;
}
