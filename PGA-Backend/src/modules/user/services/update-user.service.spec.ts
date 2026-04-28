import { UpdateUserService } from './update-user.service';

const mockRepo = { update: jest.fn() };

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UpdateUserService(mockRepo as any);
  });

  it('deve atualizar e retornar o usuário', async () => {
    const updated = { pessoa_id: 1, nome: 'Novo Nome' };
    mockRepo.update.mockResolvedValue(updated);

    const result = await service.execute(1, { nome: 'Novo Nome' });

    expect(mockRepo.update).toHaveBeenCalledWith(1, { nome: 'Novo Nome' });
    expect(result).toBe(updated);
  });
});
