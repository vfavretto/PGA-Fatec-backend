import { Injectable } from '@nestjs/common';

export interface VoiceCommandResult {
  action: string;
  description: string;
  recognized: boolean;
  direction: 'enable' | 'disable' | null;
}

const TOGGLE_ACTIONS = new Set(['toggle_contrast', 'toggle_motion', 'toggle_sound']);

const ENABLE_WORDS = ['ativar', 'ativa', 'ative', 'ligar', 'liga', 'habilitar', 'habilita', 'habilite', 'enable'];
const DISABLE_WORDS = ['desativar', 'desativa', 'desative', 'desligar', 'desliga', 'desabilitar', 'desabilita', 'desabilite', 'disable'];

const INTENT_MAP: Array<{ keywords: string[]; action: string; description: string }> = [
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
    keywords: ['restaurar', 'padrao', 'reset', 'normal', 'padrao'],
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

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '');
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

@Injectable()
export class VoiceService {
  classify(transcript: string): VoiceCommandResult {
    const tokens = tokenize(transcript);

    for (const intent of INTENT_MAP) {
      const normalizedKeywords = intent.keywords.map(normalize);
      if (tokens.some((t) => normalizedKeywords.includes(t))) {
        let direction: 'enable' | 'disable' | null = null;
        if (TOGGLE_ACTIONS.has(intent.action)) {
          if (tokens.some((t) => ENABLE_WORDS.includes(t))) direction = 'enable';
          else if (tokens.some((t) => DISABLE_WORDS.includes(t))) direction = 'disable';
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
