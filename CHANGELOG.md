# Changelog

## [Unreleased] - Major Release v1.0.0

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

---

**⚠️ IMPORTANT**: Esta é uma versão com mudanças incompatíveis (breaking changes). Teste completamente sua aplicação antes de fazer upgrade para produção. 