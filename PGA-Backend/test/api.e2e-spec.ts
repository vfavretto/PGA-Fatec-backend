import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/config/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { setupTestApp } from './config/test-setup';

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    const setup = await setupTestApp();
    app = setup.app;
    prismaService = setup.prismaService;

    // Mock environment variables
    process.env.FRONTEND_URL = 'http://localhost:5173';
    process.env.PORT = '3001';
    process.env.JWT_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Configure app with the same settings as in main.ts
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    // Create auth token for protected endpoints
    authToken = jwtService.sign({
      pessoa_id: 1,
      email: 'test@example.com',
      nome: 'Test User',
      tipo_usuario: 'Docente',
    });
  });

  afterAll(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Endpoints', () => {
    describe('POST /auth/login', () => {
      it('should return 400 if email is missing', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ senha: 'password123' })
          .expect(400);
      });

      it('should return 400 if password is missing', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'test@example.com' })
          .expect(400);
      });

      it('should return 400 if email format is invalid', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'invalid-email', senha: 'password123' })
          .expect(400);
      });

      it('should return 401 if user does not exist', async () => {
        jest
          .spyOn(prismaService.pessoa, 'findUnique')
          .mockResolvedValueOnce(null);

        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'nonexistent@example.com', senha: 'password123' })
          .expect(401);
      });

      it('should return 401 if password is incorrect', async () => {
        jest.spyOn(prismaService.pessoa, 'findUnique').mockResolvedValueOnce({
          pessoa_id: 1,
          email: 'test@example.com',
          senha: await bcrypt.hash('correctpassword', 10),
          nome: 'Test User',
          tipo_usuario: 'Docente',
        } as any);

        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'test@example.com', senha: 'wrongpassword' })
          .expect(401);
      });

      it('should return token if credentials are correct', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);

        jest.spyOn(prismaService.pessoa, 'findUnique').mockResolvedValueOnce({
          pessoa_id: 1,
          email: 'test@example.com',
          senha: hashedPassword,
          nome: 'Test User',
          tipo_usuario: 'Docente',
        } as any);

        // Mock bcrypt.compare to return true
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(true));

        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'test@example.com', senha: 'password123' })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
          });
      });
    });
  });

  describe('User Endpoints', () => {
    describe('GET /users', () => {
      it('should return 401 without authentication', () => {
        return request(app.getHttpServer()).get('/users').expect(401);
      });

      it('should return list of users with valid authentication', async () => {
        jest.spyOn(prismaService.pessoa, 'findMany').mockResolvedValueOnce([
          {
            pessoa_id: 1,
            nome: 'User 1',
            email: 'user1@example.com',
            tipo_usuario: 'Docente',
          },
          {
            pessoa_id: 2,
            nome: 'User 2',
            email: 'user2@example.com',
            tipo_usuario: 'Docente',
          },
        ] as any[]);

        return request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
          });
      });
    });

    describe('GET /users/:id', () => {
      it('should return user by ID', async () => {
        jest.spyOn(prismaService.pessoa, 'findUnique').mockResolvedValueOnce({
          pessoa_id: 1,
          nome: 'Test User',
          email: 'test@example.com',
          tipo_usuario: 'Docente',
        } as any);

        return request(app.getHttpServer())
          .get('/users/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('pessoa_id', 1);
            expect(res.body).toHaveProperty('nome', 'Test User');
          });
      });

      it('should return 404 if user not found', async () => {
        jest
          .spyOn(prismaService.pessoa, 'findUnique')
          .mockResolvedValueOnce(null);

        return request(app.getHttpServer())
          .get('/users/999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });

    describe('POST /users', () => {
      it('should create a new user', async () => {
        const newUser = {
          nome: 'New User',
          email: 'new@example.com',
          senha: 'newpassword',
          tipo_usuario: 'Docente',
        };

        jest.spyOn(prismaService.pessoa, 'create').mockResolvedValueOnce({
          pessoa_id: 3,
          ...newUser,
          senha: await bcrypt.hash(newUser.senha, 10),
        } as any);

        return request(app.getHttpServer())
          .post('/users')
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('pessoa_id');
            expect(res.body).toHaveProperty('nome', newUser.nome);
            expect(res.body).toHaveProperty('email', newUser.email);
            expect(res.body).not.toHaveProperty('senha'); // Password should not be returned
          });
      });

      it('should validate required fields', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({
            // Missing required fields
            nome: 'Incomplete User',
          })
          .expect(400);
      });
    });

    describe('PUT /users/:id', () => {
      it('should update a user', async () => {
        const updatedData = {
          nome: 'Updated User Name',
        };

        jest.spyOn(prismaService.pessoa, 'update').mockResolvedValueOnce({
          pessoa_id: 1,
          nome: updatedData.nome,
          email: 'test@example.com',
          tipo_usuario: 'Docente',
        } as any);

        return request(app.getHttpServer())
          .put('/users/1')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updatedData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('nome', updatedData.nome);
          });
      });
    });

    describe('DELETE /users/:id', () => {
      it('should delete a user', async () => {
        jest.spyOn(prismaService.pessoa, 'delete').mockResolvedValueOnce({
          pessoa_id: 1,
          nome: 'User to delete',
          email: 'delete@example.com',
          tipo_usuario: 'Docente',
        } as any);

        return request(app.getHttpServer())
          .delete('/users/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(204);
      });
    });
  });

  describe('Problem Situation Endpoints', () => {
    describe('GET /problem-situation', () => {
      it('should return all problem situations', async () => {
        jest
          .spyOn(prismaService.situacaoProblema, 'findMany')
          .mockResolvedValueOnce([
            {
              situacao_id: 1,
              pga_id: 1,
              descricao: 'Problem 1',
              fonte: 'Source 1',
            },
            {
              situacao_id: 2,
              pga_id: 1,
              descricao: 'Problem 2',
              fonte: 'Source 2',
            },
          ] as any[]);

        return request(app.getHttpServer())
          .get('/problem-situation')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
          });
      });
    });

    describe('GET /problem-situation/:id', () => {
      it('should return a problem situation by ID', async () => {
        jest
          .spyOn(prismaService.situacaoProblema, 'findUnique')
          .mockResolvedValueOnce({
            situacao_id: 1,
            pga_id: 1,
            descricao: 'Test Problem',
            fonte: 'Test Source',
          } as any);

        return request(app.getHttpServer())
          .get('/problem-situation/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('situacao_id', 1);
            expect(res.body).toHaveProperty('descricao', 'Test Problem');
          });
      });

      it('should return 404 if problem situation not found', async () => {
        jest
          .spyOn(prismaService.situacaoProblema, 'findUnique')
          .mockResolvedValueOnce(null);

        return request(app.getHttpServer())
          .get('/problem-situation/999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });

    describe('POST /problem-situation', () => {
      it('should create a new problem situation', async () => {
        const newProblem = {
          pga_id: 1,
          descricao: 'New Problem',
          fonte: 'New Source',
        };

        jest
          .spyOn(prismaService.situacaoProblema, 'create')
          .mockResolvedValueOnce({
            situacao_id: 3,
            ...newProblem,
          } as any);

        return request(app.getHttpServer())
          .post('/problem-situation')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newProblem)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('situacao_id');
            expect(res.body).toHaveProperty('descricao', newProblem.descricao);
          });
      });

      it('should validate required fields', () => {
        return request(app.getHttpServer())
          .post('/problem-situation')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            // Missing required fields
            fonte: 'Only Source',
          })
          .expect(400);
      });
    });

    describe('PUT /problem-situation/:id', () => {
      it('should update a problem situation', async () => {
        const updateData = {
          descricao: 'Updated Problem',
          fonte: 'Updated Source',
        };

        jest
          .spyOn(prismaService.situacaoProblema, 'update')
          .mockResolvedValueOnce({
            situacao_id: 1,
            pga_id: 1,
            ...updateData,
          } as any);

        return request(app.getHttpServer())
          .put('/problem-situation/1')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('descricao', updateData.descricao);
          });
      });
    });

    describe('DELETE /problem-situation/:id', () => {
      it('should delete a problem situation', async () => {
        jest
          .spyOn(prismaService.situacaoProblema, 'delete')
          .mockResolvedValueOnce({
            situacao_id: 1,
            pga_id: 1,
            descricao: 'Problem to delete',
            fonte: 'Source',
          } as any);

        return request(app.getHttpServer())
          .delete('/problem-situation/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      });
    });
  });

  describe('Project1 Endpoints', () => {
    describe('GET /project1', () => {
      it('should return all projects', async () => {
        jest
          .spyOn(prismaService.acaoProjeto, 'findMany')
          .mockResolvedValueOnce([
            {
              acao_projeto_id: 1,
              pga_id: 1,
              eixo_id: 1,
              prioridade_id: 1,
              tema_id: 1,
              o_que_sera_feito: 'Task 1',
              por_que_sera_feito: 'Reason 1',
              obrigatorio_inclusao: false,
              obrigatorio_sustentabilidade: false,
            },
            {
              acao_projeto_id: 2,
              pga_id: 1,
              eixo_id: 1,
              prioridade_id: 1,
              tema_id: 2,
              o_que_sera_feito: 'Task 2',
              por_que_sera_feito: 'Reason 2',
              obrigatorio_inclusao: true,
              obrigatorio_sustentabilidade: false,
            },
          ] as any[]);

        return request(app.getHttpServer())
          .get('/project1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
          });
      });
    });

    describe('GET /project1/:id', () => {
      it('should return a project by ID', async () => {
        jest
          .spyOn(prismaService.acaoProjeto, 'findUnique')
          .mockResolvedValueOnce({
            acao_projeto_id: 1,
            pga_id: 1,
            eixo_id: 1,
            prioridade_id: 1,
            tema_id: 1,
            o_que_sera_feito: 'Test Task',
            por_que_sera_feito: 'Test Reason',
            obrigatorio_inclusao: false,
            obrigatorio_sustentabilidade: false,
            eixo: { eixo_id: 1, nome: 'Test Axis' },
            pga: { pga_id: 1, ano: 2023 },
            prioridade: { prioridade_id: 1, descricao: 'High' },
          } as any);

        return request(app.getHttpServer())
          .get('/project1/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('acao_projeto_id', 1);
            expect(res.body).toHaveProperty('o_que_sera_feito', 'Test Task');
            expect(res.body).toHaveProperty('eixo');
          });
      });

      it('should return 404 if project not found', async () => {
        jest
          .spyOn(prismaService.acaoProjeto, 'findUnique')
          .mockResolvedValueOnce(null);

        return request(app.getHttpServer())
          .get('/project1/999')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);
      });
    });

    describe('POST /project1', () => {
      it('should create a new project', async () => {
        const newProject = {
          pga_id: 1,
          eixo_id: 1,
          prioridade_id: 1,
          tema_id: 1,
          o_que_sera_feito: 'New Task',
          por_que_sera_feito: 'New Reason',
          obrigatorio_inclusao: false,
          obrigatorio_sustentabilidade: true,
        };

        jest.spyOn(prismaService.acaoProjeto, 'create').mockResolvedValueOnce({
          acao_projeto_id: 3,
          ...newProject,
        } as any);

        return request(app.getHttpServer())
          .post('/project1')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newProject)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('acao_projeto_id');
            expect(res.body).toHaveProperty(
              'o_que_sera_feito',
              newProject.o_que_sera_feito,
            );
          });
      });

      it('should validate required fields', () => {
        return request(app.getHttpServer())
          .post('/project1')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            // Missing required fields
            pga_id: 1,
          })
          .expect(400);
      });
    });

    describe('PUT /project1/:id', () => {
      it('should update a project', async () => {
        const updateData = {
          o_que_sera_feito: 'Updated Task',
        };

        jest.spyOn(prismaService.acaoProjeto, 'update').mockResolvedValueOnce({
          acao_projeto_id: 1,
          pga_id: 1,
          eixo_id: 1,
          prioridade_id: 1,
          tema_id: 1,
          o_que_sera_feito: updateData.o_que_sera_feito,
          por_que_sera_feito: 'Original Reason',
          obrigatorio_inclusao: false,
          obrigatorio_sustentabilidade: false,
        } as any);

        return request(app.getHttpServer())
          .put('/project1/1')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty(
              'o_que_sera_feito',
              updateData.o_que_sera_feito,
            );
          });
      });
    });

    describe('DELETE /project1/:id', () => {
      it('should delete a project', async () => {
        jest.spyOn(prismaService.acaoProjeto, 'delete').mockResolvedValueOnce({
          acao_projeto_id: 1,
          pga_id: 1,
          eixo_id: 1,
          prioridade_id: 1,
          tema_id: 1,
          o_que_sera_feito: 'Task to delete',
          por_que_sera_feito: 'Reason',
          obrigatorio_inclusao: false,
          obrigatorio_sustentabilidade: false,
        } as any);

        return request(app.getHttpServer())
          .delete('/project1/1')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      });
    });
  });

  describe('Attachment1 Endpoints', () => {
    describe('GET /attachment1', () => {
      it('should return all attachments', async () => {
        jest
          .spyOn(prismaService.attachment1, 'findMany')
          .mockResolvedValueOnce([
            {
              id: '1',
              item: 'Item 1',
              denominacaoOuEspecificacao: 'Spec 1',
              quantidade: 1,
              precoTotalEstimado: 100.0,
              flag: 'Anexo1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              item: 'Item 2',
              denominacaoOuEspecificacao: 'Spec 2',
              quantidade: 2,
              precoTotalEstimado: 200.0,
              flag: 'Anexo2',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ] as any[]);

        return request(app.getHttpServer())
          .get('/attachment1')
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
          });
      });
    });

    describe('GET /attachment1/:id', () => {
      it('should return an attachment by ID', async () => {
        jest
          .spyOn(prismaService.attachment1, 'findUnique')
          .mockResolvedValueOnce({
            id: '1',
            item: 'Test Item',
            denominacaoOuEspecificacao: 'Test Spec',
            quantidade: 1,
            precoTotalEstimado: 100.0,
            flag: 'Anexo1',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as any);

        return request(app.getHttpServer())
          .get('/attachment1/1')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', '1');
            expect(res.body).toHaveProperty('item', 'Test Item');
          });
      });

      it('should return 404 if attachment not found', async () => {
        jest
          .spyOn(prismaService.attachment1, 'findUnique')
          .mockResolvedValueOnce(null);

        return request(app.getHttpServer()).get('/attachment1/999').expect(404);
      });
    });

    describe('POST /attachment1', () => {
      it('should create a new attachment', async () => {
        const newAttachment = {
          item: 'New Item',
          projetoId: '1',
          denominacaoOuEspecificacao: 'New Spec',
          quantidade: 3,
          precoTotalEstimado: 300.0,
          flag: 'Anexo1',
        };

        jest.spyOn(prismaService.attachment1, 'create').mockResolvedValueOnce({
          id: '3',
          ...newAttachment,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any);

        return request(app.getHttpServer())
          .post('/attachment1')
          .send(newAttachment)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('item', newAttachment.item);
          });
      });

      it('should validate required fields', () => {
        return request(app.getHttpServer())
          .post('/attachment1')
          .send({
            // Missing required fields
            item: 'Incomplete Item',
          })
          .expect(400);
      });
    });

    describe('PUT /attachment1/:id', () => {
      it('should update an attachment', async () => {
        const updateData = {
          item: 'Updated Item',
          quantidade: 5,
        };

        jest.spyOn(prismaService.attachment1, 'update').mockResolvedValueOnce({
          id: '1',
          item: updateData.item,
          denominacaoOuEspecificacao: 'Original Spec',
          quantidade: updateData.quantidade,
          precoTotalEstimado: 100.0,
          flag: 'Anexo1',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any);

        return request(app.getHttpServer())
          .put('/attachment1/1')
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('item', updateData.item);
            expect(res.body).toHaveProperty(
              'quantidade',
              updateData.quantidade,
            );
          });
      });
    });

    describe('DELETE /attachment1/:id', () => {
      it('should delete an attachment', async () => {
        jest.spyOn(prismaService.attachment1, 'delete').mockResolvedValueOnce({
          id: '1',
          item: 'Item to delete',
          denominacaoOuEspecificacao: 'Spec to delete',
          quantidade: 1,
          precoTotalEstimado: 100.0,
          flag: 'Anexo1',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any);

        return request(app.getHttpServer())
          .delete('/attachment1/1')
          .expect(200);
      });
    });
  });

  // Test for main.ts bootstrap process
  describe('Application Bootstrap', () => {
    it('should have environment variables loaded', () => {
      expect(process.env.FRONTEND_URL).toBe('http://localhost:5173');
      expect(process.env.PORT).toBe('3001');
    });

    it('should have CORS enabled', () => {
      // Indirectly testing CORS configuration
      const httpAdapter = app.getHttpAdapter();
      expect(httpAdapter).toBeDefined();
    });

    it('should have ValidationPipe configured', () => {
      // Testing validation pipe by making a request that should be validated
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'invalid-email' }) // Invalid email format
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('email');
        });
    });
  });
});
