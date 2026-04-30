import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContextService } from './context.service';

const mockPrisma = {
  pessoa: { findMany: jest.fn(), findUnique: jest.fn(), findFirst: jest.fn() },
  unidade: { findMany: jest.fn(), findFirst: jest.fn() },
  pessoaUnidade: { findMany: jest.fn(), findFirst: jest.fn() },
};

const mockJwt = { sign: jest.fn().mockReturnValue('token') };

describe('ContextService', () => {
  let service: ContextService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ContextService(mockPrisma as any, mockJwt as any);
  });

  describe('getAvailableContexts', () => {
    it('deve retornar regionais e unidades para Administrador', async () => {
      mockPrisma.pessoa.findMany.mockResolvedValue([{ pessoa_id: 2, nome: 'Regional 1', email: 'r@r.com' }]);
      mockPrisma.unidade.findMany.mockResolvedValue([{ unidade_id: 1, nome_unidade: 'Unidade 1' }]);

      const result = await service.getAvailableContexts({ tipo_usuario: 'Administrador' });

      expect(result.regionais).toHaveLength(1);
      expect(result.unidades).toHaveLength(1);
    });

    it('deve retornar regionais e unidades para CPS', async () => {
      mockPrisma.pessoa.findMany.mockResolvedValue([]);
      mockPrisma.unidade.findMany.mockResolvedValue([]);

      const result = await service.getAvailableContexts({ tipo_usuario: 'CPS' });

      expect(result).toHaveProperty('regionais');
      expect(result).toHaveProperty('unidades');
    });

    it('deve retornar unidades vinculadas para Regional', async () => {
      mockPrisma.pessoaUnidade.findMany.mockResolvedValue([
        { unidade: { unidade_id: 1, nome_unidade: 'U1' } },
      ]);

      const result = await service.getAvailableContexts({
        tipo_usuario: 'Regional',
        pessoa_id: 5,
        nome: 'Regional User',
      });

      expect(result.unidades).toHaveLength(1);
    });

    it('deve lançar UnauthorizedException se usuário Diretor não encontrado', async () => {
      mockPrisma.pessoa.findUnique.mockResolvedValue(null);

      await expect(
        service.getAvailableContexts({ tipo_usuario: 'Diretor', pessoa_id: 99 }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('selectContext', () => {
    it('deve retornar tokens para Administrador selecionando unidade válida', async () => {
      mockPrisma.unidade.findFirst.mockResolvedValue({ unidade_id: 1 });

      const result = await service.selectContext(
        { tipo_usuario: 'Administrador', email: 'a@a.com', pessoa_id: 'uuid-1', nome: 'A' },
        'unidade',
        'uuid-1',
      );

      expect(result.access_token).toBeDefined();
    });

    it('deve lançar BadRequestException para unidade inválida (Administrador)', async () => {
      mockPrisma.unidade.findFirst.mockResolvedValue(null);

      await expect(
        service.selectContext({ tipo_usuario: 'Administrador' }, 'unidade', 'uuid-999'),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException para regional inválida (Administrador)', async () => {
      mockPrisma.pessoa.findFirst.mockResolvedValue(null);

      await expect(
        service.selectContext({ tipo_usuario: 'Administrador' }, 'regional', 'uuid-999'),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException se Diretor não tem vínculo com unidade', async () => {
      mockPrisma.pessoaUnidade.findFirst.mockResolvedValue(null);

      await expect(
        service.selectContext({ tipo_usuario: 'Diretor', pessoa_id: 'uuid-1' }, 'unidade', 'uuid-5'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
