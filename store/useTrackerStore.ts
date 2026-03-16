import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeKey } from '../constants/themes';
import type { Language } from '../constants/quotes';

const STORAGE_KEY = '@voidless_trackers';
const PREMIUM_KEY = '@voidless_premium';
const PREFS_KEY = '@voidless_prefs';

export interface Tracker {
  id: string;
  name: string;
  startDate: string;
  relapses: string[];
  moneySavedPerDay: number;
  isArchived: boolean;
}

interface TrackerStore {
  trackers: Tracker[];
  activeTrackerId: string | null;
  isPremium: boolean;
  celebratedMilestones: Record<string, number[]>;
  isLoaded: boolean;
  // Theming & prefs
  theme: ThemeKey;
  language: Language;
  // Dev
  devTimeOffsetDays: number;

  addTracker: (name: string, moneySavedPerDay: number) => void;
  relapse: (id: string) => void;
  archiveTracker: (id: string) => void;
  setActiveTracker: (id: string) => void;
  setPremium: (value: boolean) => void;
  markMilestoneCelebrated: (trackerId: string, milestone: number) => void;
  setTheme: (theme: ThemeKey) => void;
  setLanguage: (lang: Language) => void;
  setDevTimeOffset: (days: number) => void;
  resetAllData: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  persistToStorage: () => Promise<void>;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export const useTrackerStore = create<TrackerStore>((set, get) => ({
  trackers: [],
  activeTrackerId: null,
  isPremium: false,
  celebratedMilestones: {},
  isLoaded: false,
  theme: 'void',
  language: 'pt',
  devTimeOffsetDays: 0,

  addTracker: (name, moneySavedPerDay) => {
    const id = generateId();
    const newTracker: Tracker = {
      id,
      name,
      startDate: new Date().toISOString(),
      relapses: [],
      moneySavedPerDay,
      isArchived: false,
    };
    set((state) => ({
      trackers: [...state.trackers, newTracker],
      activeTrackerId: id,
    }));
    get().persistToStorage();
  },

  relapse: (id) => {
    set((state) => ({
      trackers: state.trackers.map((t) =>
        t.id === id
          ? { ...t, relapses: [...t.relapses, new Date().toISOString()] }
          : t
      ),
    }));
    get().persistToStorage();
  },

  archiveTracker: (id) => {
    set((state) => {
      const updated = state.trackers.map((t) =>
        t.id === id ? { ...t, isArchived: true } : t
      );
      const remaining = updated.filter((t) => !t.isArchived);
      return {
        trackers: updated,
        activeTrackerId:
          state.activeTrackerId === id
            ? remaining[0]?.id ?? null
            : state.activeTrackerId,
      };
    });
    get().persistToStorage();
  },

  setActiveTracker: (id) => set({ activeTrackerId: id }),

  setPremium: (value) => {
    set({ isPremium: value });
    get().persistToStorage();
  },

  markMilestoneCelebrated: (trackerId, milestone) => {
    set((state) => {
      const current = state.celebratedMilestones[trackerId] ?? [];
      if (current.includes(milestone)) return state;
      return {
        celebratedMilestones: {
          ...state.celebratedMilestones,
          [trackerId]: [...current, milestone],
        },
      };
    });
    get().persistToStorage();
  },

  setTheme: (theme) => {
    set({ theme });
    get().persistToStorage();
  },

  setLanguage: (language) => {
    set({ language });
    get().persistToStorage();
  },

  setDevTimeOffset: (days) => {
    set({ devTimeOffsetDays: days });
  },

  resetAllData: async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem(PREMIUM_KEY),
      AsyncStorage.removeItem(PREFS_KEY),
    ]);
    set({
      trackers: [],
      activeTrackerId: null,
      isPremium: false,
      celebratedMilestones: {},
      theme: 'void',
      language: 'pt',
      devTimeOffsetDays: 0,
    });
  },

  loadFromStorage: async () => {
    try {
      const [trackersJson, premiumJson, prefsJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(PREMIUM_KEY),
        AsyncStorage.getItem(PREFS_KEY),
      ]);

      const trackers: Tracker[] = trackersJson ? JSON.parse(trackersJson) : [];
      const premiumData = premiumJson ? JSON.parse(premiumJson) : {};
      const prefs = prefsJson ? JSON.parse(prefsJson) : {};

      set({
        trackers,
        isPremium: premiumData.isPremium ?? false,
        celebratedMilestones: premiumData.celebratedMilestones ?? {},
        activeTrackerId: trackers.filter((t) => !t.isArchived)[0]?.id ?? null,
        theme: prefs.theme ?? 'void',
        language: prefs.language ?? 'pt',
        isLoaded: true,
      });
    } catch (e) {
      console.error('Failed to load from storage:', e);
      set({ isLoaded: true });
    }
  },

  persistToStorage: async () => {
    try {
      const {
        trackers,
        isPremium,
        celebratedMilestones,
        theme,
        language,
      } = get();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trackers)),
        AsyncStorage.setItem(
          PREMIUM_KEY,
          JSON.stringify({ isPremium, celebratedMilestones })
        ),
        AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ theme, language })),
      ]);
    } catch (e) {
      console.error('Failed to persist to storage:', e);
    }
  },
}));
