export const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365];

export const MILESTONE_PHRASES: Record<number, string> = {
  1: 'the hardest day is behind you.',
  3: 'three days of choosing yourself.',
  7: 'a full week. that\'s real.',
  14: 'two weeks. the habit is weakening.',
  30: 'one month. you rewired something.',
  60: 'sixty days. this is who you are now.',
  90: 'ninety days. the science says you\'re free.',
  180: 'half a year. extraordinary.',
  365: 'a full year. you did it.',
};

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
    if (previousDays < m && currentDays >= m) {
      return m;
    }
  }
  return null;
}
