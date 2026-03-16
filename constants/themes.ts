export type ThemeKey = 'void' | 'amoled' | 'forest' | 'ember';

export interface ColorScheme {
  bg: { primary: string; secondary: string; card: string };
  accent: { primary: string; secondary: string };
  text: { primary: string; secondary: string; muted: string };
  border: string;
  danger: string;
}

export interface Theme {
  key: ThemeKey;
  name: string;
  nameEn: string;
  isPremium: boolean;
  colors: ColorScheme;
}

export const THEMES: Record<ThemeKey, Theme> = {
  void: {
    key: 'void',
    name: 'Void',
    nameEn: 'Void',
    isPremium: false,
    colors: {
      bg: { primary: '#0A0A0A', secondary: '#111111', card: '#1A1A1A' },
      accent: { primary: '#C8B8F5', secondary: '#7F77DD' },
      text: { primary: '#F5F5F3', secondary: '#888780', muted: '#444441' },
      border: 'rgba(255,255,255,0.07)',
      danger: '#E24B4A',
    },
  },
  amoled: {
    key: 'amoled',
    name: 'Amoled',
    nameEn: 'Amoled',
    isPremium: true,
    colors: {
      bg: { primary: '#000000', secondary: '#0A0A0A', card: '#111111' },
      accent: { primary: '#A78BFA', secondary: '#7C3AED' },
      text: { primary: '#FFFFFF', secondary: '#999999', muted: '#444444' },
      border: 'rgba(255,255,255,0.06)',
      danger: '#F87171',
    },
  },
  forest: {
    key: 'forest',
    name: 'Floresta',
    nameEn: 'Forest',
    isPremium: true,
    colors: {
      bg: { primary: '#080F0A', secondary: '#0F1A12', card: '#141F17' },
      accent: { primary: '#86EFAC', secondary: '#22C55E' },
      text: { primary: '#F0F9F2', secondary: '#7A9E82', muted: '#3D5C44' },
      border: 'rgba(134,239,172,0.08)',
      danger: '#F87171',
    },
  },
  ember: {
    key: 'ember',
    name: 'Brasa',
    nameEn: 'Ember',
    isPremium: true,
    colors: {
      bg: { primary: '#0F0905', secondary: '#1C1108', card: '#231510' },
      accent: { primary: '#FCD34D', secondary: '#D97706' },
      text: { primary: '#FFF9F0', secondary: '#A68C6E', muted: '#5C4A38' },
      border: 'rgba(252,211,77,0.08)',
      danger: '#F87171',
    },
  },
};

export const THEME_ORDER: ThemeKey[] = ['void', 'amoled', 'forest', 'ember'];
export const PREMIUM_THEMES: ThemeKey[] = ['amoled', 'forest', 'ember'];
