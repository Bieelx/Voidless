export type Language = 'en' | 'pt';

// Daily motivational quotes — rotates by day of year
export const DAILY_QUOTES: Record<Language, string[]> = {
  en: [
    'every day without it is a day you chose yourself.',
    'the urge passes. it always does.',
    "you're not fighting something. you're building something.",
    "the version of you from a year ago couldn't imagine this.",
    'discomfort is the price of change. pay it willingly.',
    'your future self is watching. keep going.',
    'the craving is just noise. you are the signal.',
    'one decision at a time. that\'s all this is.',
    "the hardest part is already done. you showed up today.",
    "freedom isn't the absence of wanting. it's the mastery of it.",
    "you've survived every bad day so far. this one too.",
    "the gap between who you were and who you are — that's you.",
    'silence the habit. amplify yourself.',
    "each day is a vote for the person you're becoming.",
    "strength isn't not wanting it. it's choosing not to have it.",
    'your body is healing. your mind is rewiring.',
    "don't count the days. make the days count.",
    'the version of you reading this already won something today.',
    "clarity doesn't come from the habit. it comes from releasing it.",
    'you are not the urge. you are the one who watches it pass.',
  ],
  pt: [
    'cada dia sem isso é um dia em que você escolheu a si mesmo.',
    'a vontade passa. sempre passa.',
    'você não está fugindo de algo. está construindo algo.',
    'a versão de você de um ano atrás não imagina onde está.',
    'o desconforto é o preço da mudança. pague com vontade.',
    'seu eu do futuro está vendo. continue.',
    'o desejo é só ruído. você é o sinal.',
    'uma decisão de cada vez. é só isso.',
    'a parte mais difícil já passou. você apareceu hoje.',
    'liberdade não é não querer. é dominar o querer.',
    'você sobreviveu a todos os dias difíceis até aqui.',
    'o espaço entre quem você era e quem você é — isso é você.',
    'silencie o hábito. amplifique a si mesmo.',
    'cada dia é um voto pela pessoa que você está se tornando.',
    'força não é não querer. é escolher não ter.',
    'seu corpo está se curando. sua mente está se reconfigurando.',
    'não conte os dias. faça os dias contarem.',
    'a versão de você que lê isso já venceu algo hoje.',
    'clareza não vem do hábito. vem de largá-lo.',
    'você não é o impulso. você é quem assiste ele passar.',
  ],
};

// Post-relapse quotes — compassionate, no judgment
export const RELAPSE_QUOTES: Record<Language, string[]> = {
  en: [
    "falling doesn't erase the ground you've covered.",
    'the path back starts here, right now.',
    'you know how to do this. you\'ve done it before.',
    "every comeback starts with a restart. this is yours.",
    "one setback doesn't undo what you've built.",
    "the fact that you're tracking this means you haven't given up.",
    "you fell. now you know where the ground is. get up.",
    'this is data, not defeat. learn. start again.',
    'recovery is not a straight line. keep drawing it.',
    'what matters is that you start again. right now.',
    "the streak ends. the journey doesn't.",
    "be as kind to yourself as you'd be to a friend.",
    'this moment does not define you. what you do next does.',
    'the hardest step is always the next one. take it.',
    "you're still here. that's everything.",
  ],
  pt: [
    'cair não apaga o caminho que você percorreu.',
    'o caminho de volta começa aqui, agora.',
    'você sabe como fazer isso. já fez antes.',
    'todo recomeço começa com um restart. esse é o seu.',
    'um tropeço não desfaz o que você construiu.',
    'o fato de você registrar isso significa que não desistiu.',
    'você caiu. agora sabe onde está o chão. levanta.',
    'isso é dado, não derrota. aprenda. comece de novo.',
    'recuperação não é uma linha reta. continue desenhando.',
    'o que importa é você começar de novo. agora.',
    'a sequência acaba. a jornada não.',
    'seja tão gentil consigo quanto seria com um amigo.',
    'este momento não te define. o que você faz agora sim.',
    'o passo mais difícil é sempre o próximo. dê-o.',
    'você ainda está aqui. isso é tudo.',
  ],
};

export function getDailyQuote(lang: Language): string {
  const quotes = DAILY_QUOTES[lang];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return quotes[dayOfYear % quotes.length];
}

export function getRandomRelapseQuote(lang: Language): string {
  const quotes = RELAPSE_QUOTES[lang];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
