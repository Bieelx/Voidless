import type { Language } from './quotes';

export interface Strings {
  // Counter labels
  days: string;
  hours: string;
  minutes: string;
  // Stats
  saved: string;
  relapses: string;
  bestStreak: string;
  // Relapse modal
  relapseTitle: string;
  relapseSubtitle: string;
  startAgain: string;
  // Settings
  settings: string;
  appearance: string;
  themeLabel: string;
  premiumOnly: string;
  preferences: string;
  languageLabel: string;
  subscription: string;
  currentPlan: string;
  freePlan: string;
  proPlan: string;
  upgrade: string;
  manageSubscription: string;
  tools: string;
  appBlocking: string;
  appBlockingDesc: string;
  dangerZone: string;
  resetData: string;
  resetConfirm: string;
  resetConfirmMsg: string;
  cancel: string;
  confirm: string;
  version: string;
  // App blocking
  focusMode: string;
  blockApps: string;
  blockAppsDesc: string;
  comingSoon: string;
  scheduledBlocking: string;
  // Dev menu
  devMenu: string;
  timeOffset: string;
  timeOffsetDesc: string;
  triggerMilestone: string;
  forcePremium: string;
  resetAllData: string;
  days_label: string;
  // Onboarding
  whatLeaving: string;
  nameHabit: string;
  moneySaved: string;
  continueBtn: string;
  // Trackers
  yourHabits: string;
  keepGoing: string;
  newTracker: string;
  habitName: string;
  currentStreak: string;
  // Home
  noTracker: string;
  createOne: string;
}

export const STRINGS: Record<Language, Strings> = {
  en: {
    days: 'DAYS',
    hours: 'HOURS',
    minutes: 'MINUTES',
    saved: 'saved',
    relapses: 'relapses',
    bestStreak: 'best streak',
    relapseTitle: 'it happens.',
    relapseSubtitle: 'your counter has been reset. the journey continues.',
    startAgain: 'start again',
    settings: 'Settings',
    appearance: 'Appearance',
    themeLabel: 'Theme',
    premiumOnly: 'Premium',
    preferences: 'Preferences',
    languageLabel: 'Language',
    subscription: 'Subscription',
    currentPlan: 'Current plan',
    freePlan: 'Free',
    proPlan: 'Voidless Pro',
    upgrade: 'Upgrade to Pro',
    manageSubscription: 'Manage subscription',
    tools: 'Tools',
    appBlocking: 'App Blocking',
    appBlockingDesc: 'Block distracting apps during vulnerable moments.',
    dangerZone: 'Danger Zone',
    resetData: 'Reset all data',
    resetConfirm: 'Reset everything?',
    resetConfirmMsg: 'This will delete all your trackers and history. This cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Reset',
    version: 'Version',
    focusMode: 'Focus Mode',
    blockApps: 'Block Apps',
    blockAppsDesc: 'Prevent access to triggering apps during high-risk moments.',
    comingSoon: 'Coming soon',
    scheduledBlocking: 'Scheduled Blocking',
    devMenu: 'Dev Menu',
    timeOffset: 'Time Offset',
    timeOffsetDesc: 'Add days to simulate time passing',
    triggerMilestone: 'Trigger Milestone',
    forcePremium: 'Force Premium',
    resetAllData: 'Reset All Data',
    days_label: 'days',
    whatLeaving: 'what are you leaving behind?',
    nameHabit: 'name your habit...',
    moneySaved: 'money saved per day ($) — optional',
    continueBtn: 'continue',
    yourHabits: 'Trackers',
    keepGoing: "Keep going, you're doing great.",
    newTracker: 'new tracker',
    habitName: 'habit name',
    currentStreak: 'Current Streak',
    noTracker: 'no active tracker',
    createOne: 'create one',
  },
  pt: {
    days: 'DIAS',
    hours: 'HORAS',
    minutes: 'MINUTOS',
    saved: 'economizado',
    relapses: 'recaídas',
    bestStreak: 'melhor sequência',
    relapseTitle: 'acontece.',
    relapseSubtitle: 'seu contador foi zerado. a jornada continua.',
    startAgain: 'começar de novo',
    settings: 'Configurações',
    appearance: 'Aparência',
    themeLabel: 'Tema',
    premiumOnly: 'Premium',
    preferences: 'Preferências',
    languageLabel: 'Idioma',
    subscription: 'Assinatura',
    currentPlan: 'Plano atual',
    freePlan: 'Gratuito',
    proPlan: 'Voidless Pro',
    upgrade: 'Assinar Pro',
    manageSubscription: 'Gerenciar assinatura',
    tools: 'Ferramentas',
    appBlocking: 'Bloqueio de Apps',
    appBlockingDesc: 'Bloqueie apps que ativam seus gatilhos.',
    dangerZone: 'Zona de Perigo',
    resetData: 'Apagar todos os dados',
    resetConfirm: 'Apagar tudo?',
    resetConfirmMsg: 'Isso vai deletar todos os seus trackers e histórico. Não pode ser desfeito.',
    cancel: 'Cancelar',
    confirm: 'Apagar',
    version: 'Versão',
    focusMode: 'Modo Foco',
    blockApps: 'Bloquear Apps',
    blockAppsDesc: 'Impede acesso a apps gatilho em momentos de risco.',
    comingSoon: 'Em breve',
    scheduledBlocking: 'Bloqueio Agendado',
    devMenu: 'Menu Dev',
    timeOffset: 'Deslocamento de Tempo',
    timeOffsetDesc: 'Adicione dias para simular o passar do tempo',
    triggerMilestone: 'Disparar Marco',
    forcePremium: 'Forçar Premium',
    resetAllData: 'Apagar Todos os Dados',
    days_label: 'dias',
    whatLeaving: 'o que você está deixando para trás?',
    nameHabit: 'nomeie o seu hábito...',
    moneySaved: 'dinheiro economizado por dia (R$) — opcional',
    continueBtn: 'continuar',
    yourHabits: 'Hábitos',
    keepGoing: 'Continue assim, você está indo bem.',
    newTracker: 'novo tracker',
    habitName: 'nome do hábito',
    currentStreak: 'Sequência Atual',
    noTracker: 'nenhum tracker ativo',
    createOne: 'criar um',
  },
};
