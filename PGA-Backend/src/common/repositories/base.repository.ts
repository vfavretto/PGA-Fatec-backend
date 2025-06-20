import { PrismaService } from '../../config/prisma.service';

export abstract class BaseRepository<T> {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Filtro auxiliar para selecionar apenas registros ativos
   */
  protected whereActive(additionalWhere: any = {}): any {
    return {
      ...additionalWhere,
      ativo: true,
    };
  }
}
