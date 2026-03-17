import type { Language } from '../constants/quotes';

export const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365];

// ── Short celebration phrase (shown large, all caps) ──────────────────────────
export const MILESTONE_PHRASES: Record<number, string> = {
  1:   'the hardest day is behind you.',
  3:   'three days of choosing yourself.',
  7:   'a full week. that\'s real.',
  14:  'two weeks. the habit is weakening.',
  30:  'one month. you rewired something.',
  60:  'sixty days. this is who you are now.',
  90:  'ninety days. the science says you\'re free.',
  180: 'half a year. extraordinary.',
  365: 'a full year. you did it.',
};

// ── Rich milestone insights (bilingual) ───────────────────────────────────────
export interface MilestoneInsight {
  tagline: string;      // small label above number, e.g. "1 DIA"
  insight: string;      // 2–3 sentence science/psychology context
  bodyFact: string;     // single concrete body/brain fact
  nextDays: number | null;
  nextTeaser: string | null; // what to look forward to
}

export const MILESTONE_INSIGHTS: Record<number, Record<Language, MilestoneInsight>> = {
  1: {
    pt: {
      tagline: '1 DIA',
      insight:
        'As primeiras 24 horas são biologicamente as mais difíceis — e você acabou de passá-las. Seu cérebro registrou algo novo: você pode resistir. Esse momento já mudou alguma coisa em você.',
      bodyFact:
        'Nas primeiras horas, seus níveis de cortisol (hormônio do estresse) sobem. Agora começam a cair.',
      nextDays: 3,
      nextTeaser:
        'Em 3 dias, o pico de abstinência vai passar. O corpo começa a respirar.',
    },
    en: {
      tagline: '1 DAY',
      insight:
        'The first 24 hours are biologically the hardest — and you just made it through. Your brain registered something new: you can resist. This moment already changed something in you.',
      bodyFact:
        'In the first hours, cortisol (stress hormone) spikes. Now it starts to fall.',
      nextDays: 3,
      nextTeaser:
        'At 3 days, the withdrawal peak passes. Your body starts to breathe.',
    },
  },
  3: {
    pt: {
      tagline: '3 DIAS',
      insight:
        'O pico de abstinência acontece entre 48 e 72 horas. Você atravessou o momento mais difícil que a biologia reservou pra você. A partir daqui, fica mais leve — não fácil, mas mais leve.',
      bodyFact:
        'Seus receptores de dopamina começam a se recalibrar, voltando a encontrar prazer nas coisas cotidianas.',
      nextDays: 7,
      nextTeaser:
        'Em 7 dias, seu cérebro começa a construir novas conexões neurais de verdade.',
    },
    en: {
      tagline: '3 DAYS',
      insight:
        'Withdrawal peaks between 48 and 72 hours. You just crossed the hardest biological moment ahead of you. From here it gets lighter — not easy, but lighter.',
      bodyFact:
        'Your dopamine receptors start recalibrating, rediscovering pleasure in everyday things.',
      nextDays: 7,
      nextTeaser:
        'At 7 days, your brain starts building real new neural connections.',
    },
  },
  7: {
    pt: {
      tagline: '1 SEMANA',
      insight:
        'Uma semana. O córtex pré-frontal — a região do seu cérebro responsável por autocontrole e decisões — está ficando mais ativo a cada dia que passa. Você está literalmente reconstruindo sua capacidade de escolha.',
      bodyFact:
        'Estudos de neuroimagem mostram mudanças mensuráveis no cérebro já na primeira semana de abstinência.',
      nextDays: 14,
      nextTeaser:
        'Em 14 dias, os impulsos já não vão ter o mesmo poder sobre você.',
    },
    en: {
      tagline: '1 WEEK',
      insight:
        'One week. The prefrontal cortex — the region of your brain responsible for self-control and decisions — is getting more active every day. You are literally rebuilding your capacity to choose.',
      bodyFact:
        'Neuroimaging studies show measurable brain changes after just one week of abstinence.',
      nextDays: 14,
      nextTeaser:
        'At 14 days, cravings will no longer have the same power over you.',
    },
  },
  14: {
    pt: {
      tagline: '2 SEMANAS',
      insight:
        'Duas semanas. O hábito começa a perder a força compulsiva — não porque a vontade sumiu, mas porque você está criando novas vias neurais a cada vez que escolhe diferente. O cérebro aprende o que você pratica.',
      bodyFact:
        'A mielina — substância que torna comportamentos automáticos — começa a se reestruturar ao redor dos seus novos padrões.',
      nextDays: 30,
      nextTeaser:
        '30 dias é onde a ciência começa a chamar isso de mudança de hábito real.',
    },
    en: {
      tagline: '2 WEEKS',
      insight:
        'Two weeks. The habit begins losing its compulsive force — not because the urge is gone, but because you\'re building new neural pathways every time you choose differently. The brain learns what you practice.',
      bodyFact:
        'Myelin — the substance that makes behaviors automatic — starts restructuring around your new patterns.',
      nextDays: 30,
      nextTeaser:
        '30 days is where science starts calling this a real habit change.',
    },
  },
  30: {
    pt: {
      tagline: '1 MÊS',
      insight:
        'Um mês. A neurociência considera este o limiar mínimo para formação de novos hábitos. Você cruzou essa linha. O que parecia uma batalha diária está começando a se tornar o seu novo normal.',
      bodyFact:
        'Pesquisadores da University College London concluíram que a média para formar um novo hábito é 66 dias — você já está na metade.',
      nextDays: 60,
      nextTeaser:
        'Em 60 dias, mudanças que outras pessoas ao seu redor vão começar a perceber.',
    },
    en: {
      tagline: '1 MONTH',
      insight:
        'One month. Neuroscience considers this the minimum threshold for new habit formation. You crossed that line. What felt like a daily battle is starting to become your new normal.',
      bodyFact:
        'University College London researchers found the average time to form a new habit is 66 days — you\'re already halfway.',
      nextDays: 60,
      nextTeaser:
        'At 60 days, changes that people around you will start to notice.',
    },
  },
  60: {
    pt: {
      tagline: '60 DIAS',
      insight:
        'Sessenta dias. Seu sistema nervoso passou por uma reorganização real. O que antes era uma necessidade física agora é genuinamente uma escolha. Você não está mais resistindo — você está vivendo diferente.',
      bodyFact:
        'Com 60 dias, os receptores de dopamina estão significativamente mais sensíveis. Você consegue sentir prazer com muito mais facilidade do que antes.',
      nextDays: 90,
      nextTeaser:
        'Em 90 dias, a maioria dos especialistas considera o hábito transformado de forma estrutural.',
    },
    en: {
      tagline: '60 DAYS',
      insight:
        'Sixty days. Your nervous system went through a real reorganization. What was once a physical need is now genuinely a choice. You\'re not resisting anymore — you\'re just living differently.',
      bodyFact:
        'At 60 days, dopamine receptors are significantly more sensitive. You can feel pleasure far more easily than before.',
      nextDays: 90,
      nextTeaser:
        'At 90 days, most specialists consider the habit structurally transformed.',
    },
  },
  90: {
    pt: {
      tagline: '90 DIAS',
      insight:
        'Noventa dias. Este é o marco que a maioria dos programas de recuperação considera o ponto de virada permanente. Sua memória de trabalho, foco e regulação emocional estão funcionando em um nível significativamente melhor do que há três meses.',
      bodyFact:
        'Com 90 dias, as alterações estruturais no córtex pré-frontal são visíveis em ressonância magnética — seu autocontrole literalmente cresceu.',
      nextDays: 180,
      nextTeaser:
        'Em 180 dias, você vai olhar para trás e mal reconhecer quem lutava com isso.',
    },
    en: {
      tagline: '90 DAYS',
      insight:
        'Ninety days. This is the milestone most recovery programs consider the permanent turning point. Your working memory, focus and emotional regulation are functioning significantly better than three months ago.',
      bodyFact:
        'At 90 days, structural changes in the prefrontal cortex are visible on MRI — your self-control literally grew.',
      nextDays: 180,
      nextTeaser:
        'At 180 days, you\'ll look back and barely recognize the person who struggled with this.',
    },
  },
  180: {
    pt: {
      tagline: '6 MESES',
      insight:
        'Meio ano. Você passou por mais de seis ciclos completos de gatilho — estresse, comemorações, solidão, tédio — e escolheu diferente em cada um. Isso não é força de vontade. Isso é uma nova identidade.',
      bodyFact:
        'Com 180 dias, a densidade sináptica nas regiões de controle de impulso do seu cérebro é mensurável e permanente.',
      nextDays: 365,
      nextTeaser:
        '365 dias é quando a jornada se transforma em identidade. Um ano inteiro.',
    },
    en: {
      tagline: '6 MONTHS',
      insight:
        'Half a year. You went through more than six complete trigger cycles — stress, celebrations, loneliness, boredom — and chose differently each time. This isn\'t willpower. This is a new identity.',
      bodyFact:
        'At 180 days, synaptic density in your brain\'s impulse control regions is measurable and permanent.',
      nextDays: 365,
      nextTeaser:
        '365 days is when the journey becomes identity. A full year.',
    },
  },
  365: {
    pt: {
      tagline: '1 ANO',
      insight:
        'Um ano inteiro. Você não é mais alguém tentando mudar — você é alguém que mudou. Isso agora faz parte de quem você é. A ciência não tem mais o que medir: seu cérebro reescreveu a si mesmo.',
      bodyFact:
        'O hábito antigo agora existe como memória, não como impulso. A rota neural compulsiva foi substituída — de forma permanente.',
      nextDays: null,
      nextTeaser: null,
    },
    en: {
      tagline: '1 YEAR',
      insight:
        'A full year. You are no longer someone trying to change — you are someone who changed. This is part of who you are now. Science has nothing left to measure: your brain rewrote itself.',
      bodyFact:
        'The old habit now exists as memory, not impulse. The compulsive neural route was replaced — permanently.',
      nextDays: null,
      nextTeaser: null,
    },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getReachedMilestones(days: number): number[] {
  return MILESTONES.filter((m) => days >= m);
}

export function getNextMilestone(days: number): number | null {
  return MILESTONES.find((m) => m > days) ?? null;
}

export function checkNewMilestone(
  previousDays: number,
  currentDays: number
): number | null {
  for (const m of MILESTONES) {
    if (previousDays < m && currentDays >= m) return m;
  }
  return null;
}
