import { useState, useEffect, useRef, useCallback } from 'react';
import { getTimeSince, getLastRelapseOrStart, type TimeDiff } from '../utils/time';
import { useTrackerStore } from '../store/useTrackerStore';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function useCounter(startDate: string, relapses: string[]): TimeDiff {
  const devTimeOffsetDays = useTrackerStore((s) => s.devTimeOffsetDays);
  const effectiveStart = getLastRelapseOrStart(startDate, relapses);

  // Apply dev offset: shift start date back to simulate more time passing
  const shiftedStart = devTimeOffsetDays > 0
    ? new Date(new Date(effectiveStart).getTime() - devTimeOffsetDays * MS_PER_DAY).toISOString()
    : effectiveStart;

  const [time, setTime] = useState<TimeDiff>(() => getTimeSince(shiftedStart));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shiftedStartRef = useRef(shiftedStart);
  shiftedStartRef.current = shiftedStart;

  const update = useCallback(() => {
    setTime(getTimeSince(shiftedStartRef.current));
  }, []);

  useEffect(() => {
    update();
    intervalRef.current = setInterval(update, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [update, shiftedStart]);

  return time;
}
