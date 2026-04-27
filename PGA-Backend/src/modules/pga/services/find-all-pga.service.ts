import { Injectable } from '@nestjs/common';
import { PgaRepository } from '../pga.repository';
import { PGA } from '../entities/pga.entity';

@Injectable()
export class FindAllPgaService {
  constructor(private readonly repository: PgaRepository) {}

  async execute(user?: any): Promise<PGA[]> {
    const tipo: string = user?.tipo_usuario ?? '';
    const active = user?.active_context ?? null;
    const isAdminCps = tipo === 'Administrador' || tipo === 'CPS';

    // Admin/CPS sem contexto ativo → vê todos (incluindo templates)
    if (isAdminCps && !active) {
      return this.repository.findAll();
    }

    // Admin/CPS com contexto de unidade (improvável, mas suportado)
    if (isAdminCps && active?.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id, false);
    }

    // Regional → só vê PGAs das unidades da sua regional (não templates)
    if (active?.tipo === 'regional') {
      return this.repository.findAllByRegional(active.id);
    }

    // Diretor/demais → só vê o PGA da própria unidade (não templates)
    if (active?.tipo === 'unidade') {
      return this.repository.findAllByUnit(active.id, false);
    }

    return [];
  }
}
