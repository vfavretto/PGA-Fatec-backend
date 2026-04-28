import { UpdateUserService } from './update-user.service';

const mockRepo = { update: jest.fn() };

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateUserService(mockRepo as any);
  });

  it('deve atualizar e retornar o usuário', async () => {
    const id = 'cc000000-0000-4000-a000-000000000001';
    const updated = { pessoa_id: id, nome: 'Novo Nome' };
    mockRepo.update.mockResolvedValue(updated);

    const result = await service.execute(id, { nome: 'Novo Nome' });

    expect(mockRepo.update).toHaveBeenCalledWith(id, { nome: 'Novo Nome' });
    expect(result).toBe(updated);
  });
});
