import React, { createContext, useContext } from 'react';
import { THEMES, type ColorScheme } from '../constants/themes';
import { useTrackerStore } from '../store/useTrackerStore';

const ThemeContext = createContext<ColorScheme>(THEMES.void.colors);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeKey = useTrackerStore((s) => s.theme);
  const isPremium = useTrackerStore((s) => s.isPremium);

  // Only apply premium themes if user is premium; fallback to void otherwise
  const effectiveKey =
    THEMES[themeKey]?.isPremium && !isPremium ? 'void' : themeKey;

  return (
    <ThemeContext.Provider value={THEMES[effectiveKey].colors}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ColorScheme {
  return useContext(ThemeContext);
}
