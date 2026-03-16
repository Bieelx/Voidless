export const colors = {
  bg: {
    primary: '#0A0A0A',
    secondary: '#111111',
    card: '#1A1A1A',
  },
  accent: {
    primary: '#C8B8F5',
    secondary: '#7F77DD',
  },
  text: {
    primary: '#F5F5F3',
    secondary: '#888780',
    muted: '#444441',
  },
  border: 'rgba(255,255,255,0.07)',
  danger: '#E24B4A',
};

export const typography = {
  heroCounter: {
    fontSize: 72,
    fontWeight: '200' as const,
    letterSpacing: -2,
  },
  heroUnit: {
    fontSize: 18,
    fontWeight: '300' as const,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
