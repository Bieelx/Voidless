import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';
import { formatCurrency, calculateMoneySaved } from '../utils/money';
import type { Tracker } from '../store/useTrackerStore';
import { getLastRelapseOrStart, getDaysSince } from '../utils/time';

interface StatsRowProps {
  tracker: Tracker;
}

function getBestStreak(tracker: Tracker): number {
  const dates = [tracker.startDate, ...tracker.relapses];
  let best = 0;

  for (let i = 0; i < dates.length; i++) {
    const start = new Date(dates[i]).getTime();
    const end =
      i < dates.length - 1
        ? new Date(dates[i + 1]).getTime()
        : Date.now();
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    if (days > best) best = days;
  }

  return best;
}

export default function StatsRow({ tracker }: StatsRowProps) {
  const saved = calculateMoneySaved(
    tracker.startDate,
    tracker.relapses,
    tracker.moneySavedPerDay
  );
  const resisted = tracker.relapses.length;
  const bestStreak = getBestStreak(tracker);

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.value}>{formatCurrency(saved)}</Text>
        <Text style={styles.label}>saved</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.value}>{resisted}</Text>
        <Text style={styles.label}>relapses</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.value}>{bestStreak}d</Text>
        <Text style={styles.label}>best streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  stat: {
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.accent.primary,
  },
  label: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 4,
  },
});
