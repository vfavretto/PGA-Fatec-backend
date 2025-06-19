# Changelog

## Integration Release v1.1.0

### ✨ New Features

#### New CRUD Modules Added
- **Course Module** (`/course`) - Gerenciamento completo de cursos com tipos (Tecnológico, AMS, Outro) e status
- **CPA Action Module** (`/cpa-action`) - Sistema de ações da Comissão Própria de Avaliação
- **Institutional Routine Module** (`/institutional-routine`) - Gestão de rotinas institucionais com periodicidade e status
- **PGA Module** (`/pga`) - Módulo principal para Plano de Gestão Acadêmica
- **Process Step Module** (`/process-step`) - Gerenciamento de etapas de processos com status de verificação
- **Project Person Module** (`/project-person`) - Sistema de associação de pessoas aos projetos
- **Routine Occurrence Module** (`/routine-occurrence`) - Gestão de ocorrências de rotinas
- **Routine Participant Module** (`/routine-participant`) - Sistema de participantes em rotinas
- **Unit Module** (`/unit`) - Gerenciamento de unidades organizacionais

#### Enhanced API Endpoints
```
POST|GET|PUT|DELETE /course
POST|GET|PUT|DELETE /cpa-action
POST|GET|PUT|DELETE /institutional-routine
POST|GET|PUT|DELETE /pga
POST|GET|PUT|DELETE /process-step
POST|GET|PUT|DELETE /project-person
POST|GET|PUT|DELETE /routine-occurrence
POST|GET|PUT|DELETE /routine-participant
POST|GET|PUT|DELETE /unit
```

#### Infrastructure and Integration
- **Enhanced Package Dependencies**: Atualização e melhoria das dependências do projeto
- **Module Integration**: Integração completa de todos os novos módulos no AppModule
- **Comprehensive DTOs**: DTOs robustos com validações para todos os novos módulos
- **Complete Entity Models**: Entidades completas mapeando o schema do banco de dados

### 🔧 Technical Improvements

#### New Entity Relationships
- Relacionamentos complexos entre PGA, Cursos, Rotinas e Projetos
- Sistema de status avançado para rotinas e ocorrências
- Tipagem forte para todos os enum values do Prisma

#### Enhanced Validation System
- Validações específicas para cada tipo de curso e status
- Validações de datas e periodicidade para rotinas
- Validações de relacionamentos entre entidades

#### Service Layer Architecture
- Padrão consistente de services para todos os módulos
- Separação clara entre repository, service e controller layers
- Error handling padronizado

### 📋 New Documentation
- **INTEGRATION_README.md**: Documentação detalhada da integração entre módulos
- Melhoria na documentação de APIs e endpoints

### 🚀 Performance & Maintainability
- Estrutura de projeto mais organizada e consistente
- Melhores práticas de NestJS implementadas
- Código mais limpo e manutenível

---

## Major Release v1.0.0

### 🔥 BREAKING CHANGES

#### API Structure Changes
- **Attachment1 Module**: Campo `projeto` substituído por `projetoId` nos DTOs
- **HAE Workload System**: Migração de enum `TipoVinculoHAE` para tabela relacional com ID
- **Database Schema**: Novos relacionamentos obrigatórios entre `EixoTematico`, `Tema` e `AcaoProjeto`
- **EntregavelLinkSei Model**: Atualizado com novos campos obrigatórios

### ✨ New Features

#### New CRUD Modules
- **Priority Action Module** (`/priority-action`) - Gerenciamento de prioridades de ação
- **Deliverable Module** (`/deliverable`) - Sistema de entregáveis com links SEI  
- **Workload HAE Module** (`/workload-hae`) - Gestão de tipos de vínculo HAE
- **Problem Situation Module** (`/problem-situation`) - Módulo de situações problema
- **Thematic Axis Module** (`/thematic-axis`) - Gerenciamento de eixos temáticos
- **Themes Module** (`/themes`) - Sistema de temas relacionados aos eixos
- **Project1 Module** (`/project1`) - CRUD completo para ações de projeto

#### Infrastructure Improvements
- **Docker Optimization**: Migração para `node:slim` como imagem base
- **Enhanced Docker Compose**: Configuração melhorada do PostgreSQL com health checks
- **Password Reset System**: Sistema completo de recuperação de senha com integração de e-mail

### 🔧 Technical Changes

#### Database Migrations
- Nova tabela `TipoVinculoHAE` substituindo enum
- Relacionamentos atualizados entre entidades principais
- Novos campos obrigatórios em múltiplas tabelas

#### API Endpoints Added
```
POST|GET|PUT|DELETE /priority-action
POST|GET|PUT|DELETE /deliverable  
POST|GET|PUT|DELETE /workload-hae
POST|GET|PUT|DELETE /problem-situation
POST|GET|PUT|DELETE /thematic-axis
POST|GET|PUT|DELETE /themes
POST|GET|PUT|DELETE /project1
```

#### Enhanced Validation
- Novos DTOs com validações robustas
- Campos obrigatórios adicionados para consistência de dados
- Melhoria nas mensagens de erro e validação

### 🚨 Migration Guide

Para desenvolvedores atualizando da v0.4.x:

1. **Execute migrações do banco de dados**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Atualize chamadas da API de Attachment1**:
   - Substitua campo `projeto` por `projetoId`
   - Adicione campo obrigatório `flag` do tipo `AnexoProjetoUm`

3. **Atualize referências a vínculos HAE**:
   - Migre de enum para IDs de tabela `TipoVinculoHAE`
   - Atualize relacionamentos em `ProjetoPessoa`

4. **Verifique novos relacionamentos obrigatórios**:
   - `AcaoProjeto` agora requer `tema_id`
   - `EtapaProcesso` agora requer `entregavel_id`

### 📋 Compatibility

- **Node.js**: >=18.0.0
- **PostgreSQL**: >=13.0
- **Docker**: >=20.10
- **Docker Compose**: >=2.0
