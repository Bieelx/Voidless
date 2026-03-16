export interface TimeDiff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getTimeSince(startDate: string): TimeDiff {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const totalMs = Math.max(0, now - start);

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalMs };
}

export function formatDays(days: number): string {
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function formatTimeCompact(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
}

export function getDaysSince(startDate: string): number {
  return getTimeSince(startDate).days;
}

export function getLastRelapseOrStart(
  startDate: string,
  relapses: string[]
): string {
  if (relapses.length === 0) return startDate;
  return relapses[relapses.length - 1];
}
