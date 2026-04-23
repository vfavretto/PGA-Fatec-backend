import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados PGA...');

  // ─── 1. Tipos de Vínculo HAE ────────────────────────────────────────────────
  const haeCC  = await prisma.tipoVinculoHAE.upsert({ where: { sigla: 'CC' },  update: {}, create: { sigla: 'CC',  descricao: 'Coordenação de Curso',          detalhes: 'HAE destinada ao coordenador do CST' } });
  const haeEXT = await prisma.tipoVinculoHAE.upsert({ where: { sigla: 'EXT' }, update: {}, create: { sigla: 'EXT', descricao: 'Extensão Universitária',          detalhes: 'HAE destinada a projetos de extensão curricularizada' } });
  const haePEQ = await prisma.tipoVinculoHAE.upsert({ where: { sigla: 'PEQ' }, update: {}, create: { sigla: 'PEQ', descricao: 'Pesquisa e Equipamentos',         detalhes: 'HAE destinada a atividades de pesquisa aplicada' } });
  const haeTUT = await prisma.tipoVinculoHAE.upsert({ where: { sigla: 'TUT' }, update: {}, create: { sigla: 'TUT', descricao: 'Tutoria e Monitoria',             detalhes: 'HAE destinada a atividades de tutoria e acompanhamento discente' } });
  const haeADM = await prisma.tipoVinculoHAE.upsert({ where: { sigla: 'ADM' }, update: {}, create: { sigla: 'ADM', descricao: 'Gestão Administrativa',           detalhes: 'HAE destinada a atividades de gestão e administração institucional' } });

  // ─── 2. Eixos Temáticos (9 eixos do template) ───────────────────────────────
  const eixo1 = await prisma.eixoTematico.upsert({ where: { numero: 1 }, update: {}, create: { numero: 1, nome_eixo: 'Didático-pedagógico', descricao: 'Ações associadas ao PPC/PE de CSTs e Disciplinas: CST (implantação, alteração, readequação, reestruturação), prática pedagógica (PE, PA), projeto interdisciplinar/integrador, extensão curricularizada.' } });
  const eixo2 = await prisma.eixoTematico.upsert({ where: { numero: 2 }, update: {}, create: { numero: 2, nome_eixo: 'Laboratórios - Ensino e Equipamentos Associados', descricao: 'Ações para melhoramento dos laboratórios de Ensino (Gestão e Equipamentos): Melhoramento de equipamentos, mediante instalação, manutenção, desuso, doação, e gestão de ambiente laboratorial.' } });
  const eixo3 = await prisma.eixoTematico.upsert({ where: { numero: 3 }, update: {}, create: { numero: 3, nome_eixo: 'Pesquisa / Extensão e Equipamentos Associados', descricao: 'Ações para melhoramento dos laboratórios que contemplam Pesquisa além do Ensino: melhoramento dos espaços de pesquisa, especificação equipamentos e aquisição por fomento ou por projeto com empresa.' } });
  const eixo4 = await prisma.eixoTematico.upsert({ where: { numero: 4 }, update: {}, create: { numero: 4, nome_eixo: 'Atividades Formativas em Projetos (nível tático)', descricao: 'Projetos institucionais formativos não especificados em PEs: Rede de tecnologia, Novotec, PCI, Projetos estudantis (Baja, Aero design, entre outros).' } });
  const eixo5 = await prisma.eixoTematico.upsert({ where: { numero: 5 }, update: {}, create: { numero: 5, nome_eixo: 'Infraestrutura (instalações prediais)', descricao: 'Projetos de manutenção e melhoramento predial voltados à segurança (física e sanitária) e preservação do patrimônio: Reparação predial (civil, elétrica, dados), novas instalações prediais.' } });
  const eixo6 = await prisma.eixoTematico.upsert({ where: { numero: 6 }, update: {}, create: { numero: 6, nome_eixo: 'Desenvolvimento de pessoas (docentes e servidores)', descricao: 'Formação continuada de docentes e servidores, associadas às competências gerais e específicas de suas atividades: Metodologias de ensino, Tecnologias educacionais, Sistemas acadêmicos e pedagógicos.' } });
  const eixo7 = await prisma.eixoTematico.upsert({ where: { numero: 7 }, update: {}, create: { numero: 7, nome_eixo: 'Convênios e Parcerias Institucionais', descricao: 'Formalização do relacionamento da Unidade com o Ecossistema de Tecnologia: Convênio de uso de prédio, estágios, projetos com empresas.' } });
  const eixo8 = await prisma.eixoTematico.upsert({ where: { numero: 8 }, update: {}, create: { numero: 8, nome_eixo: 'Implantação de UE / Cursos', descricao: 'Planejamento geral de implantação: Novas unidades de ensino, novos cursos superiores de tecnologia, acompanhamento de início e transição de cursos AMS.' } });
  const eixo9 = await prisma.eixoTematico.upsert({ where: { numero: 9 }, update: {}, create: { numero: 9, nome_eixo: 'Gestão da Rotina Educacional', descricao: 'Ações referente: Reuniões de planejamento (NDE, CEPE, CPA, editais PSS), Sustentabilidade, inclusão, atendimento ao aluno, acessibilidade, avaliação desempenho (ENADE, WebSAI).' } });

  // ─── 3. Temas por Eixo ───────────────────────────────────────────────────────
  const t1_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo1.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo1.eixo_id, descricao: 'Implantação / Alteração / Readequação de CST' } });
  const t1_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo1.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo1.eixo_id, descricao: 'Plano de Ensino (PE) e Prática Pedagógica' } });
  const t1_3 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 3, eixo_id: eixo1.eixo_id } }, update: {}, create: { tema_num: 3, eixo_id: eixo1.eixo_id, descricao: 'Projeto Interdisciplinar / Integrador' } });
  const t1_4 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 4, eixo_id: eixo1.eixo_id } }, update: {}, create: { tema_num: 4, eixo_id: eixo1.eixo_id, descricao: 'Extensão Curricularizada' } });

  const t2_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo2.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo2.eixo_id, descricao: 'Instalação e Manutenção de Equipamentos de Laboratório' } });
  const t2_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo2.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo2.eixo_id, descricao: 'Gestão de Ambiente Laboratorial' } });
  const t2_3 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 3, eixo_id: eixo2.eixo_id } }, update: {}, create: { tema_num: 3, eixo_id: eixo2.eixo_id, descricao: 'Aquisição de Equipamentos de Ensino' } });

  const t3_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo3.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo3.eixo_id, descricao: 'Espaços de Pesquisa e Laboratórios Especializados' } });
  const t3_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo3.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo3.eixo_id, descricao: 'Prestação de Serviços Tecnológicos' } });

  const t4_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo4.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo4.eixo_id, descricao: 'Rede de Tecnologia e Novotec' } });
  const t4_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo4.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo4.eixo_id, descricao: 'Projetos Estudantis (Baja, Aero Design, etc.)' } });

  const t5_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo5.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo5.eixo_id, descricao: 'Reparação Predial (Civil, Elétrica, Dados)' } });
  const t5_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo5.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo5.eixo_id, descricao: 'Novas Instalações Prediais' } });
  const t5_3 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 3, eixo_id: eixo5.eixo_id } }, update: {}, create: { tema_num: 3, eixo_id: eixo5.eixo_id, descricao: 'Segurança Física e Sanitária / Acessibilidade' } });

  const t6_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo6.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo6.eixo_id, descricao: 'Metodologias de Ensino e Tecnologias Educacionais' } });
  const t6_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo6.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo6.eixo_id, descricao: 'Capacitação em Sistemas Acadêmicos e Pedagógicos' } });
  const t6_3 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 3, eixo_id: eixo6.eixo_id } }, update: {}, create: { tema_num: 3, eixo_id: eixo6.eixo_id, descricao: 'Formação Continuada – Competências Técnicas' } });

  const t7_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo7.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo7.eixo_id, descricao: 'Convênios de Estágio' } });
  const t7_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo7.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo7.eixo_id, descricao: 'Parcerias com Empresas para Projetos Aplicados' } });

  const t8_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo8.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo8.eixo_id, descricao: 'Implantação de FATEC' } });
  const t8_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo8.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo8.eixo_id, descricao: 'Implantação de Cursos Superiores de Tecnologia (CST)' } });
  const t8_3 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 3, eixo_id: eixo8.eixo_id } }, update: {}, create: { tema_num: 3, eixo_id: eixo8.eixo_id, descricao: 'Implantação de Curso AMS' } });

  const t9_1 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 1, eixo_id: eixo9.eixo_id } }, update: {}, create: { tema_num: 1, eixo_id: eixo9.eixo_id, descricao: 'Reuniões NDE, CEPE e CPA' } });
  const t9_2 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 2, eixo_id: eixo9.eixo_id } }, update: {}, create: { tema_num: 2, eixo_id: eixo9.eixo_id, descricao: 'Sustentabilidade, Inclusão e Acessibilidade' } });
  const t9_3 = await prisma.tema.upsert({ where: { tema_num_eixo_id: { tema_num: 3, eixo_id: eixo9.eixo_id } }, update: {}, create: { tema_num: 3, eixo_id: eixo9.eixo_id, descricao: 'Avaliação de Desempenho (ENADE, WebSAI)' } });

  // ─── 4. Prioridades de Ação (5 graus do template) ───────────────────────────
  const prio1 = await prisma.prioridadeAcao.upsert({ where: { grau: 1 }, update: {}, create: { grau: 1, descricao: 'URGÊNCIA DE REGULAÇÃO', tipo_gestao: 'Regulação Normativa', detalhes: 'Prioridade máxima advinda do MEC, CEE, MP, Vigilância Sanitária ou notificação de qualquer órgão regulador/fiscalizador. Fundamentação: notificação de fiscalização, diligência de regulação, TAC, relatório circunstanciado.' } });
  const prio2 = await prisma.prioridadeAcao.upsert({ where: { grau: 2 }, update: {}, create: { grau: 2, descricao: 'URGÊNCIA ESTRATÉGICA', tipo_gestao: 'Gestão Estratégica', detalhes: 'Gestão Estratégica do CPS (AMS, novos cursos e unidades, programas de governo). Fundamentação: PPA do CPS, ações de governo conduzidas pela Superintendência do CPS.' } });
  const prio3 = await prisma.prioridadeAcao.upsert({ where: { grau: 3 }, update: {}, create: { grau: 3, descricao: 'PRIORIDADE ALTA', tipo_gestao: 'Gestão Tática', detalhes: 'Gestão Tática (ações correlatas à Avaliação institucional – ENADE, WebSAI, CPA, Observatório Escolar). Fundamentação: processo avaliativo de órgãos reguladores e processo avaliativo interno do CPS.' } });
  const prio4 = await prisma.prioridadeAcao.upsert({ where: { grau: 4 }, update: {}, create: { grau: 4, descricao: 'PRIORIDADE MÉDIA', tipo_gestao: 'Gestão Operacional', detalhes: 'Gestão Operacional para aumento da capacidade instalada. Fundamentação: plano operacional de gestão, homologado pela respectiva área da intendência, com foco na atividade fim do CPS.' } });
  const prio5 = await prisma.prioridadeAcao.upsert({ where: { grau: 5 }, update: {}, create: { grau: 5, descricao: 'PRIORIDADE REGULAR', tipo_gestao: 'Gestão Operacional', detalhes: 'Gestão Operacional para preservação da capacidade instalada. Fundamentação: plano operacional de gestão, homologado pela respectiva área da intendência, com foco na atividade fim do CPS.' } });

  // ─── 5. Situações-Problema (8 categorias do template) ───────────────────────
  const sp1 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 1 }, update: {}, create: { situacao_id: 1, codigo_categoria: 'CPA', descricao: 'Baixo índice de satisfação dos alunos com infraestrutura dos laboratórios de ensino', fonte: 'Relatório CPA 2025', ordem: 1 } });
  const sp2 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 2 }, update: {}, create: { situacao_id: 2, codigo_categoria: 'CPA', descricao: 'Equipamentos de laboratório de informática obsoletos e insuficientes para a demanda atual', fonte: 'Relatório CPA 2025', ordem: 2 } });
  const sp3 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 3 }, update: {}, create: { situacao_id: 3, codigo_categoria: 'NDE', descricao: 'PPC desatualizado em relação às tecnologias e demandas do mercado de trabalho regional', fonte: 'Relatório NDE 2025', ordem: 3 } });
  const sp4 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 4 }, update: {}, create: { situacao_id: 4, codigo_categoria: 'NDE', descricao: 'Deficiência de práticas interdisciplinares e de integração entre disciplinas dos cursos', fonte: 'Relatório NDE 2025', ordem: 4 } });
  const sp5 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 5 }, update: {}, create: { situacao_id: 5, codigo_categoria: 'HORUS', descricao: 'Alto índice de reprovação nas disciplinas de base matemática/exatas no 1º semestre', fonte: 'Relatório de Ocorrências Hórus 2025', ordem: 5 } });
  const sp6 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 6 }, update: {}, create: { situacao_id: 6, codigo_categoria: 'DA', descricao: 'Insuficiência de espaços de convivência e suporte ao bem-estar estudantil', fonte: 'Relatório de Representação Discente 2025', ordem: 6 } });
  const sp7 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 7 }, update: {}, create: { situacao_id: 7, codigo_categoria: 'CIPA', descricao: 'Instalações não plenamente adequadas às normas de acessibilidade (NBR 9050 / Lei 13.146/2015)', fonte: 'Relatório CIPA 2025 / Notificação MEC', ordem: 7 } });
  const sp8 = await prisma.situacaoProblema.upsert({ where: { situacao_id: 8 }, update: {}, create: { situacao_id: 8, codigo_categoria: 'OUTRO', descricao: 'Baixa taxa de inserção dos egressos no mercado de trabalho da área de formação', fonte: 'Observatório Escolar / Pesquisa de Egressos 2025', ordem: 8 } });

  // ─── 6. Entregáveis / Links SEI ──────────────────────────────────────────────
  const ev = async (num: string, desc: string, det?: string) =>
    prisma.entregavelLinkSei.upsert({ where: { entregavel_numero: num }, update: {}, create: { entregavel_numero: num, descricao: desc, detalhes: det } });

  const e01 = await ev('01-Ata',              'Ata de Reunião',                       'Documento de ata registrada no SEI');
  const e02 = await ev('02-Relatorio',        'Relatório',                            'Relatório de atividades ou resultados');
  const e03 = await ev('03-PlanoAcao',        'Plano de Ação',                        'Documento com plano de ação estruturado');
  const e04 = await ev('04-Oficio',           'Ofício',                               'Comunicação oficial via ofício');
  const e05 = await ev('05-ParecerTecnico',   'Parecer Técnico',                      'Documento de análise e parecer técnico');
  const e06 = await ev('06-Edital',           'Edital',                               'Edital de processo seletivo ou licitação');
  const e07 = await ev('07-Contrato',         'Contrato / Convênio',                  'Documento contratual ou de convênio');
  const e08 = await ev('08-PPC',              'PPC – Projeto Pedagógico do Curso',    'Projeto Pedagógico do Curso aprovado pela Congregação');
  const e09 = await ev('09-Memorando',        'Memorando',                            'Comunicação interna por memorando SEI');
  const e10 = await ev('10-Certificado',      'Certificado de Capacitação',           'Certificado de conclusão de curso ou capacitação');
  const e11 = await ev('11-PSS-Prof',         'PSS Professores',                      'Processo Seletivo Simplificado para professores');
  const e12 = await ev('12-PSS-AuxDoc',       'PSS Auxiliar de Docente',              'Processo Seletivo Simplificado para Auxiliar de Docente');
  const e13 = await ev('13-SolMaterial',      'Solicitação de Material de Consumo',   'Solicitação formal de material de consumo via sistema');
  const e14 = await ev('14-SolEquipamento',   'Solicitação de Equipamento',           'Solicitação formal de aquisição de material permanente');
  const e15 = await ev('15-PGA',              'PGA Fatec',                            'Plano de Gestão Anual da unidade de ensino');

  // ─── 7. Regional ─────────────────────────────────────────────────────────────
  const regional = await prisma.regional.upsert({
    where: { codigo_regional: 'RM01' },
    update: {},
    create: { nome_regional: 'Regional Metropolitana I', codigo_regional: 'RM01', ativo: true },
  });

  // ─── 8. Pessoas ──────────────────────────────────────────────────────────────
  const hash = await bcrypt.hash('Senha@123', 10);

  const pAdmin = await prisma.pessoa.upsert({ where: { email: 'admin@cps.sp.gov.br' }, update: {}, create: { nome: 'Administrador CPS', email: 'admin@cps.sp.gov.br', nome_usuario: 'admin.cps', senha: hash, tipo_usuario: 'Administrador', cpf: '00000000001', matricula: 'ADM0001', ativo: true } });
  const pResponsavelReg = await prisma.pessoa.upsert({ where: { email: 'regional.rm01@cps.sp.gov.br' }, update: {}, create: { nome: 'Dr. Fernando Oliveira', email: 'regional.rm01@cps.sp.gov.br', nome_usuario: 'fernando.oliveira', senha: hash, tipo_usuario: 'Regional', cpf: '77777777707', matricula: 'REG0001', telefone: '(11) 3333-0201', ativo: true } });
  const pDiretor = await prisma.pessoa.upsert({ where: { email: 'diretor@fatec-sbc.sp.gov.br' }, update: {}, create: { nome: 'Prof. Dr. Carlos Eduardo Mendes', email: 'diretor@fatec-sbc.sp.gov.br', nome_usuario: 'carlos.mendes', senha: hash, tipo_usuario: 'Diretor', cpf: '11111111101', matricula: 'DIR0001', telefone: '(11) 4333-0101', ativo: true } });
  const pCoordADS = await prisma.pessoa.upsert({ where: { email: 'coord.ads@fatec-sbc.sp.gov.br' }, update: {}, create: { nome: 'Profa. Dra. Ana Paula Ferreira', email: 'coord.ads@fatec-sbc.sp.gov.br', nome_usuario: 'ana.ferreira', senha: hash, tipo_usuario: 'Coordenador', cpf: '22222222202', matricula: 'CORD001', telefone: '(11) 4333-0102', ativo: true } });
  const pCoordRedes = await prisma.pessoa.upsert({ where: { email: 'coord.redes@fatec-sbc.sp.gov.br' }, update: {}, create: { nome: 'Prof. Dr. Roberto Lima', email: 'coord.redes@fatec-sbc.sp.gov.br', nome_usuario: 'roberto.lima', senha: hash, tipo_usuario: 'Coordenador', cpf: '33333333303', matricula: 'CORD002', telefone: '(11) 4333-0103', ativo: true } });
  const pDocente1 = await prisma.pessoa.upsert({ where: { email: 'marcio.silva@fatec-sbc.sp.gov.br' }, update: {}, create: { nome: 'Prof. Márcio da Silva', email: 'marcio.silva@fatec-sbc.sp.gov.br', nome_usuario: 'marcio.silva', senha: hash, tipo_usuario: 'Docente', cpf: '44444444404', matricula: 'DOC0001', telefone: '(11) 4333-0104', ativo: true } });
  const pDocente2 = await prisma.pessoa.upsert({ where: { email: 'patricia.costa@fatec-sbc.sp.gov.br' }, update: {}, create: { nome: 'Profa. Patrícia Costa', email: 'patricia.costa@fatec-sbc.sp.gov.br', nome_usuario: 'patricia.costa', senha: hash, tipo_usuario: 'Docente', cpf: '55555555505', matricula: 'DOC0002', telefone: '(11) 4333-0105', ativo: true } });
  const pAdmSecretaria = await prisma.pessoa.upsert({ where: { email: 'secretaria@fatec-sbc.sp.gov.br' }, update: {}, create: { nome: 'Juliana Martins', email: 'secretaria@fatec-sbc.sp.gov.br', nome_usuario: 'juliana.martins', senha: hash, tipo_usuario: 'Administrativo', cpf: '66666666606', matricula: 'ADM0002', telefone: '(11) 4333-0106', ativo: true } });

  // Vincular responsável à regional
  await prisma.regional.update({ where: { regional_id: regional.regional_id }, data: { responsavel_id: pResponsavelReg.pessoa_id } });
  await prisma.pessoaRegional.upsert({ where: { pessoa_id_regional_id: { pessoa_id: pResponsavelReg.pessoa_id, regional_id: regional.regional_id } }, update: {}, create: { pessoa_id: pResponsavelReg.pessoa_id, regional_id: regional.regional_id } });

  // ─── 9. Unidade ──────────────────────────────────────────────────────────────
  const unidade = await prisma.unidade.upsert({
    where: { codigo_fnnn: 'F088' },
    update: {},
    create: {
      codigo_fnnn: 'F088',
      nome_unidade: 'Fatec São Bernardo do Campo',
      regional_id: regional.regional_id,
      ativo: true,
      diretor_id: pDiretor.pessoa_id,
      endereco: 'Rua Java, 425',
      bairro: 'Jardim Chácara Inglesa',
      cidade: 'São Bernardo do Campo',
      uf: 'SP',
      cep: '09750-580',
      telefone: '(11) 4333-0100',
      site: 'https://www.fatec-sbc.sp.gov.br',
    },
  });

  // Vincular pessoas à unidade
  for (const p of [pDiretor, pCoordADS, pCoordRedes, pDocente1, pDocente2, pAdmSecretaria]) {
    await prisma.pessoaUnidade.upsert({ where: { pessoa_id_unidade_id: { pessoa_id: p.pessoa_id, unidade_id: unidade.unidade_id } }, update: {}, create: { pessoa_id: p.pessoa_id, unidade_id: unidade.unidade_id } });
  }

  // ─── 10. Cursos ──────────────────────────────────────────────────────────────
  let cursoADS = await prisma.curso.findFirst({ where: { unidade_id: unidade.unidade_id, nome: 'Tecnologia em Análise e Desenvolvimento de Sistemas' } });
  if (!cursoADS) cursoADS = await prisma.curso.create({ data: { unidade_id: unidade.unidade_id, nome: 'Tecnologia em Análise e Desenvolvimento de Sistemas', tipo: 'Tecnologico', status: 'Ativo', coordenador_id: pCoordADS.pessoa_id, ativo: true } });

  let cursoRedes = await prisma.curso.findFirst({ where: { unidade_id: unidade.unidade_id, nome: 'Tecnologia em Redes de Computadores' } });
  if (!cursoRedes) cursoRedes = await prisma.curso.create({ data: { unidade_id: unidade.unidade_id, nome: 'Tecnologia em Redes de Computadores', tipo: 'Tecnologico', status: 'Ativo', coordenador_id: pCoordRedes.pessoa_id, ativo: true } });

  // ─── 11. PGA 2026 ────────────────────────────────────────────────────────────
  let pga = await prisma.pGA.findFirst({ where: { unidade_id: unidade.unidade_id, ano: 2026 } });
  if (!pga) {
    pga = await prisma.pGA.create({
      data: {
        unidade_id: unidade.unidade_id,
        ano: 2026,
        versao: 'V01',
        analise_cenario:
          'A Fatec São Bernardo do Campo está localizada em um dos principais polos industriais e tecnológicos do estado de São Paulo, no Grande ABC. A unidade atua em um cenário de alta demanda por profissionais qualificados nas áreas de tecnologia da informação e comunicação, atendendo às necessidades das indústrias automotivas, metalúrgicas e de serviços da região.\n\n' +
          'Nos últimos dois anos, observou-se crescimento de 15% nas inscrições para os processos seletivos, indicando o reconhecimento da qualidade da formação oferecida pela unidade. O índice de aprovação no ENADE manteve-se acima da média nacional, com nota 4 no último ciclo avaliativo.\n\n' +
          'Entretanto, identificou-se necessidade urgente de: (a) modernização dos laboratórios de informática, cujos equipamentos datam de mais de 8 anos; (b) atualização dos PPCs para incorporar tecnologias emergentes como Cloud Computing, DevOps e Inteligência Artificial; (c) ampliação das parcerias empresariais para estágio e projetos aplicados, dado que apenas 35% dos alunos realizam estágio supervisionado; (d) adequação das instalações físicas às normas de acessibilidade, conforme notificação recebida do MEC. Este PGA busca endereçar essas lacunas e consolidar a posição da unidade como referência em tecnologia no Grande ABC.',
        status: 'EmElaboracao',
        usuario_criacao_id: pDiretor.pessoa_id,
      },
    });
  }

  // ─── 12. Associar Situações-Problema ao PGA ─────────────────────────────────
  for (const sp of [sp1, sp2, sp3, sp4, sp5, sp6, sp7, sp8]) {
    await prisma.pGASituacaoProblema.upsert({ where: { pga_id_situacao_problema_id: { pga_id: pga.pga_id, situacao_problema_id: sp.situacao_id } }, update: {}, create: { pga_id: pga.pga_id, situacao_problema_id: sp.situacao_id } });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  type Papel = 'Responsavel' | 'Colaborador';
  const addPessoa = (projetoId: number, pessoaId: number, papel: Papel, ch: number, haeId: number) =>
    prisma.projetoPessoa.create({ data: { acao_projeto_id: projetoId, pessoa_id: pessoaId, papel, carga_horaria_semanal: ch, tipo_vinculo_hae_id: haeId } });

  const addEtapa = (projetoId: number, desc: string, entregId: number, ref: string, dataPrev: Date) =>
    prisma.etapaProcesso.create({ data: { acao_projeto_id: projetoId, descricao: desc, entregavel_id: entregId, numero_ref: ref, status_verificacao: 'Pendente', data_verificacao_prevista: dataPrev } });

  const addSP = (projetoId: number, spId: number) =>
    prisma.acaoProjetoSituacaoProblema.create({ data: { acao_projeto_id: projetoId, situacao_problema_id: spId } });

  // ─── 13. Projetos (um por eixo, cobrindo todos os 9 eixos do template) ───────

  // ── Eixo 1 – Projeto 101 ──
  const proj101 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '101', nome_projeto: 'Atualização do PPC – CST em Análise e Desenvolvimento de Sistemas',
    pga_id: pga.pga_id, eixo_id: eixo1.eixo_id, prioridade_id: prio3.prioridade_id, tema_id: t1_1.tema_id,
    o_que_sera_feito: 'Revisão e atualização completa do Projeto Pedagógico do Curso de ADS, incorporando novas tecnologias como Cloud Computing, DevOps e Inteligência Artificial às ementas das disciplinas, em alinhamento às Diretrizes Curriculares Nacionais vigentes.',
    por_que_sera_feito: 'O PPC atual foi elaborado em 2021 e não contempla as tecnologias emergentes demandadas pelo mercado de TI regional, resultando em defasagem na formação dos egressos. O NDE sinalizou a necessidade de revisão e o relatório CPA aponta que 48% dos alunos percebem o currículo como desatualizado.',
    data_inicio: new Date('2026-02-01'), data_final: new Date('2026-07-31'),
    objetivos_institucionais_referenciados: '3, 6',
    custo_total_estimado: 0, fonte_recursos: 'Sem custo adicional – atividade de gestão acadêmica', ativo: true,
  }});
  await addPessoa(proj101.acao_projeto_id, pCoordADS.pessoa_id, 'Responsavel', 4, haeCC.id);
  await addPessoa(proj101.acao_projeto_id, pDocente1.pessoa_id, 'Colaborador', 2, haeEXT.id);
  await addEtapa(proj101.acao_projeto_id, 'Levantamento das demandas do mercado junto a empresas parceiras (questionário e entrevistas)', e02.entregavel_id, '101-001', new Date('2026-03-15'));
  await addEtapa(proj101.acao_projeto_id, 'Reunião do NDE para análise diagnóstica e proposição de alterações curriculares', e01.entregavel_id, '101-002', new Date('2026-04-01'));
  await addEtapa(proj101.acao_projeto_id, 'Elaboração do novo PPC com inclusão de disciplinas de IA, Cloud e DevOps', e08.entregavel_id, '101-003', new Date('2026-05-30'));
  await addEtapa(proj101.acao_projeto_id, 'Aprovação do PPC pela Congregação', e01.entregavel_id, '101-004', new Date('2026-06-15'));
  await addEtapa(proj101.acao_projeto_id, 'Encaminhamento do PPC ao CPS para análise e aprovação superior', e09.entregavel_id, '101-005', new Date('2026-06-30'));
  await addSP(proj101.acao_projeto_id, sp3.situacao_id);
  await addSP(proj101.acao_projeto_id, sp4.situacao_id);

  // ── Eixo 1 – Projeto 102 ──
  const proj102 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '102', nome_projeto: 'Implementação de Projeto Integrador Semestral com Empresas Parceiras',
    pga_id: pga.pga_id, eixo_id: eixo1.eixo_id, prioridade_id: prio4.prioridade_id, tema_id: t1_3.tema_id,
    o_que_sera_feito: 'Criação e implementação de projetos integradores semestrais articulando disciplinas de diferentes períodos para resolução de problemas reais de empresas parceiras da região do Grande ABC, com apresentação pública dos resultados ao final de cada semestre.',
    por_que_sera_feito: 'A integração entre disciplinas é apontada como deficitária pelo NDE e pelos alunos na pesquisa CPA 2025, resultando em formação fragmentada e baixa percepção de aplicabilidade dos conhecimentos. Empresas parceiras sinalizam lacunas em pensamento sistêmico dos egressos.',
    data_inicio: new Date('2026-02-01'), data_final: new Date('2026-12-15'),
    objetivos_institucionais_referenciados: '3, 6, 7',
    custo_total_estimado: 1500.00, fonte_recursos: 'Verba FUNDES / Custeio Unidade', ativo: true,
  }});
  await addPessoa(proj102.acao_projeto_id, pCoordADS.pessoa_id, 'Responsavel', 2, haeCC.id);
  await addPessoa(proj102.acao_projeto_id, pDocente2.pessoa_id, 'Colaborador', 2, haeEXT.id);
  await addEtapa(proj102.acao_projeto_id, 'Definição da metodologia PBL e cronograma dos projetos integradores', e03.entregavel_id, '102-001', new Date('2026-02-28'));
  await addEtapa(proj102.acao_projeto_id, 'Captação e formalização de empresas parceiras para fornecimento de problemas reais', e07.entregavel_id, '102-002', new Date('2026-03-31'));
  await addEtapa(proj102.acao_projeto_id, 'Execução e apresentação do 1º projeto integrador – 1º semestre 2026', e02.entregavel_id, '102-003', new Date('2026-06-30'));
  await addEtapa(proj102.acao_projeto_id, 'Execução e apresentação do 2º projeto integrador – 2º semestre 2026', e02.entregavel_id, '102-004', new Date('2026-11-30'));
  await addSP(proj102.acao_projeto_id, sp4.situacao_id);
  await addSP(proj102.acao_projeto_id, sp8.situacao_id);

  // ── Eixo 2 – Projeto 201 ──
  const proj201 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '201', nome_projeto: 'Modernização do Laboratório de Informática LB-01',
    pga_id: pga.pga_id, eixo_id: eixo2.eixo_id, prioridade_id: prio4.prioridade_id, tema_id: t2_3.tema_id,
    o_que_sera_feito: 'Substituição de 30 computadores do laboratório LB-01 por máquinas com 16 GB RAM, SSD 512 GB e processador de 10ª geração, adequadas ao suporte de ambientes de desenvolvimento, virtualização e containers utilizados nas disciplinas.',
    por_que_sera_feito: 'Os equipamentos do LB-01 têm mais de 8 anos e não executam ferramentas modernas de desenvolvimento como Docker, Android Studio e IDEs de IA, comprometendo diretamente a qualidade das aulas práticas e apontado como principal queixa na pesquisa CPA 2025.',
    data_inicio: new Date('2026-03-01'), data_final: new Date('2026-08-31'),
    objetivos_institucionais_referenciados: '3, 4',
    custo_total_estimado: 90000.00, fonte_recursos: 'FUNDES – Aquisição de Equipamentos', ativo: true,
  }});
  await addPessoa(proj201.acao_projeto_id, pCoordRedes.pessoa_id, 'Responsavel', 3, haePEQ.id);
  await addPessoa(proj201.acao_projeto_id, pAdmSecretaria.pessoa_id, 'Colaborador', 4, haeADM.id);
  await addEtapa(proj201.acao_projeto_id, 'Levantamento das necessidades e elaboração da especificação técnica dos equipamentos', e05.entregavel_id, '201-001', new Date('2026-03-31'));
  await addEtapa(proj201.acao_projeto_id, 'Solicitação de aquisição via sistema de compras CPS', e14.entregavel_id, '201-002', new Date('2026-04-30'));
  await addEtapa(proj201.acao_projeto_id, 'Processo licitatório e adjudicação do fornecedor', e06.entregavel_id, '201-003', new Date('2026-06-15'));
  await addEtapa(proj201.acao_projeto_id, 'Recebimento, instalação e configuração dos equipamentos', e02.entregavel_id, '201-004', new Date('2026-07-31'));
  await addEtapa(proj201.acao_projeto_id, 'Termo de recebimento definitivo e avaliação de conformidade técnica', e02.entregavel_id, '201-005', new Date('2026-08-15'));
  await addSP(proj201.acao_projeto_id, sp1.situacao_id);
  await addSP(proj201.acao_projeto_id, sp2.situacao_id);

  // ── Eixo 3 – Projeto 301 ──
  const proj301 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '301', nome_projeto: 'Implantação do Laboratório de Inovação e Pesquisa Aplicada (LIPA)',
    pga_id: pga.pga_id, eixo_id: eixo3.eixo_id, prioridade_id: prio2.prioridade_id, tema_id: t3_1.tema_id,
    o_que_sera_feito: 'Criação de espaço físico e virtual de pesquisa aplicada em parceria com empresas do Grande ABC, focado em projetos de IoT, automação e inteligência artificial, com 10 estações de trabalho dedicadas e infraestrutura de rede de alta velocidade.',
    por_que_sera_feito: 'A ausência de laboratório dedicado à pesquisa impede a captação de projetos com fomento externo (FAPESP, CNPq) e limita a produção científica dos docentes, reduzindo a competitividade da unidade no ecossistema de inovação regional e a capacidade de projetos com empresas.',
    data_inicio: new Date('2026-04-01'), data_final: new Date('2026-12-31'),
    objetivos_institucionais_referenciados: '6, 7, 8',
    custo_total_estimado: 150000.00, fonte_recursos: 'FAPESP – Edital Infraestrutura / Empresa Parceira', ativo: true,
  }});
  await addPessoa(proj301.acao_projeto_id, pDocente1.pessoa_id, 'Responsavel', 8, haePEQ.id);
  await addPessoa(proj301.acao_projeto_id, pCoordRedes.pessoa_id, 'Colaborador', 4, haePEQ.id);
  await addPessoa(proj301.acao_projeto_id, pDocente2.pessoa_id, 'Colaborador', 4, haePEQ.id);
  await addEtapa(proj301.acao_projeto_id, 'Elaboração do projeto e plano de implantação do LIPA', e03.entregavel_id, '301-001', new Date('2026-05-31'));
  await addEtapa(proj301.acao_projeto_id, 'Submissão de proposta a editais de fomento (FAPESP/CNPq)', e06.entregavel_id, '301-002', new Date('2026-06-30'));
  await addEtapa(proj301.acao_projeto_id, 'Adequação do espaço físico e infraestrutura de rede', e02.entregavel_id, '301-003', new Date('2026-09-30'));
  await addEtapa(proj301.acao_projeto_id, 'Aquisição e instalação dos equipamentos de pesquisa', e14.entregavel_id, '301-004', new Date('2026-11-30'));
  await addEtapa(proj301.acao_projeto_id, 'Inauguração do LIPA e início das atividades de pesquisa', e02.entregavel_id, '301-005', new Date('2026-12-15'));
  await addSP(proj301.acao_projeto_id, sp8.situacao_id);

  // ── Eixo 4 – Projeto 401 ──
  const proj401 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '401', nome_projeto: 'Implementação do Programa Novotec Expresso – Tecnologia da Informação',
    pga_id: pga.pga_id, eixo_id: eixo4.eixo_id, prioridade_id: prio2.prioridade_id, tema_id: t4_1.tema_id,
    o_que_sera_feito: 'Implantação de turmas do Programa Novotec Expresso na modalidade de Tecnologia da Informação, com 2 turmas de 30 alunos no 1º semestre e 2 turmas no 2º semestre, em parceria com a ETEC local.',
    por_que_sera_feito: 'O programa Novotec é uma ação estratégica do CPS (Grau 2) que amplia o acesso à formação tecnológica para jovens do ensino médio, fortalecendo a articulação entre ETEC e FATEC e fomentando o pipeline de futuros ingressantes nos CSTs.',
    data_inicio: new Date('2026-01-20'), data_final: new Date('2026-12-15'),
    objetivos_institucionais_referenciados: '1, 6, 9',
    custo_total_estimado: 5000.00, fonte_recursos: 'Programa Novotec – CPS', ativo: true,
  }});
  await addPessoa(proj401.acao_projeto_id, pDocente1.pessoa_id, 'Responsavel', 6, haeEXT.id);
  await addPessoa(proj401.acao_projeto_id, pCoordADS.pessoa_id, 'Colaborador', 2, haeCC.id);
  await addEtapa(proj401.acao_projeto_id, 'Contato com ETECs parceiras e formalização do convênio Novotec', e07.entregavel_id, '401-001', new Date('2026-02-15'));
  await addEtapa(proj401.acao_projeto_id, 'Seleção e capacitação dos docentes para as turmas Novotec', e10.entregavel_id, '401-002', new Date('2026-03-01'));
  await addEtapa(proj401.acao_projeto_id, 'Execução das turmas 1º semestre – módulos TI', e02.entregavel_id, '401-003', new Date('2026-06-30'));
  await addEtapa(proj401.acao_projeto_id, 'Execução das turmas 2º semestre – módulos TI', e02.entregavel_id, '401-004', new Date('2026-11-30'));
  await addSP(proj401.acao_projeto_id, sp8.situacao_id);

  // ── Eixo 5 – Projeto 501 ──
  const proj501 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '501', nome_projeto: 'Adequação das Instalações Físicas para Acessibilidade (NBR 9050)',
    pga_id: pga.pga_id, eixo_id: eixo5.eixo_id, prioridade_id: prio1.prioridade_id, tema_id: t5_3.tema_id,
    o_que_sera_feito: 'Instalação de rampas de acesso, adequação de banheiros, implantação de piso tátil e sinalização em Braille nos corredores e laboratórios da unidade, em conformidade com a NBR 9050 e Lei Brasileira de Inclusão 13.146/2015.',
    por_que_sera_feito: 'A unidade recebeu notificação formal do MEC (processo n.º 23000.001234/2025) sobre inadequações nas condições de acessibilidade física durante visita de reconhecimento dos cursos, sendo obrigatória a regularização até junho/2026 para manutenção do credenciamento.',
    data_inicio: new Date('2026-01-15'), data_final: new Date('2026-06-30'),
    objetivos_institucionais_referenciados: '5',
    custo_total_estimado: 85000.00, fonte_recursos: 'Verba CPS – Manutenção Predial / Acessibilidade', ativo: true,
    obrigatorio_inclusao: true,
  }});
  await addPessoa(proj501.acao_projeto_id, pDiretor.pessoa_id, 'Responsavel', 2, haeADM.id);
  await addPessoa(proj501.acao_projeto_id, pAdmSecretaria.pessoa_id, 'Colaborador', 6, haeADM.id);
  await addEtapa(proj501.acao_projeto_id, 'Levantamento detalhado das não-conformidades e elaboração do projeto de adequação', e05.entregavel_id, '501-001', new Date('2026-02-15'));
  await addEtapa(proj501.acao_projeto_id, 'Processo licitatório para contratação de empresa especializada em obras de acessibilidade', e06.entregavel_id, '501-002', new Date('2026-03-31'));
  await addEtapa(proj501.acao_projeto_id, 'Execução das obras – rampas e adequação de banheiros', e02.entregavel_id, '501-003', new Date('2026-05-15'));
  await addEtapa(proj501.acao_projeto_id, 'Instalação de piso tátil e sinalização em Braille', e02.entregavel_id, '501-004', new Date('2026-06-15'));
  await addEtapa(proj501.acao_projeto_id, 'Vistoria de conformidade e envio de relatório ao MEC com evidências fotográficas', e02.entregavel_id, '501-005', new Date('2026-06-30'));
  await addSP(proj501.acao_projeto_id, sp7.situacao_id);
  await addSP(proj501.acao_projeto_id, sp6.situacao_id);

  // ── Eixo 6 – Projeto 601 ──
  const proj601 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '601', nome_projeto: 'Programa de Capacitação Docente em Metodologias Ativas e Tecnologias Educacionais',
    pga_id: pga.pga_id, eixo_id: eixo6.eixo_id, prioridade_id: prio4.prioridade_id, tema_id: t6_1.tema_id,
    o_que_sera_feito: 'Realização de 4 workshops ao longo de 2026 sobre metodologias ativas (PBL, sala de aula invertida, aprendizagem colaborativa) e ferramentas digitais educacionais (Moodle avançado, Kahoot, Padlet, ambientes de programação colaborativa online).',
    por_que_sera_feito: 'A pesquisa de satisfação CPA 2025 aponta que 42% dos alunos consideram as metodologias de ensino pouco interativas e com baixo aproveitamento. A capacitação docente é indispensável para a melhoria dos índices de satisfação, engajamento e retenção discente.',
    data_inicio: new Date('2026-02-01'), data_final: new Date('2026-11-30'),
    objetivos_institucionais_referenciados: '3, 8',
    custo_total_estimado: 8000.00, fonte_recursos: 'Verba de Capacitação Docente CPS', ativo: true,
  }});
  await addPessoa(proj601.acao_projeto_id, pDiretor.pessoa_id, 'Responsavel', 2, haeADM.id);
  await addPessoa(proj601.acao_projeto_id, pCoordADS.pessoa_id, 'Colaborador', 2, haeCC.id);
  await addEtapa(proj601.acao_projeto_id, 'Levantamento das necessidades de capacitação (questionário com os docentes)', e02.entregavel_id, '601-001', new Date('2026-02-28'));
  await addEtapa(proj601.acao_projeto_id, '1º Workshop – Metodologias Ativas: PBL e Sala de Aula Invertida', e10.entregavel_id, '601-002', new Date('2026-04-30'));
  await addEtapa(proj601.acao_projeto_id, '2º Workshop – Ferramentas Digitais Educacionais (Moodle, Padlet, Kahoot)', e10.entregavel_id, '601-003', new Date('2026-06-30'));
  await addEtapa(proj601.acao_projeto_id, '3º Workshop – Avaliação por Competências e Rubricas', e10.entregavel_id, '601-004', new Date('2026-09-30'));
  await addEtapa(proj601.acao_projeto_id, '4º Workshop – Gamificação e Aprendizagem Baseada em Projetos Digitais', e10.entregavel_id, '601-005', new Date('2026-10-31'));
  await addEtapa(proj601.acao_projeto_id, 'Relatório final de impacto e avaliação do programa de capacitação', e02.entregavel_id, '601-006', new Date('2026-11-30'));
  await addSP(proj601.acao_projeto_id, sp1.situacao_id);
  await addSP(proj601.acao_projeto_id, sp5.situacao_id);

  // ── Eixo 7 – Projeto 701 ──
  const proj701 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '701', nome_projeto: 'Formalização de Convênios de Estágio com Empresas do Grande ABC',
    pga_id: pga.pga_id, eixo_id: eixo7.eixo_id, prioridade_id: prio4.prioridade_id, tema_id: t7_1.tema_id,
    o_que_sera_feito: 'Prospecção e formalização de 20 novos convênios de estágio com empresas do setor de tecnologia do Grande ABC, com meta de 80 vagas de estágio remunerado para alunos do 4º ao 6º semestre dos CSTs de ADS e Redes.',
    por_que_sera_feito: 'Apenas 35% dos alunos matriculados nos últimos semestres realizaram estágio supervisionado, muito abaixo da meta institucional de 60%. Esse déficit impacta negativamente a formação prática e a empregabilidade dos egressos, aspecto crítico na avaliação CPA.',
    data_inicio: new Date('2026-03-01'), data_final: new Date('2026-10-31'),
    objetivos_institucionais_referenciados: '1, 2, 8',
    custo_total_estimado: 2000.00, fonte_recursos: 'Verba de Custeio / Sem custo adicional', ativo: true,
  }});
  await addPessoa(proj701.acao_projeto_id, pCoordADS.pessoa_id, 'Responsavel', 3, haeCC.id);
  await addPessoa(proj701.acao_projeto_id, pAdmSecretaria.pessoa_id, 'Colaborador', 4, haeADM.id);
  await addEtapa(proj701.acao_projeto_id, 'Mapeamento e prospecção de empresas do setor de TI da região do Grande ABC', e02.entregavel_id, '701-001', new Date('2026-04-30'));
  await addEtapa(proj701.acao_projeto_id, 'Elaboração e envio das minutas de convênio para as empresas prospectadas', e07.entregavel_id, '701-002', new Date('2026-06-30'));
  await addEtapa(proj701.acao_projeto_id, 'Assinatura dos convênios e publicação das vagas de estágio no sistema', e07.entregavel_id, '701-003', new Date('2026-08-31'));
  await addEtapa(proj701.acao_projeto_id, 'Acompanhamento semestral dos estagiários e avaliação das empresas parceiras', e02.entregavel_id, '701-004', new Date('2026-10-31'));
  await addSP(proj701.acao_projeto_id, sp8.situacao_id);

  // ── Eixo 8 – Projeto 801 ──
  const proj801 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '801', nome_projeto: 'Implantação do CST em Ciência de Dados',
    pga_id: pga.pga_id, eixo_id: eixo8.eixo_id, prioridade_id: prio2.prioridade_id, tema_id: t8_2.tema_id,
    o_que_sera_feito: 'Planejamento e implantação do Curso Superior de Tecnologia em Ciência de Dados, com 40 vagas anuais, incluindo elaboração do PPC, seleção e contratação de docentes, e preparação da infraestrutura de laboratório específica para o curso.',
    por_que_sera_feito: 'O mercado regional apresenta demanda crescente por profissionais de Ciência de Dados, com mais de 500 vagas abertas em empresas do Grande ABC sem candidatos qualificados. A implantação deste CST está alinhada ao PPA do CPS e à orientação estratégica da Superintendência.',
    data_inicio: new Date('2026-01-01'), data_final: new Date('2026-12-31'),
    objetivos_institucionais_referenciados: '1, 6, 9',
    custo_total_estimado: 200000.00, fonte_recursos: 'CPS – Implantação de Novos Cursos', ativo: true,
  }});
  await addPessoa(proj801.acao_projeto_id, pDiretor.pessoa_id, 'Responsavel', 4, haeADM.id);
  await addPessoa(proj801.acao_projeto_id, pDocente1.pessoa_id, 'Colaborador', 6, haePEQ.id);
  await addPessoa(proj801.acao_projeto_id, pCoordADS.pessoa_id, 'Colaborador', 4, haeCC.id);
  await addEtapa(proj801.acao_projeto_id, 'Indicação do Coordenador de Implantação do CST', e09.entregavel_id, '801-001', new Date('2026-02-28'));
  await addEtapa(proj801.acao_projeto_id, 'Elaboração e aprovação do PPC do CST em Ciência de Dados', e08.entregavel_id, '801-002', new Date('2026-04-30'));
  await addEtapa(proj801.acao_projeto_id, 'PSS para contratação dos docentes do curso', e11.entregavel_id, '801-003', new Date('2026-05-31'));
  await addEtapa(proj801.acao_projeto_id, 'Verificação e adequação da infraestrutura laboratorial para o curso', e05.entregavel_id, '801-004', new Date('2026-07-31'));
  await addEtapa(proj801.acao_projeto_id, 'Processo Seletivo de Alunos (PSA) e abertura do curso', e06.entregavel_id, '801-005', new Date('2026-09-30'));
  await addEtapa(proj801.acao_projeto_id, 'Início das aulas e acompanhamento da 1ª turma', e02.entregavel_id, '801-006', new Date('2026-12-15'));
  await addSP(proj801.acao_projeto_id, sp8.situacao_id);
  await addSP(proj801.acao_projeto_id, sp3.situacao_id);

  // ── Eixo 9 – Projeto 901 ──
  const proj901 = await prisma.acaoProjeto.create({ data: {
    codigo_projeto: '901', nome_projeto: 'Gestão das Reuniões de NDE, CEPE e CPA – 2026',
    pga_id: pga.pga_id, eixo_id: eixo9.eixo_id, prioridade_id: prio3.prioridade_id, tema_id: t9_1.tema_id,
    o_que_sera_feito: 'Coordenação, convocação e registro sistemático de todas as reuniões obrigatórias dos colegiados (NDE – ambos os cursos, CEPE, CPA), garantindo quórum mínimo, elaboração de atas, encaminhamento de deliberações e acompanhamento de ações decorrentes ao longo de 2026.',
    por_que_sera_feito: 'O cumprimento regular das reuniões de colegiados é obrigação regulatória para manutenção do reconhecimento dos cursos (ENADE/MEC). Em 2025, duas reuniões do NDE foram canceladas por falta de quórum, gerando pendências no processo de avaliação institucional e alertas do CPS.',
    data_inicio: new Date('2026-02-01'), data_final: new Date('2026-11-30'),
    objetivos_institucionais_referenciados: '5',
    custo_total_estimado: 0, fonte_recursos: 'Sem custo adicional', ativo: true,
  }});
  await addPessoa(proj901.acao_projeto_id, pDiretor.pessoa_id, 'Responsavel', 2, haeADM.id);
  await addPessoa(proj901.acao_projeto_id, pCoordADS.pessoa_id, 'Colaborador', 1, haeCC.id);
  await addPessoa(proj901.acao_projeto_id, pCoordRedes.pessoa_id, 'Colaborador', 1, haeCC.id);
  await addEtapa(proj901.acao_projeto_id, '1ª Reunião NDE – ADS (1º semestre)', e01.entregavel_id, '901-001', new Date('2026-03-31'));
  await addEtapa(proj901.acao_projeto_id, '1ª Reunião NDE – Redes (1º semestre)', e01.entregavel_id, '901-002', new Date('2026-04-15'));
  await addEtapa(proj901.acao_projeto_id, '1ª Reunião CEPE (1º semestre)', e01.entregavel_id, '901-003', new Date('2026-04-30'));
  await addEtapa(proj901.acao_projeto_id, '1ª Reunião CPA (1º semestre)', e01.entregavel_id, '901-004', new Date('2026-05-31'));
  await addEtapa(proj901.acao_projeto_id, '2ª Reunião NDE – ADS (2º semestre)', e01.entregavel_id, '901-005', new Date('2026-09-30'));
  await addEtapa(proj901.acao_projeto_id, '2ª Reunião NDE – Redes (2º semestre)', e01.entregavel_id, '901-006', new Date('2026-10-15'));
  await addEtapa(proj901.acao_projeto_id, '2ª Reunião CPA (2º semestre) + Consolidação do Relatório Anual CPA', e02.entregavel_id, '901-007', new Date('2026-11-30'));
  await addSP(proj901.acao_projeto_id, sp3.situacao_id);

  // ─── 14. Ações CPA (Anexo 6 do template) ────────────────────────────────────
  const acoesCPA = [
    { desc: 'Elaborar e aplicar pesquisa de satisfação com alunos sobre infraestrutura e metodologias de ensino', just: 'Subsidiar o planejamento de modernização dos laboratórios e o programa de capacitação docente' },
    { desc: 'Analisar índices de retenção e evasão por curso, período e disciplina', just: 'Identificar causas de evasão e propor ações preventivas de retenção discente' },
    { desc: 'Realizar encontro com egressos para avaliação da formação recebida e empregabilidade', just: 'Avaliar aderência do currículo às exigências do mercado de trabalho e retroalimentar o PPC' },
    { desc: 'Coletar avaliação docente pelos discentes via plataforma WebSAI', just: 'Monitorar qualidade do processo pedagógico e identificar necessidades de capacitação' },
    { desc: 'Elaborar e publicar o Relatório Anual CPA 2026 com resultados e plano de ação para 2027', just: 'Garantir transparência institucional e subsidiar o planejamento estratégico 2027' },
  ];
  for (const a of acoesCPA) {
    await prisma.acaoCPA.create({ data: { pga_id: pga.pga_id, descricao: a.desc, justificativa: a.just } });
  }

  // ─── 15. Rotinas Institucionais ──────────────────────────────────────────────
  const criarRotina = async (tipo: any, titulo: string, cursoId: number | null, periodo: any, respId: number, entregavel: string) => {
    const rotina = await prisma.rotinaInstitucional.create({ data: {
      pga_id: pga.pga_id, curso_id: cursoId, tipo_rotina: tipo, titulo,
      descricao: `Execução da rotina institucional obrigatória: ${titulo}`,
      periodicidade: periodo, data_inicio: new Date('2026-02-01'), data_fim: new Date('2026-11-30'),
      responsavel_id: respId, entregavel_esperado: entregavel, status: 'Planejada', ativo: true,
    }});
    return rotina;
  };

  const rotNDE_ADS = await criarRotina('NDE', 'Núcleo Docente Estruturante – ADS', cursoADS.curso_id, 'Semestral', pCoordADS.pessoa_id, 'Ata de reunião registrada no SEI');
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotNDE_ADS.rotina_id, data_realizacao: new Date('2026-03-25'), hora_inicio: new Date('1970-01-01T09:00:00'), hora_fim: new Date('1970-01-01T11:00:00'), local: 'Sala de Reuniões – Bloco A', pauta: 'Avaliação curricular e planejamento semestral', status: 'Planejada' } });
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotNDE_ADS.rotina_id, data_realizacao: new Date('2026-09-24'), hora_inicio: new Date('1970-01-01T09:00:00'), hora_fim: new Date('1970-01-01T11:00:00'), local: 'Sala de Reuniões – Bloco A', pauta: 'Avaliação do 1º semestre e planejamento do 2º semestre', status: 'Planejada' } });

  const rotNDE_Redes = await criarRotina('NDE', 'Núcleo Docente Estruturante – Redes', cursoRedes.curso_id, 'Semestral', pCoordRedes.pessoa_id, 'Ata de reunião registrada no SEI');
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotNDE_Redes.rotina_id, data_realizacao: new Date('2026-04-08'), hora_inicio: new Date('1970-01-01T09:00:00'), hora_fim: new Date('1970-01-01T11:00:00'), local: 'Sala de Reuniões – Bloco A', pauta: 'Avaliação curricular e planejamento semestral', status: 'Planejada' } });

  const rotCPA = await criarRotina('CPA', 'Reunião da Comissão Própria de Avaliação – CPA 2026', null, 'Semestral', pDiretor.pessoa_id, 'Relatório semestral CPA publicado no site institucional');
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotCPA.rotina_id, data_realizacao: new Date('2026-05-20'), hora_inicio: new Date('1970-01-01T14:00:00'), hora_fim: new Date('1970-01-01T16:00:00'), local: 'Auditório – Bloco Principal', pauta: '1ª reunião CPA – resultados da pesquisa de satisfação 1º sem.', status: 'Planejada' } });
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotCPA.rotina_id, data_realizacao: new Date('2026-11-18'), hora_inicio: new Date('1970-01-01T14:00:00'), hora_fim: new Date('1970-01-01T17:00:00'), local: 'Auditório – Bloco Principal', pauta: '2ª reunião CPA – consolidação do relatório anual 2026', status: 'Planejada' } });

  const rotCEPE = await criarRotina('CEPE', 'Conselho de Ensino, Pesquisa e Extensão – CEPE 2026', null, 'Semestral', pDiretor.pessoa_id, 'Ata de reunião do CEPE registrada no SEI');
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotCEPE.rotina_id, data_realizacao: new Date('2026-04-22'), hora_inicio: new Date('1970-01-01T09:00:00'), hora_fim: new Date('1970-01-01T11:30:00'), local: 'Sala de Reuniões – Bloco Administrativo', pauta: 'Deliberações sobre atividades de extensão 2026', status: 'Planejada' } });

  const rotPlanejamento = await criarRotina('Planejamento', 'Reunião de Planejamento Pedagógico Semestral', null, 'Semestral', pDiretor.pessoa_id, 'Ata de reunião de planejamento com todos os docentes');
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotPlanejamento.rotina_id, data_realizacao: new Date('2026-01-29'), hora_inicio: new Date('1970-01-01T08:00:00'), hora_fim: new Date('1970-01-01T12:00:00'), local: 'Auditório – Bloco Principal', pauta: 'Planejamento pedagógico 1º semestre 2026 – todos os docentes', status: 'Planejada' } });

  const rotEnade = await criarRotina('AvaliacaoInstitucional', 'Preparação e Acompanhamento ENADE 2026', null, 'Anual', pCoordADS.pessoa_id, 'Relatório de acompanhamento dos inscritos e resultado ENADE');
  await prisma.rotinaOcorrencia.create({ data: { rotina_id: rotEnade.rotina_id, data_realizacao: new Date('2026-10-21'), hora_inicio: new Date('1970-01-01T07:30:00'), hora_fim: new Date('1970-01-01T13:00:00'), local: 'Laboratórios LB-01 e LB-02', pauta: 'Simulado ENADE e orientações finais para os inscritos', status: 'Planejada' } });

  // ─── Participantes das Rotinas ────────────────────────────────────────────────
  await prisma.rotinaParticipante.createMany({ data: [
    { rotina_id: rotNDE_ADS.rotina_id, pessoa_id: pCoordADS.pessoa_id, papel: 'Presidente' },
    { rotina_id: rotNDE_ADS.rotina_id, pessoa_id: pDocente1.pessoa_id, papel: 'Membro' },
    { rotina_id: rotNDE_ADS.rotina_id, pessoa_id: pDocente2.pessoa_id, papel: 'Membro' },
    { rotina_id: rotNDE_Redes.rotina_id, pessoa_id: pCoordRedes.pessoa_id, papel: 'Presidente' },
    { rotina_id: rotNDE_Redes.rotina_id, pessoa_id: pDocente1.pessoa_id, papel: 'Membro' },
    { rotina_id: rotCPA.rotina_id, pessoa_id: pDiretor.pessoa_id, papel: 'Presidente' },
    { rotina_id: rotCPA.rotina_id, pessoa_id: pCoordADS.pessoa_id, papel: 'Membro Docente' },
    { rotina_id: rotCPA.rotina_id, pessoa_id: pCoordRedes.pessoa_id, papel: 'Membro Docente' },
    { rotina_id: rotCEPE.rotina_id, pessoa_id: pDiretor.pessoa_id, papel: 'Presidente' },
    { rotina_id: rotCEPE.rotina_id, pessoa_id: pCoordADS.pessoa_id, papel: 'Membro' },
    { rotina_id: rotCEPE.rotina_id, pessoa_id: pCoordRedes.pessoa_id, papel: 'Membro' },
  ]});

  console.log('\n✓ Seed concluído com sucesso!\n');
  console.log('Dados criados:');
  console.log('  ├─ 1 Regional (RM01)');
  console.log('  ├─ 8 Pessoas (Admin, Regional, Diretor, 2 Coordenadores, 2 Docentes, 1 Adm)');
  console.log('  ├─ 1 Unidade: Fatec São Bernardo do Campo (F088)');
  console.log('  ├─ 2 Cursos (ADS e Redes)');
  console.log('  ├─ 9 Eixos Temáticos (conforme template PGA 2026)');
  console.log('  ├─ 27 Temas distribuídos pelos 9 eixos');
  console.log('  ├─ 5 Prioridades de Ação (Graus 1-5 conforme template)');
  console.log('  ├─ 8 Situações-Problema (CPA, NDE, Hórus, DA, CIPA, Outro)');
  console.log('  ├─ 15 Entregáveis/Links SEI');
  console.log('  ├─ 5 Tipos de Vínculo HAE');
  console.log('  ├─ 1 PGA 2026 (status: EmElaboracao)');
  console.log('  ├─ 9 Projetos (101, 102, 201, 301, 401, 501, 601, 701, 801, 901)');
  console.log('  │   └─ Com pessoas, etapas e situações-problema vinculadas');
  console.log('  ├─ 5 Ações CPA (Anexo 6)');
  console.log('  └─ 6 Rotinas Institucionais (NDE×2, CPA, CEPE, Planejamento, ENADE)');
  console.log('\nCredenciais de acesso:');
  console.log('  Admin CPS:     admin@cps.sp.gov.br     / Senha@123');
  console.log('  Diretor:       diretor@fatec-sbc.sp.gov.br / Senha@123');
  console.log('  Coord ADS:     coord.ads@fatec-sbc.sp.gov.br / Senha@123');
  console.log('  Coord Redes:   coord.redes@fatec-sbc.sp.gov.br / Senha@123');
  console.log('  Regional:      regional.rm01@cps.sp.gov.br / Senha@123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
