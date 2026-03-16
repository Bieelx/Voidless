import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { colors, typography } from '../constants/theme';
import ProgressRing from './ProgressRing';
import { getDaysSince, getLastRelapseOrStart } from '../utils/time';
import type { Tracker } from '../store/useTrackerStore';

interface TrackerCardProps {
  tracker: Tracker;
  onPress: () => void;
  onArchive?: () => void;
  index?: number;
}

function getWeekProgress(tracker: Tracker): number {
  const effectiveStart = getLastRelapseOrStart(
    tracker.startDate,
    tracker.relapses
  );
  const days = getDaysSince(effectiveStart);
  return Math.min(1, (days % 7) / 7 || (days >= 7 ? 1 : 0));
}

export default function TrackerCard({
  tracker,
  onPress,
  index = 0,
}: TrackerCardProps) {
  const effectiveStart = getLastRelapseOrStart(
    tracker.startDate,
    tracker.relapses
  );
  const days = getDaysSince(effectiveStart);
  const weekProgress = getWeekProgress(tracker);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(400).springify()}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.card, animStyle]}>
          <Animated.View style={styles.left}>
            <Animated.Text style={styles.name}>{tracker.name}</Animated.Text>
            <Animated.Text style={styles.days}>{days} days</Animated.Text>
            <Animated.Text style={styles.daysLabel}>Current Streak</Animated.Text>
          </Animated.View>
          <Animated.View style={styles.right}>
            <ProgressRing progress={weekProgress} />
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  left: {
    flex: 1,
  },
  name: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  days: {
    fontSize: 26,
    fontWeight: '300' as const,
    color: colors.accent.primary,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  daysLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 4,
  },
  right: {
    marginLeft: 16,
  },
});
