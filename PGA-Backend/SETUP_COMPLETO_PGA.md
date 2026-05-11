# Documentação Completa: Configuração e Execução do Sistema PGA FATEC

Este documento fornece instruções detalhadas, passo a passo, para configurar, executar e utilizar o sistema PGA FATEC localmente. Siga rigorosamente cada etapa para garantir o funcionamento completo da aplicação.

---

## 1. Requisitos do Sistema e Downloads Necessários

Antes de iniciar, certifique-se de ter os seguintes programas instalados em sua máquina:

1. **Node.js**: É o ambiente de execução para o JavaScript (tanto para o Backend quanto para o Frontend).
   - **Download**: [Baixar Node.js](https://nodejs.org/) (Recomenda-se a versão LTS mais recente, ex: v18 ou v20).
2. **Docker e Docker Compose**: Necessário para rodar o banco de dados PostgreSQL de forma conteinerizada (e opcionalmente o backend e frontend completos).
   - **Download**: [Baixar Docker Desktop](https://www.docker.com/products/docker-desktop). (No Windows, certifique-se de configurar o WSL2).
3. **Git**: Para controle de versão e clonagem dos repositórios.
   - **Download**: [Baixar Git](https://git-scm.com/downloads).
4. **Editor de Código**: Recomendamos fortemente o VS Code ou o Antigravity.
   - **Download**: [Baixar Visual Studio Code](https://code.visualstudio.com/).

---

## 2. Modos de Execução

O sistema PGA pode ser executado de **duas formas**. Escolha a que melhor se adapta ao seu cenário:

| Modo | Descrição | Quando usar |
|---|---|---|
| **A – Desenvolvimento Local** | Apenas o banco de dados roda no Docker. Backend e Frontend rodam localmente com `npm run start:dev` / `npm run dev`. | Desenvolvimento ativo, debug, hot-reload. |
| **B – Docker Completo** | Tudo roda em containers Docker (banco, API e frontend). | Testes de integração, simulação de produção, demonstrações. |

> **Seção 3** cobre o **Modo A** (recomendado para desenvolvimento).
> **Seção 5** cobre o **Modo B** (Docker completo).

---

## 3. Configuração e Inicialização do Backend (Modo A – Dev Local)

O backend é construído em Node.js com NestJS e utiliza Prisma como ORM com um banco de dados PostgreSQL.

### Passo 3.1: Acessando a pasta do Backend
Abra o seu terminal (CMD, PowerShell ou o terminal do VS Code) e navegue até a pasta do projeto backend:
```bash
cd caminho/para/seu/PGA-Fatec-backend/PGA-Backend
```

### Passo 3.2: Configurando as Variáveis de Ambiente
O projeto necessita de credenciais e rotas para funcionar.
1. Na pasta `PGA-Backend`, localize o arquivo `.env.example`.
2. Faça uma cópia deste arquivo e renomeie a cópia para `.env` (exatamente assim, sem nome antes do ponto).
3. Abra o arquivo `.env` gerado e preencha as variáveis de acordo (ou mantenha os valores padrão para ambiente local):

```env
# Banco de dados
POSTGRES_USER="usuario_postgres"
POSTGRES_PASSWORD="senha_postgres"
POSTGRES_DB="seu_banco_de_dados"
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

# JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Configurações do servidor
PORT="3000"
FRONTEND_URL="http://localhost:5173"

# Configurações do email
EMAIL_USER="email_para_envio"
EMAIL_PASSWORD="senha_de_app_do_email"
```

> **⚠️ Atenção:** No `DATABASE_URL`, o host deve ser `localhost` para o Modo A (desenvolvimento local). Se for rodar tudo via Docker (Modo B), o host deve ser `postgres` (nome do serviço no `docker-compose.yml`).

### Passo 3.3: Subindo o Banco de Dados (Docker)
Com o Docker Desktop aberto na sua máquina, rode o seguinte comando no terminal (ainda dentro da pasta `PGA-Backend`):
```bash
npm run docker:up
```
*Isso é equivalente a `docker-compose up -d`. Irá baixar a imagem do PostgreSQL e iniciar o banco de dados em segundo plano (porta 5432).*

> **💡 Dica:** Você também pode usar `docker-compose up -d` diretamente, mas os atalhos `npm run docker:*` existem para padronizar o workflow da equipe.

### Passo 3.4: Instalando as Dependências
Agora, instale todos os pacotes necessários do projeto executando:
```bash
npm install
```
> **Nota:** O `npm install` já executa automaticamente o `prisma generate` ao final (via script `postinstall` configurado no `package.json`). Isso gera o Prisma Client para interagir com o banco de dados. Se por algum motivo o client não for gerado, rode manualmente: `npx prisma generate`.

### Passo 3.5: Executando as Migrations do Banco de Dados
Para criar as tabelas no banco de dados que acabou de ser iniciado, rode o Prisma Migrate:
```bash
npm run migrate
```
*Esse atalho executa `prisma migrate dev`. Se for solicitado um nome para a migration, você pode colocar "init".*

> Alternativa: você pode usar diretamente `npx prisma migrate dev`.

### Passo 3.6: Povoando o Banco de Dados (Seed) e Criando o Primeiro Usuário
O sistema vem com um script para popular o banco com dados iniciais (tipos de vínculo HAE, eixos temáticos, temas, prioridades de ação, situações-problema, entregáveis, regional, e os usuários de teste). Execute:
```bash
npm run seed
```
*Após rodar com sucesso, o primeiro usuário Administrador já estará disponível. Veja as credenciais na Seção 6.*

### Passo 3.7: Iniciando a Aplicação
Inicie o servidor do backend em modo de desenvolvimento (com hot-reload):
```bash
npm run start:dev
```
Se tudo ocorreu bem, o console mostrará que a aplicação Nest está rodando na porta `3000`.

> **📖 Documentação da API (Swagger):** Acesse `http://localhost:3000/api` no navegador para visualizar e testar todos os endpoints disponíveis da API via Swagger UI.

---

## 4. Configuração e Inicialização do Frontend (Modo A – Dev Local)

O frontend é desenvolvido em React usando Vite e TypeScript.

### Passo 4.1: Acessando a pasta do Frontend
Abra **uma nova aba ou janela** no terminal (deixe o backend rodando na primeira janela) e navegue até a pasta do projeto frontend:
```bash
cd caminho/para/seu/PGA-Fatec-Frontend/PGA-PI
```

### Passo 4.2: Configurando as Variáveis de Ambiente
1. Localize o arquivo `.example-env`.
2. Copie-o e renomeie para `.env`.
3. Abra o arquivo e ajuste a URL da API para apontar para o seu backend local:
```env
VITE_API_URL="http://localhost:3000"
```

### Passo 4.3: Instalando as Dependências
Execute o comando para baixar todos os pacotes do React/Vite:
```bash
npm install
```

### Passo 4.4: Iniciando a Aplicação
Rode o frontend em modo de desenvolvimento:
```bash
npm run dev
```
O console deverá mostrar que o projeto está rodando (geralmente na porta `http://localhost:5173/`). Você pode clicar no link que aparecer no terminal para abrir o navegador.

---

## 5. Execução via Docker Completo (Modo B)

Se preferir rodar **todo** o sistema em containers Docker (banco + API + frontend), siga os passos abaixo.

### 5.1: Subindo o Backend completo via Docker

Dentro da pasta `PGA-Backend`:

1. **Certifique-se de que o `.env` existe** (veja Passo 3.2).
   - **Importante:** No `.env`, o `DATABASE_URL` deve usar o host `postgres` (nome do serviço Docker), **não** `localhost`:
   ```env
   DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"
   ```

2. **Construa as imagens Docker** (banco + API):
   ```bash
   npm run docker:build
   ```
   *Isso executa `docker-compose build --no-cache`, construindo a imagem do backend (NestJS) definida no `Dockerfile`. O build inclui: instalação de dependências, geração do Prisma Client, e compilação da aplicação.*

3. **Suba os containers:**
   ```bash
   npm run docker:up
   ```
   *Isso executa `docker-compose up -d`. Sobe tanto o banco PostgreSQL quanto a API NestJS. A API aguarda o banco ficar saudável (healthcheck) antes de iniciar.*

4. **Verifique se tudo subiu corretamente:**
   ```bash
   npm run docker:logs
   ```
   *Isso executa `docker-compose logs -f` e mostra os logs em tempo real de todos os containers. Pressione `Ctrl+C` para sair.*

5. **(Opcional) Rodar migrations dentro do container Docker:**
   ```bash
   npm run prisma:migrate:docker
   ```
   *Isso executa `docker-compose exec api npx prisma migrate deploy` dentro do container da API.*

   > **Nota:** O `Dockerfile` do backend já está configurado para rodar `npx prisma migrate deploy` automaticamente quando o container inicia (via `CMD`). Então normalmente não é necessário rodar esse comando manualmente.

6. **Para parar os containers:**
   ```bash
   npm run docker:down
   ```

### 5.2: Subindo o Frontend via Docker

Dentro da pasta `PGA-Fatec-Frontend/PGA-PI`:

1. **Construa a imagem do frontend:**
   ```bash
   npm run docker:build
   ```
   *Isso executa `docker build` passando a `VITE_API_URL` como argumento de build. A imagem é construída em multi-stage: primeiro compila o React com Vite, depois serve os arquivos estáticos via Nginx.*

   > **Para desenvolvimento local** (API em `localhost:3000`), use o atalho específico:
   > ```bash
   > npm run docker:build:dev
   > ```
   > *Equivalente a `VITE_API_URL=http://localhost:3000 npm run docker:build`.*

2. **Suba o container do frontend:**
   ```bash
   npm run docker:run
   ```
   *Isso cria e inicia o container `pga-frontend-container` na porta 80.*

   **Alternativa usando Docker Compose:**
   ```bash
   npm run docker:compose:up
   ```
   *Isso sobe o frontend via `docker-compose up -d` usando o `docker-compose.yml` do frontend, que conecta à mesma rede `pga-network` do backend.*

3. **Para parar e remover o container:**
   ```bash
   npm run docker:clean
   ```
   *Isso executa `docker:stop` seguido de `docker:remove`.*

4. **Para reiniciar rapidamente (parar + remover + subir novamente):**
   ```bash
   npm run docker:restart
   ```

---

## 6. Primeiro Acesso e Utilização do Sistema

Com o **Backend (porta 3000)** e o **Frontend (porta 5173 no Modo A, ou porta 80 no Modo B)** rodando simultaneamente, você já pode acessar e utilizar o sistema.

1. Abra seu navegador web e acesse o endereço do frontend:
   - **Modo A (dev):** `http://localhost:5173`
   - **Modo B (Docker):** `http://localhost`
2. A tela de login do PGA FATEC será exibida.

### Credenciais do Administrador (Usuário Root)
O comando `npm run seed` executado anteriormente cria por padrão usuários essenciais no banco de dados. Utilize a conta abaixo para o seu primeiro login com privilégios totais (Administrador):

- **E-mail:** `admin@cps.sp.gov.br`
- **Senha:** `Senha@123`

### Outros Usuários de Teste Disponíveis
O banco também cria outros níveis de usuários que você pode utilizar para simular acessos e permissões diferentes:
- **Regional:** `regional.rm01@cps.sp.gov.br` / Senha: `Senha@123`
- **Diretor:** `diretor@fatec-sbc.sp.gov.br` / Senha: `Senha@123`
- **Coordenador:** `coord.ads@fatec-sbc.sp.gov.br` / Senha: `Senha@123`
- **Docente:** `marcio.silva@fatec-sbc.sp.gov.br` / Senha: `Senha@123`

### Próximos Passos no Uso
1. Acesse com o perfil de administrador.
2. Navegue até os cadastros bases e visualize que os eixos temáticos e prioridades já estão carregados (por conta do script de seed).
3. Comece a criar projetos e anexos do PGA e a visualizar o funcionamento completo e de ponta a ponta da integração.

---

## 7. Referência Completa dos Scripts NPM

### Backend (`PGA-Backend/package.json`)

| Comando | O que faz |
|---|---|
| `npm run build` | Compila o projeto NestJS para produção (pasta `dist/`). |
| `npm run start` | Inicia o servidor sem hot-reload (modo simples). |
| `npm run start:dev` | Inicia o servidor com hot-reload (modo desenvolvimento). ⭐ **Mais usado.** |
| `npm run start:debug` | Inicia com hot-reload e debug (porta de inspeção do Node). |
| `npm run start:prod` | Inicia o servidor a partir do build de produção (`node dist/main`). |
| `npm run migrate` | Executa `prisma migrate dev` – cria/aplica migrations no banco local. |
| `npm run seed` | Roda o script de seed para popular o banco com dados iniciais. |
| `npm run lint` | Executa o ESLint com auto-fix em todo o código-fonte. |
| `npm run format` | Formata o código com Prettier (src e tests). |
| `npm run test` | Roda os testes unitários com Jest. |
| `npm run test:watch` | Roda testes em modo watch (re-executa ao salvar arquivos). |
| `npm run test:cov` | Roda testes e gera relatório de cobertura de código. |
| `npm run test:debug` | Roda testes com debugger do Node (inspect-brk). |
| `npm run test:e2e` | Roda testes end-to-end (configuração separada em `test/jest-e2e.json`). |
| `npm run docker:build` | Constrói as imagens Docker sem cache (`docker-compose build --no-cache`). |
| `npm run docker:up` | Sobe todos os containers em background (`docker-compose up -d`). |
| `npm run docker:down` | Para e remove todos os containers (`docker-compose down`). |
| `npm run docker:logs` | Exibe os logs em tempo real de todos os containers. |
| `npm run prisma:migrate:docker` | Executa migrations dentro do container da API já em execução. |

### Frontend (`PGA-PI/package.json`)

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o Vite dev server com hot-reload (porta 5173). ⭐ **Mais usado.** |
| `npm run build` | Compila o projeto React para produção (pasta `dist/`). |
| `npm run deploy` | Faz deploy do build para o GitHub Pages. |
| `npm run docker:build` | Constrói a imagem Docker do frontend (multi-stage: Vite build + Nginx). |
| `npm run docker:build:dev` | Constrói a imagem Docker apontando para `http://localhost:3000`. |
| `npm run docker:run` | Cria e roda o container do frontend na porta 80. |
| `npm run docker:stop` | Para o container do frontend. |
| `npm run docker:remove` | Remove o container parado do frontend. |
| `npm run docker:clean` | Para + Remove o container do frontend em um comando. |
| `npm run docker:restart` | Para + Remove + Sobe o container novamente (recriação rápida). |
| `npm run docker:compose:up` | Sobe o frontend via Docker Compose. |
| `npm run docker:compose:down` | Para o frontend via Docker Compose. |
| `npm run docker:compose:build` | Reconstrói a imagem via Docker Compose. |
| `npm run docker:compose:logs` | Exibe os logs do container do frontend. |

---

## 8. Troubleshooting / Resolução de Problemas

| Problema | Solução |
|---|---|
| **Erro de Conexão com o Banco** | Verifique se o Docker está rodando (`npm run docker:up`) e se a porta 5432 não está ocupada por outra instância do PostgreSQL. |
| **Frontend não encontra a API** | Tenha certeza de que o `VITE_API_URL` no `.env` do front está apontando exatamente para onde o NestJS abriu (geralmente `http://localhost:3000`) e sem aspas extras quebradas. |
| **Não encontra o comando "npx prisma"** | Execute `npm install` novamente. Se persistir, tente `npm i -g prisma`. |
| **Erro no `npm run docker:build`** | Certifique-se de que o Docker Desktop está aberto e rodando. Verifique se o `Dockerfile` e o `docker-compose.yml` existem na pasta. |
| **Porta 3000 já em uso** | Outra aplicação pode estar usando a porta. Pare o processo que a ocupa ou altere a variável `PORT` no `.env` do backend. |
| **Porta 80 já em uso (frontend Docker)** | No Windows, o IIS ou outro serviço pode ocupar a porta 80. Altere o mapeamento de portas no `docker-compose.yml` do frontend (ex: `'8080:80'`). |
| **Prisma Client desatualizado** | Se o schema do Prisma foi alterado, rode `npx prisma generate` para regenerar o client. |
| **Seed falha com erro de unique constraint** | O seed usa `upsert`, então é seguro rodar várias vezes. Se o erro persistir, verifique se o banco está acessível (`npm run docker:logs`). |
| **Container da API não inicia** | Verifique os logs com `npm run docker:logs`. Causas comuns: banco ainda inicializando (aguarde o healthcheck) ou `DATABASE_URL` com host errado (deve ser `postgres` no modo Docker). |
