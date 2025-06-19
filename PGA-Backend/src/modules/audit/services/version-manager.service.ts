import { Injectable } from '@nestjs/common';
import { VersionRepository } from '../repositories/version.repository';

@Injectable()
export class VersionManagerService {
  constructor(private readonly versionRepository: VersionRepository) {}

  async getConfigurationsByYear(ano: number) {
    const [
      situacoesProblema,
      eixosTematicos,
      prioridades,
      temas,
      entregaveis,
      pessoas,
    ] = await Promise.all([
      this.versionRepository.getSituacoesProblemaByYear(ano),
      this.versionRepository.getEixosTematicosByYear(ano),
      this.versionRepository.getPrioridadesByYear(ano),
      this.versionRepository.getTemasByYear(ano),
      this.versionRepository.getEntregaveisByYear(ano),
      this.versionRepository.getPessoasByYear(ano),
    ]);

    return {
      ano,
      configuracoes: {
        situacoesProblema,
        eixosTematicos,
        prioridades,
        temas,
        entregaveis,
        pessoas,
      },
      timestamp: new Date(),
    };
  }

  async getSituacoesProblemaByYear(ano: number) {
    return this.versionRepository.getSituacoesProblemaByYear(ano);
  }

  async getEixosTematicosByYear(ano: number) {
    return this.versionRepository.getEixosTematicosByYear(ano);
  }

  async getPrioridadesByYear(ano: number) {
    return this.versionRepository.getPrioridadesByYear(ano);
  }

  async getTemasByYear(ano: number) {
    return this.versionRepository.getTemasByYear(ano);
  }

  async getEntregaveisByYear(ano: number) {
    return this.versionRepository.getEntregaveisByYear(ano);
  }

  async getPessoasByYear(ano: number) {
    return this.versionRepository.getPessoasByYear(ano);
  }
}