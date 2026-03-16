import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTrackerStore } from '../store/useTrackerStore';
import { useCounter } from '../hooks/useCounter';
import { useMilestones } from '../hooks/useMilestones';
import { useTheme } from '../contexts/ThemeContext';
import { useStrings } from '../hooks/useStrings';
import { getLastRelapseOrStart } from '../utils/time';
import CounterDisplay from '../components/CounterDisplay';
import StatsRow from '../components/StatsRow';
import RelapseButton from '../components/RelapseButton';
import DailyQuote from '../components/DailyQuote';
import RelapseModal from '../components/RelapseModal';
import { spacing } from '../constants/theme';

export default function Home() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const s = useStrings();
  const { trackers, activeTrackerId, relapse } = useTrackerStore();

  const activeTracker = trackers.find(
    (t) => t.id === activeTrackerId && !t.isArchived
  );

  if (!activeTracker) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg.primary, paddingTop: insets.top }]}>
        <Animated.View style={styles.emptyContainer} entering={FadeIn.duration(600)}>
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>{s.noTracker}</Text>
          <Pressable onPress={() => router.push('/onboarding')}>
            <Text style={[styles.emptyAction, { color: colors.accent.primary }]}>{s.createOne}</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <HomeContent
      tracker={activeTracker}
      onRelapse={() => relapse(activeTracker.id)}
      topInset={insets.top}
      bottomInset={insets.bottom}
    />
  );
}

function HomeContent({
  tracker,
  onRelapse,
  topInset,
  bottomInset,
}: {
  tracker: NonNullable<ReturnType<typeof useTrackerStore.getState>['trackers'][0]>;
  onRelapse: () => void;
  topInset: number;
  bottomInset: number;
}) {
  const colors = useTheme();
  const { days } = useCounter(tracker.startDate, tracker.relapses);
  const [showRelapseModal, setShowRelapseModal] = useState(false);

  useMilestones(tracker.id, days);

  const handleRelapse = useCallback(() => {
    onRelapse();
    setShowRelapseModal(true);
  }, [onRelapse]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg.primary,
          paddingTop: topInset + 16,
          paddingBottom: bottomInset + 16,
        },
      ]}
    >
      {/* Ambient glow */}
      <View
        style={[styles.ambientGlow, { backgroundColor: `${colors.accent.primary}08` }]}
        pointerEvents="none"
      />

      {/* Top bar */}
      <Animated.View style={styles.topBar} entering={FadeInDown.duration(500).delay(100)}>
        <Text style={[styles.habitName, { color: colors.text.secondary }]}>
          {tracker.name.toUpperCase()}
        </Text>
        <Pressable
          onPress={() => router.push('/trackers')}
          style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.5 }]}
        >
          <View style={[styles.iconLine, { backgroundColor: colors.text.secondary }]} />
          <View style={[styles.iconLine, { width: 14, backgroundColor: colors.text.secondary }]} />
          <View style={[styles.iconLine, { width: 10, backgroundColor: colors.text.secondary }]} />
        </Pressable>
      </Animated.View>

      {/* Counter */}
      <Animated.View style={styles.counterWrapper} entering={FadeIn.duration(700).delay(200)}>
        <CounterDisplay startDate={tracker.startDate} relapses={tracker.relapses} />
      </Animated.View>

      {/* Daily quote */}
      <Animated.View entering={FadeInUp.duration(500).delay(350)}>
        <DailyQuote />
      </Animated.View>

      {/* Divider */}
      <Animated.View
        style={[styles.sectionDivider, { backgroundColor: colors.border }]}
        entering={FadeIn.duration(500).delay(450)}
      />

      {/* Stats */}
      <Animated.View entering={FadeInUp.duration(500).delay(500)}>
        <StatsRow tracker={tracker} />
      </Animated.View>

      {/* Relapse button */}
      <Animated.View style={styles.bottomArea} entering={FadeInUp.duration(500).delay(600)}>
        <RelapseButton onRelapse={handleRelapse} />
      </Animated.View>

      {/* Post-relapse modal */}
      <RelapseModal
        visible={showRelapseModal}
        onDismiss={() => setShowRelapseModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  ambientGlow: {
    position: 'absolute',
    top: '18%',
    left: '50%',
    marginLeft: -180,
    width: 360,
    height: 360,
    borderRadius: 180,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  habitName: {
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 3,
  },
  settingsBtn: {
    gap: 4,
    paddingVertical: 4,
    paddingLeft: 8,
    alignItems: 'flex-end',
  },
  iconLine: {
    height: 1.5,
    width: 18,
    borderRadius: 2,
  },
  counterWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionDivider: {
    height: 0.5,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: 0,
  },
  bottomArea: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    marginTop: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '400',
  },
  emptyAction: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: spacing.md,
  },
});
