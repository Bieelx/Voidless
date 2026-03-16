# Voidless — Beta

Addiction counter app. Minimal, dark-first, aesthetic-focused.

## Quick Start

```bash
cd voidless
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android).

## Structure

- `app/` — Expo Router screens (onboarding, home, trackers, milestone, paywall)
- `components/` — Reusable UI (CounterDisplay, RelapseButton, ProgressRing, etc.)
- `store/` — Zustand state management + AsyncStorage persistence
- `hooks/` — useCounter (real-time), useMilestones (detection)
- `utils/` — Time formatting, money calc, milestone definitions
- `constants/` — Design system (colors, typography, spacing)

## Beta Notes

- Offline-first — all data in AsyncStorage
- Paywall is mocked (both buttons just enable premium locally)
- Share on milestone screen is stubbed for stability
- Free tier limit: 2 active trackers
