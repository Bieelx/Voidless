import { useEffect, useRef } from 'react';
import { MILESTONES } from '../utils/milestones';
import { useTrackerStore } from '../store/useTrackerStore';
import { router } from 'expo-router';

export function useMilestones(trackerId: string, currentDays: number) {
  const prevDaysRef = useRef<number>(currentDays);
  const { celebratedMilestones, markMilestoneCelebrated } = useTrackerStore();

  useEffect(() => {
    const celebrated = celebratedMilestones[trackerId] ?? [];

    for (const milestone of MILESTONES) {
      if (
        currentDays >= milestone &&
        prevDaysRef.current < milestone &&
        !celebrated.includes(milestone)
      ) {
        markMilestoneCelebrated(trackerId, milestone);
        router.push({
          pathname: '/milestone',
          params: { days: String(milestone), trackerId },
        });
        break;
      }
    }

    prevDaysRef.current = currentDays;
  }, [currentDays, trackerId, celebratedMilestones, markMilestoneCelebrated]);
}
