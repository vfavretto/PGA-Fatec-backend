# Changelog

## [Unreleased]

### 🚧 Em Desenvolvimento
- Novas funcionalidades sendo desenvolvidas

---

## [1.4.0] - 2025-01-05

### ✨ New Features

#### Enhanced Audit System
- **Audit Interceptor**: Implementação de interceptor global para auditoria automática de todas as operações CRUD
- **Configuration Snapshot Service**: Serviço para capturar snapshots de configurações por ano
- **Version Manager Service**: Sistema de gerenciamento de versões com filtros por ano
- **Enhanced Audit Reporting**: Relatórios detalhados de auditoria com suporte a filtros temporais

#### Performance Improvements
- **Global Audit Interceptor**: Interceptação automática e transparente de todas as operações
- **Optimized Database Queries**: Consultas otimizadas para relatórios de auditoria
- **Enhanced Error Handling**: Melhor tratamento de erros em operações de auditoria

### 🔧 Technical Improvements

#### API Enhancements
```
GET /audit/snapshot/:year - Capturar snapshot de configurações por ano
GET /audit/versions/:year - Obter versões por ano
POST /audit/log - Registrar logs de auditoria
GET /audit/summary - Relatório resumido de auditoria
GET /audit/changes - Relatório de mudanças
```

#### Service Architecture
- **Audit Log Service**: Serviço centralizado para logs de auditoria
- **Configuration Snapshot Service**: Captura automática de snapshots
- **Version Manager Service**: Gerenciamento avançado de versões

### 🔄 Infrastructure Changes
- **Global Interceptor Registration**: Interceptor de auditoria registrado globalmente no main.ts
- **Enhanced CORS Configuration**: Configuração aprimorada de CORS para frontend
- **Improved Swagger Documentation**: Documentação Swagger com tags organizadas e melhor UX

---

## [1.3.0] - 2024-12-22

### ✨ New Features

#### Enhanced Swagger Documentation
- **Improved Swagger UI**: Interface aprimorada com customizações visuais
- **Better API Organization**: Tags organizadas por funcionalidade (Auth, Users, Audit, PGA, Projects, Configuration, Academic)
- **Enhanced Documentation**: Descrições detalhadas para todos os endpoints
- **Custom Styling**: Interface personalizada com ícone da Fatec e melhor UX

#### Global Validation & Security
- **Enhanced Validation Pipes**: Validação global aprimorada com whitelist e transform
- **Improved CORS Configuration**: Configuração de CORS mais robusta para produção
- **Security Enhancements**: Melhor configuração de segurança para APIs

#### Module Integration Improvements
- **Complete Module Registry**: Todos os módulos devidamente registrados no AppModule
- **Consistent Service Architecture**: Arquitetura consistente entre todos os módulos
- **Enhanced Error Handling**: Tratamento de erros padronizado em toda a aplicação

### 🔧 Technical Improvements

#### Application Bootstrap
- **Enhanced Main Configuration**: Configuração principal aprimorada com interceptors globais
- **JWT Guard Integration**: Guard JWT configurado globalmente para proteção de rotas
- **Swagger Customization**: Personalização completa da documentação Swagger

#### Database & Migrations
- **Schema Consistency**: Consistência aprimorada no schema do Prisma
- **Migration Stability**: Migrações mais estáveis e confiáveis
- **Enhanced Relationships**: Relacionamentos entre entidades aprimorados

### 📋 API Documentation
- **Swagger UI Available**: Documentação interativa disponível em `/api`
- **Bearer Authentication**: Autenticação JWT configurada na documentação
- **Complete Endpoint Coverage**: Todos os endpoints documentados com exemplos

---

## [1.2.0] - 2024-12-18

### ✨ New Features

#### Access Management System
- **Request Access Module**: Sistema completo de solicitação de acesso para novos usuários
- **Access Approval Workflow**: Fluxo de aprovação/rejeição de solicitações de acesso
- **User-Unit Relationship**: Sistema de relacionamento entre usuários e unidades (PessoaUnidade)
- **Get Users by Unit**: Endpoint para obter usuários de uma unidade específica

#### Audit System 
- **Comprehensive Audit Module**: Sistema completo de auditoria com interceptor
- **Audit Interceptor**: Interceptação automática de operações CRUD para logging
- **Audit Logs**: Registro detalhado de todas as operações do sistema
- **Audit Reporting**: Sistema de relatórios de auditoria

#### Enhanced User Management
- **User Registration Improvements**: Melhorias no sistema de registro
- **Email Notifications**: Sistema de notificações por e-mail para aprovação de acesso
- **Enhanced Authentication**: Melhorias no sistema de autenticação e JWT

### 🔧 Technical Improvements

#### Database Enhancements
- **New Migration Files**: Migrações para sistema de auditoria e relacionamentos
- **PessoaUnidade Table**: Nova tabela para relacionamento usuário-unidade
- **Enhanced Schema**: Melhorias no schema do Prisma

#### API Enhancements
```
POST /user/request-access - Solicitar acesso ao sistema
GET /user/access-requests - Listar solicitações de acesso
POST /user/access-requests/:id/process - Processar solicitação
GET /user/unit/:id - Obter usuários por unidade
```

#### Service Architecture
- **Access Request Services**: Serviços completos para gerenciamento de acesso
- **Audit Services**: Serviços de auditoria com interceptação automática
- **Enhanced User Services**: Melhorias nos serviços de usuário

### 🔄 Database Changes
- **Audit System Tables**: Novas tabelas para sistema de auditoria
- **Access Request Tables**: Tabelas para gerenciamento de solicitações
- **User-Unit Relationships**: Relacionamentos aprimorados entre usuários e unidades

---

## [1.1.0] - 2024-12-15

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

## [1.0.0] - 2024-12-10

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

**⚠️ IMPORTANT**: Versões com mudanças incompatíveis (breaking changes) requerem teste completo antes do upgrade em produção.
