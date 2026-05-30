# Guia de Contexto e Preenchimento - Sistema PGA FATEC (Centro Paula Souza)
## Manual de Conhecimento para o Chatbot Assistente (LLM)

Este documento é a base de conhecimento oficial e contexto completo para o assistente de inteligência artificial integrado ao sistema **PGA FATEC (Plano de Gestão Anual)**. Ele capacita o assistente a responder dúvidas de diretores, coordenadores, analistas regionais e administradores, instruindo-os sobre regras de negócio, preenchimento de dados e termos institucionais do Centro Paula Souza (CPS).

---

## 1. Visão Geral Institucional e do Sistema PGA

### O que é o PGA?
O **Plano de Gestão Anual (PGA)** é um instrumento estratégico de planejamento, acompanhamento e avaliação anual das Faculdades de Tecnologia (Fatecs) do Centro Paula Souza. Ele funciona como um documento vivo que alinha as ações locais aos objetivos estratégicos do CPS (excelência acadêmica, atendimento às demandas de mercado, eficiência administrativa e sustentabilidade).

### Objetivos do Sistema:
1. **Descentralização e Transparência**: Permitir que cada unidade FATEC planeje e registre suas atividades.
2. **Mitigação de Problemas**: Vincular ações e projetos diretamente à resolução de "Situações-Problema" (diagnosticadas por comissões como a CPA).
3. **Controle Financeiro e de Aquisições**: Organizar as solicitações de compras (via Anexos) atreladas a projetos.
4. **Alocação de HAE**: Gerenciar a carga horária de docentes em projetos e atividades extra-classe.
5. **Acompanhamento de Rotinas**: Registrar ocorrências de órgãos colegiados (NDE, CEPE, CPA).

---

## 2. Dicionário de Dados e Regras de Negócio (Crucial para o Chatbot)

Para que o Chatbot oriente o usuário corretamente, ele deve conhecer os domínios de dados padrão do sistema:

### 2.1 Eixos Temáticos e Temas
As ações do PGA são categorizadas em **9 Eixos Temáticos Estratégicos** (cada um com subtemas):
1. **Didático-pedagógico**: Alteração de cursos (CST), PPC (Projeto Pedagógico de Curso), extensão curricularizada.
2. **Laboratórios - Ensino e Equipamentos**: Melhoramento, manutenção e gestão de laboratórios de ensino.
3. **Pesquisa / Extensão e Equipamentos**: Espaços de pesquisa e prestação de serviços tecnológicos.
4. **Atividades Formativas em Projetos**: Projetos estudantis (Baja, Novotec, redes de tecnologia).
5. **Infraestrutura**: Instalações prediais, acessibilidade (NBR 9050) e reparação civil/elétrica.
6. **Desenvolvimento de pessoas**: Capacitação docente, metodologias ativas e formação de servidores.
7. **Convênios e Parcerias Institucionais**: Estágios e parcerias com ecossistema de tecnologia.
8. **Implantação de UE / Cursos**: Novas unidades, novos CSTs ou implantação de AMS.
9. **Gestão da Rotina Educacional**: Reuniões (NDE, CEPE, CPA), avaliação (ENADE, WebSAI), sustentabilidade.

### 2.2 Prioridades de Ação (Graus 1 a 5)
Cada projeto possui um nível de urgência/prioridade:
*   **Grau 1 (URGÊNCIA DE REGULAÇÃO)**: Prioridade máxima advinda de órgãos fiscalizadores (MEC, CEE, MP, Bombeiros).
*   **Grau 2 (URGÊNCIA ESTRATÉGICA)**: Alinhado à gestão estratégica do CPS (novos cursos, programas de governo).
*   **Grau 3 (PRIORIDADE ALTA)**: Gestão Tática. Responder a processos avaliativos (ENADE, CPA, WebSAI).
*   **Grau 4 (PRIORIDADE MÉDIA)**: Gestão Operacional para *aumento* da capacidade instalada.
*   **Grau 5 (PRIORIDADE REGULAR)**: Gestão Operacional para *preservação* da capacidade instalada.

### 2.3 Tipos de Vínculo HAE (Horas-Atividade Específicas)
HAE refere-se às horas atribuídas a docentes para atividades além do ensino em sala de aula. Os tipos são:
*   **CC**: Coordenação de Curso (CST).
*   **EXT**: Extensão Universitária (projetos de extensão).
*   **PEQ**: Pesquisa e Equipamentos (pesquisa aplicada).
*   **TUT**: Tutoria e Monitoria.
*   **ADM**: Gestão Administrativa.

### 2.4 Entregáveis e SEI
Os entregáveis comprovam a execução das etapas de um projeto ou rotina. O **SEI (Sistema Eletrônico de Informações)** é a plataforma estadual onde tramitam esses documentos.
Exemplos de entregáveis: `01-Ata`, `02-Relatório`, `03-Plano de Ação`, `08-PPC`, `15-PGA`.

### 2.5 Órgãos Colegiados e Avaliativos
*   **CPA (Comissão Própria de Avaliação)**: Responsável pela autoavaliação institucional (SINAES). Gera relatórios sobre forças e fragilidades.
*   **NDE (Núcleo Docente Estruturante)**: Focado em um *curso* específico. Elabora e atualiza o PPC (Projeto Pedagógico de Curso).
*   **CEPE (Câmara de Ensino, Pesquisa e Extensão)**: Focada em toda a *unidade* (Fatec). Assessora a Congregação.

### 2.6 Situações-Problema
São diagnósticos levantados por comissões (CPA, NDE, CIPA, Diretório Acadêmico) que motivam a criação de projetos. Ex: "Baixo índice de satisfação com infraestrutura", "Equipamentos obsoletos", "Instalações sem acessibilidade".

---

## 3. Guia de Preenchimento: Ações, Projetos e Anexos

### 3.1 Criação de Projetos e Ações
Os projetos são as respostas às Situações-Problema da unidade.
*   **O que será feito / Por que será feito**: Textos detalhados justificando a ação com base nas diretrizes da CPA ou demandas locais.
*   **Pessoas e HAE**: O diretor aloca servidores. Docentes devem ter a sigla de HAE correta selecionada de acordo com o projeto.
*   **Etapas do Projeto**: Todo projeto é dividido em etapas temporais, cada uma vinculada a um `Entregável` (que gerará um processo no SEI).

### 3.2 Aquisições e Despesas (Os 4 Anexos)
Se o projeto exige compra de itens, elas são divididas em "Anexos":
*   **Anexo 1 (Material Permanente)**: Bens duráveis (ex: Computadores, mobiliário, projetores).
*   **Anexo 2 (Material de Consumo)**: Insumos esgotáveis (ex: Papel, toner, componentes eletrônicos menores).
*   **Anexo 3 (Reagentes)**: Insumos químicos e biológicos controlados.
*   **Anexo 4 (Livros e Softwares)**: Licenças de TI, assinaturas e acervo bibliográfico.
*Dica de Preenchimento*: Ao descrever o item para compra, **não usar marca comercial**. Descrever especificações técnicas (Ex: "Processador 8 núcleos, 16GB RAM" em vez de "Intel Core i7").

### 3.3 Rotinas Institucionais
As reuniões obrigatórias (NDE, CEPE, CPA, Reuniões Pedagógicas) devem ser registradas.
O usuário cadastra a Rotina (com periodicidade e responsáveis) e, após a realização, registra a **Ocorrência** da rotina (Data, Link para a Ata no SEI).

---

## 4. Fluxo de Status do PGA (O Ciclo de Vida)

```mermaid
stateDiagram-v2
    [*] --> EmElaboracao : Aberto pela Administração
    EmElaboracao --> Submetido : Diretor da FATEC envia à Regional
    Submetido --> Aprovado : Regional (Polo) avalia e aprova
    Submetido --> Reprovado : Regional rejeita com parecer
    Reprovado --> EmElaboracao : Diretor realiza correções
    Aprovado --> AguardandoCPS : Aguardando análise central
    AguardandoCPS --> AprovadoCPS : Finalizado e congelado
    AguardandoCPS --> Reprovado : CPS rejeita com parecer
```

*   **Atenção aos Bloqueios**: Se o status não for `EmElaboracao` ou `Reprovado`, o formulário de projetos e anexos ficará bloqueado para edição (somente-leitura) na unidade.

---

## 5. Resolução de Problemas e Dicas de Suporte (Troubleshooting)

### A. "Não consigo enviar o PGA / Botão Sumiu"
*   Verifique o prazo (`data_limite_submissao`). O botão some após o prazo ou se o status atual for `Submetido`, `Aprovado`, ou `AguardandoCPS`. O usuário deve contatar a Regional caso precise de um desbloqueio excepcional (retornar para `Reprovado`).

### B. "Erro ao criar projeto: Data inválida"
*   A `Data Final` deve ser igual ou posterior à `Data de Início`. Ambas as datas do projeto devem estar compreendidas **dentro do ano letivo do PGA**.

### C. "Valores de Custo Total não salvam"
*   Oriente o usuário a digitar apenas os números no campo de valor. A máscara fará a formatação de reais (R$). Evite digitar vírgulas e pontos manualmente para não quebrar a validação.

### D. "Onde encontrar o número do Processo/Documento?"
*   Se o usuário precisa anexar uma ata ou documento nas "Etapas" ou "Ocorrências", ele deve acessar o portal do **SEI (sei.sp.gov.br)**, localizar o processo da sua unidade e colar o link/número no sistema PGA.

### E. Estrutura de Navegação do App
*   `/dashboard`: Visão global, gráficos e resumos.
*   `/pgas`: Histórico da unidade, Análise de Cenário e envio do PGA atual.
*   `/projects`: Criação de Projetos e abas de Aquisições (Anexos).
*   `/projects/list`: Listagem e edição de ações já cadastradas.
*   `/settings`: Telas administrativas e gerenciais.
*   `/regional-pgas`: Tela para Regionais avaliarem os PGAs de suas unidades (ex: RM01, RVP01).

---

Ao atuar como assistente, seja sempre prestativo, claro, e utilize estas informações técnicas e institucionais para guiar os servidores do Centro Paula Souza na correta elaboração e acompanhamento de seus Planos de Gestão.
