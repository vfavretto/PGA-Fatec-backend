import { ListUsersService } from './list-users.service';

const mockRepo = { findAll: jest.fn() };

describe('ListUsersService', () => {
  let service: ListUsersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ListUsersService(mockRepo as any);
  });

  it('deve retornar lista de usuários', async () => {
    const users = [{ pessoa_id: 1 }, { pessoa_id: 2 }];
    mockRepo.findAll.mockResolvedValue(users);

    const result = await service.execute();
    expect(result).toEqual(users);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar array vazio quando não há usuários', async () => {
    mockRepo.findAll.mockResolvedValue([]);

    const result = await service.execute();
    expect(result).toEqual([]);
  });
});
