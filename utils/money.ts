export function calculateMoneySaved(
  startDate: string,
  relapses: string[],
  moneySavedPerDay: number
): number {
  const effectiveStart =
    relapses.length > 0
      ? relapses[relapses.length - 1]
      : startDate;

  const now = Date.now();
  const start = new Date(effectiveStart).getTime();
  const diffMs = Math.max(0, now - start);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.floor(diffDays * moneySavedPerDay * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
