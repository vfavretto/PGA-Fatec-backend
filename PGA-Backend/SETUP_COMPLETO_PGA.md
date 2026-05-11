# Documentação Completa: Configuração e Execução do Sistema PGA FATEC

Este documento fornece instruções detalhadas, passo a passo, para configurar, executar e utilizar o sistema PGA FATEC localmente. Siga rigorosamente cada etapa para garantir o funcionamento completo da aplicação.

---

## 1. Requisitos do Sistema e Downloads Necessários

Antes de iniciar, certifique-se de ter os seguintes programas instalados em sua máquina:

1. **Node.js**: É o ambiente de execução para o JavaScript (tanto para o Backend quanto para o Frontend).
   - **Download**: [Baixar Node.js](https://nodejs.org/) (Recomenda-se a versão LTS mais recente, ex: v18 ou v20).
2. **Docker e Docker Compose**: Necessário para rodar o banco de dados PostgreSQL de forma conteinerizada.
   - **Download**: [Baixar Docker Desktop](https://www.docker.com/products/docker-desktop). (No Windows, certifique-se de configurar o WSL2).
3. **Git**: Para controle de versão e clonagem dos repositórios.
   - **Download**: [Baixar Git](https://git-scm.com/downloads).
4. **Editor de Código**: Recomendamos fortemente o VS Code ou o Antigravity.
   - **Download**: [Baixar Visual Studio Code](https://code.visualstudio.com/).

---

## 2. Configuração e Inicialização do Backend

O backend é construído em Node.js com NestJS e utiliza Prisma como ORM com um banco de dados PostgreSQL.

### Passo 2.1: Acessando a pasta do Backend
Abra o seu terminal (CMD, PowerShell ou o terminal do VS Code) e navegue até a pasta do projeto backend:
```bash
cd caminho/para/seu/PGA-Fatec-backend/PGA-Backend
```

### Passo 2.2: Configurando as Variáveis de Ambiente
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
*Atenção: No `DATABASE_URL`, se for rodar o Prisma localmente contra o Docker, mude o host de `postgres` para `localhost` conforme exemplo acima.*

### Passo 2.3: Subindo o Banco de Dados (Docker)
Com o Docker Desktop aberto na sua máquina, rode o seguinte comando no terminal (ainda dentro da pasta `PGA-Backend`):
```bash
docker-compose up -d
```
*Isso irá baixar a imagem do PostgreSQL e iniciar o banco de dados em segundo plano (porta 5432).*

### Passo 2.4: Instalando as Dependências
Agora, instale todos os pacotes necessários do projeto executando:
```bash
npm install
```

### Passo 2.5: Executando as Migrations do Banco de Dados
Para criar as tabelas no banco de dados que acabou de ser iniciado, rode o Prisma Migrate:
```bash
npx prisma migrate dev
```
*Se for solicitado um nome para a migration, você pode colocar "init".*

### Passo 2.6: Povoando o Banco de Dados (Seed) e Criando o Primeiro Usuário
O sistema vem com um script para popular o banco com dados iniciais (eixos, temas, e os usuários administradores). Execute:
```bash
npm run seed
```
*Após rodar com sucesso, o primeiro usuário Administrador já estará disponível. Guarde as credenciais que explicaremos na Seção 4.*

### Passo 2.7: Iniciando a Aplicação
Inicie o servidor do backend em modo de desenvolvimento:
```bash
npm run start:dev
```
Se tudo ocorreu bem, o console mostrará que a aplicação Nest está rodando na porta `3000`.

---

## 3. Configuração e Inicialização do Frontend

O frontend é desenvolvido em React usando Vite e TypeScript.

### Passo 3.1: Acessando a pasta do Frontend
Abra **uma nova aba ou janela** no terminal (deixe o backend rodando na primeira janela) e navegue até a pasta do projeto frontend:
```bash
cd caminho/para/seu/PGA-Fatec-Frontend/PGA-PI
```

### Passo 3.2: Configurando as Variáveis de Ambiente
1. Localize o arquivo `.example-env`.
2. Copie-o e renomeie para `.env`.
3. Abra o arquivo e ajuste a URL da API para apontar para o seu backend local:
```env
VITE_API_URL="http://localhost:3000"
```

### Passo 3.3: Instalando as Dependências
Execute o comando para baixar todos os pacotes do React/Vite:
```bash
npm install
```

### Passo 3.4: Iniciando a Aplicação
Rode o frontend em modo de desenvolvimento:
```bash
npm run dev
```
O console deverá mostrar que o projeto está rodando (geralmente na porta `http://localhost:5173/`). Você pode clicar no link que aparecer no terminal para abrir o navegador.

---

## 4. Primeiro Acesso e Utilização do Sistema

Com o **Backend (porta 3000)** e o **Frontend (porta 5173)** rodando simultaneamente, você já pode acessar e utilizar o sistema.

1. Abra seu navegador web e acesse o endereço do frontend (ex: `http://localhost:5173`).
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
**Troubleshooting / Resolução de Problemas**
- **Erro de Conexão com o Banco**: Verifique se o Docker está rodando e se a porta 5432 não está ocupada.
- **Frontend não encontra a API**: Tenha certeza de que o `VITE_API_URL` no `.env` do front está apontando exatamente para onde o NestJS backend abriu (geralmente `http://localhost:3000`) e sem aspas extras quebradas.
- **Não encontra o comando "npx prisma"**: Tente rodar `npm i -g prisma` caso tenha problemas na execução local.
