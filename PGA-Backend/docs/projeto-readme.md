# Documentação Suplementar - Sistema PGA FATEC

## O que é este projeto?
Este é um projeto universitário de desenvolvimento web usando React + NestJS.
O sistema visa otimizar o planejamento, validação, gestão financeira (anexos) e controle de carga horária (HAE) das Fatecs ligadas ao Centro Paula Souza (CPS).

## Stack Tecnológico do Projeto
- **Frontend**: React 18 com TypeScript, TailwindCSS para estilização, e React Router para controle de rotas.
- **Backend**: NestJS v11 com TypeScript, PostgreSQL para banco de dados relacional e Prisma como ORM (Object-Relational Mapping).
- **Autenticação**: JWT (JSON Web Tokens) armazenados em cookies seguros HTTPOnly (`access_token` e `refresh_token`).
- **Geração de Arquivos**: Relatórios gerados em PDF (via Puppeteer) e exportação em CSV para análises e balanços regionais.

## Arquitetura de Módulos (Backend)
O backend segue uma arquitetura puramente modular e limpa:
- `src/modules/auth/`: Módulo de login, refresh token, e gerenciamento de contextos (Unidades ou Regionais).
- `src/modules/user/`: Gerenciamento de cadastro de diretores, coordenadores e analistas.
- `src/modules/pga/`: Entidade central que gerencia o status geral do Plano de Gestão Anual por ano e Fatec.
- `src/modules/project1/`: Cadastro de ações, metas, orçamentos, etapas e vínculos de anexos de compras.
- `src/modules/attachment/`: Controle de uploads e salvamento de anexos.
- `src/modules/workloadHAE/`: Gerenciamento de atribuição de horas docentes (CC, ADM, EXT, TUT, PEQ).
- `src/modules/institutionalRoutine/` e `src/modules/routineOccurrence/`: Controle de reuniões e atas colegiadas (CPA, NDE, CEPE).
- `src/modules/audit/`: Sistema interno de auditoria que grava o log de todas as modificações nas rotas (via `AuditInterceptor`).

## Como rodar localmente?
1. Garanta que possui o Node.js v18 ou superior instalado.
2. Certifique-se de que a base PostgreSQL está ativa localmente ou via Docker.
3. Crie e configure o arquivo `.env` na raiz da pasta `PGA-Backend` baseado no `.env.example`.
4. Instale as dependências executando:
   ```bash
   npm install
   ```
5. Execute as migrações do banco de dados com:
   ```bash
   npx prisma migrate dev
   ```
6. Inicialize a carga de dados iniciais do sistema (seed):
   ```bash
   npm run seed
   ```
7. Inicialize o servidor de desenvolvimento:
   ```bash
   npm run start:dev
   ```
8. O backend estará acessível em http://localhost:3000 e a documentação interativa Swagger em http://localhost:3000/api.

## Variáveis de Ambiente Críticas
- `DATABASE_URL`: String de conexão com o banco de dados PostgreSQL.
- `JWT_SECRET`: Segredo de criptografia para assinar os tokens JWT.
- `NVIDIA_API_KEY`: Chave necessária para autenticar e consumir as LLMs do NVIDIA Build (formato: `nvapi-...`).

## Dúvidas e Problemas Frequentes
**P: Recebo um erro de banco ao tentar rodar `npm run start:dev` pela primeira vez.**
R: Garanta que o serviço do PostgreSQL está ativo na sua máquina e que a `DATABASE_URL` no seu `.env` está correta. Certifique-se de ter rodado `npx prisma migrate dev` e `npm run seed` para inicializar a estrutura física e os dados essenciais (Eixos, Unidades, Regionais).

**P: Como faço para testar as rotas protegidas sem usar o frontend?**
R: A documentação do Swagger em `http://localhost:3000/api` permite autenticação. Alternativamente, os arquivos de requisição no formato REST Client (`requests.rest`) na raiz do projeto fornecem testes prontos para uso com extensões de editores (como REST Client do VS Code).
