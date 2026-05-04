<br id="topo">
<div align="center">
  
![banner](https://github.com/julinhaarte/PGA-Mobile/blob/main/assets/images/PGA.png)

</div>

> Sistema de backend para o Plano de Gestão Acadêmica (PGA) da Fatec

## 📋 Documentação

- [📝 Changelog](./CHANGELOG.md) - Histórico de mudanças e versões
- [📖 API Documentation](https://pga-backend-latest.onrender.com/api) - Documentação Swagger da API

## 🚀 Como executar

### 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **PostgreSQL** >= 13.0 (se não usar Docker)

### 🏃‍♂️ Execução local com Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd PGA-Fatec-backend/PGA-Backend
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

3. **Inicie os serviços com Docker Compose**
   ```bash
   # Construir e iniciar todos os serviços
   npm run docker:up
   
   # Ou executar os comandos diretamente
   docker-compose up -d --build
   ```

4. **Execute as migrações do banco de dados**
   ```bash
   # Executar migrações no container
   npm run prisma:migrate:docker
   
   # Ou diretamente
   docker-compose exec api npx prisma migrate deploy
   ```

5. **Acesse a aplicação**
   - **API**: http://localhost:3000
   - **Documentação Swagger**: http://localhost:3000/api

### 🛠️ Execução local sem Docker

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd PGA-Fatec-backend/PGA-Backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Configure a DATABASE_URL para seu PostgreSQL local
   ```

4. **Configure o banco de dados**
   ```bash
   # Gerar o cliente Prisma
   npx prisma generate
   
   # Executar migrações
   npm run migrate
   # ou
   npx prisma migrate dev
   ```

5. **Inicie a aplicação**
   ```bash
   # Desenvolvimento
   npm run start:dev
   
   # Produção
   npm run build
   npm run start:prod
   ```

6. **Acesse a aplicação**
   - **API**: http://localhost:3000
   - **Documentação Swagger**: http://localhost:3000/api

## 🐳 Comandos Docker úteis

```bash
# Construir a imagem
npm run docker:build

# Iniciar serviços
npm run docker:up

# Parar serviços
npm run docker:down

# Ver logs
npm run docker:logs

# Executar migrações no container
npm run prisma:migrate:docker

# Acessar o container da API
docker-compose exec api bash

# Verificar status dos containers
docker-compose ps
```

## 🔧 Scripts disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Iniciar em modo desenvolvimento
npm run start:debug        # Iniciar em modo debug

# Build e produção
npm run build              # Construir a aplicação
npm run start:prod         # Iniciar em modo produção

# Banco de dados
npm run migrate            # Executar migrações
npx prisma studio          # Interface gráfica do banco

# Testes
npm run test               # Executar testes unitários
npm run test:e2e           # Executar testes end-to-end
npm run test:cov           # Executar testes com coverage

# Linting e formatação
npm run lint               # Executar linting
npm run format             # Formatar código
```

## 🌐 API em produção

- **URL da API**: https://pga-backend-latest.onrender.com
- **Documentação Swagger**: https://pga-backend-latest.onrender.com/api

## 📚 Tecnologias utilizadas

- **Framework**: NestJS
- **Banco de dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT
- **Documentação**: Swagger/OpenAPI
- **Containerização**: Docker & Docker Compose
- **Validação**: class-validator & class-transformer
