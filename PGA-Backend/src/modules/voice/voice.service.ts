import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { ptBr } from 'stopword';

export interface VoiceCommandResult {
  action: string;
  description: string;
  recognized: boolean;
  direction: 'enable' | 'disable' | null;
}

const TOGGLE_ACTIONS = new Set([
  'toggle_contrast',
  'toggle_motion',
  'toggle_sound',
]);

const ENABLE_WORDS = ['ativar', 'ligar', 'habilitar', 'enable'];
const DISABLE_WORDS = [
  'desativar',
  'desativa', // stem distinto: desativ vs desat
  'desligar',
  'desabilitar',
  'disable',
];

const INTENT_MAP: Array<{
  keywords: string[];
  action: string;
  description: string;
}> = [
  {
    keywords: ['escuro', 'dark', 'noite', 'noturno'],
    action: 'dark_mode',
    description: 'Tema escuro ativado',
  },
  {
    keywords: ['claro', 'light', 'dia', 'branco'],
    action: 'light_mode',
    description: 'Tema claro ativado',
  },
  {
    keywords: ['sons', 'som', 'audio', 'sonoro'],
    action: 'toggle_sound',
    description: 'Sons do sistema alternados',
  },
  {
    keywords: ['sistema', 'system', 'automatico', 'auto'],
    action: 'system_mode',
    description: 'Tema do sistema ativado',
  },
  {
    keywords: ['aumentar', 'maior', 'grande', 'ampliar', 'crescer'],
    action: 'increase_font',
    description: 'Fonte aumentada',
  },
  {
    keywords: ['diminuir', 'menor', 'pequeno', 'reduzir'],
    action: 'decrease_font',
    description: 'Fonte diminuída',
  },
  {
    keywords: ['restaurar', 'padrao', 'reset', 'normal'],
    action: 'reset_font',
    description: 'Fonte restaurada para o padrão',
  },
  {
    keywords: ['contraste', 'contrast'],
    action: 'toggle_contrast',
    description: 'Alto contraste alternado',
  },
  {
    keywords: ['animacao', 'animacoes', 'movimento', 'motion'],
    action: 'toggle_motion',
    description: 'Redução de movimento alternada',
  },
  {
    keywords: ['acessibilidade', 'configuracoes', 'settings', 'config'],
    action: 'open_accessibility',
    description: 'Menu de acessibilidade aberto',
  },
];

const stemmer = natural.PorterStemmerPt as { stem: (word: string) => string };
const wordTokenizer = new natural.WordTokenizer();
const stopwordSet = new Set(ptBr as string[]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
}

// Tokeniza, remove stopwords em PT-BR e aplica stemming (PorterStemmerPt)
function preprocess(text: string): string[] {
  const tokens = wordTokenizer.tokenize(normalize(text)) ?? [];
  const filtered = tokens.filter((t) => !stopwordSet.has(t));
  return filtered.map((t) => stemmer.stem(t));
}

// Stems pré-computados para detecção de direção (ativar/desativar)
const ENABLE_STEMS = new Set(
  ENABLE_WORDS.map((w) => stemmer.stem(normalize(w))),
);
const DISABLE_STEMS = new Set(
  DISABLE_WORDS.map((w) => stemmer.stem(normalize(w))),
);

// Stems pré-computados para cada intenção do mapa
const INTENT_STEMS = INTENT_MAP.map((intent) => ({
  ...intent,
  stems: new Set(intent.keywords.map((k) => stemmer.stem(normalize(k)))),
}));

@Injectable()
export class VoiceService {
  classify(transcript: string): VoiceCommandResult {
    const stems = preprocess(transcript);

    for (const intent of INTENT_STEMS) {
      if (stems.some((s) => intent.stems.has(s))) {
        let direction: 'enable' | 'disable' | null = null;
        if (TOGGLE_ACTIONS.has(intent.action)) {
          if (stems.some((s) => ENABLE_STEMS.has(s))) direction = 'enable';
          else if (stems.some((s) => DISABLE_STEMS.has(s)))
            direction = 'disable';
        }
        return {
          action: intent.action,
          description: intent.description,
          recognized: true,
          direction,
        };
      }
    }

    return {
      action: 'unknown',
      description: `Comando não reconhecido: "${transcript}"`,
      recognized: false,
      direction: null,
    };
  }
}
