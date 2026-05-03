import { GetUsersByUnitService } from './get-users-by-unit.service';

const mockRepo = { findByUnidadeId: jest.fn() };

describe('GetUsersByUnitService', () => {
  let service: GetUsersByUnitService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GetUsersByUnitService(mockRepo as any);
  });

  it('deve retornar usuários da unidade', async () => {
    const users = [{ pessoa_id: 1 }, { pessoa_id: 2 }];
    mockRepo.findByUnidadeId.mockResolvedValue(users);

    const result = await service.execute('10');

    expect(mockRepo.findByUnidadeId).toHaveBeenCalledWith('10');
    expect(result).toEqual(users);
  });

  it('deve retornar array vazio quando unidade não tem usuários', async () => {
    mockRepo.findByUnidadeId.mockResolvedValue([]);

    const result = await service.execute('999');
    expect(result).toEqual([]);
  });
});
