import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useTrackerStore } from '../store/useTrackerStore';
import { MILESTONES, MILESTONE_PHRASES } from '../utils/milestones';

export default function DevMenu() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const {
    devTimeOffsetDays,
    setDevTimeOffset,
    setPremium,
    isPremium,
    resetAllData,
    activeTrackerId,
  } = useTrackerStore();

  const [offsetInput, setOffsetInput] = useState(String(devTimeOffsetDays));

  const applyOffset = () => {
    const n = parseInt(offsetInput, 10);
    setDevTimeOffset(isNaN(n) ? 0 : Math.max(0, n));
  };

  const triggerMilestone = (days: number) => {
    router.push({
      pathname: '/milestone',
      params: { days: String(days), trackerId: activeTrackerId ?? '' },
    });
  };

  const bg = colors.bg.primary;
  const card = colors.bg.card;
  const border = colors.border;

  const Row = ({ children }: { children: React.ReactNode }) => (
    <View style={[styles.row, { borderColor: border }]}>{children}</View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <Text style={[styles.backIcon, { color: colors.text.secondary }]}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.accent.primary }]}>⚙ Dev Menu</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── TIME OFFSET ── */}
        <Animated.View entering={FadeInDown.delay(0).duration(350)}>
          <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
            TIME OFFSET
          </Text>
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <Text style={[styles.desc, { color: colors.text.secondary }]}>
              Add days to simulate time passing. The counter will behave as if N days have elapsed beyond the real elapsed time.
            </Text>
            <View style={styles.offsetRow}>
              <TextInput
                style={[styles.offsetInput, { color: colors.text.primary, borderColor: colors.accent.secondary }]}
                keyboardType="number-pad"
                value={offsetInput}
                onChangeText={setOffsetInput}
                placeholderTextColor={colors.text.muted}
                placeholder="0"
              />
              <Text style={[styles.offsetUnit, { color: colors.text.muted }]}>days</Text>
              <Pressable
                style={[styles.applyBtn, { backgroundColor: colors.accent.secondary }]}
                onPress={applyOffset}
              >
                <Text style={[styles.applyText, { color: colors.bg.primary }]}>Apply</Text>
              </Pressable>
            </View>
            {devTimeOffsetDays > 0 && (
              <View style={[styles.activeBadge, { borderColor: colors.accent.primary }]}>
                <Text style={[styles.activeBadgeText, { color: colors.accent.primary }]}>
                  ● Active offset: +{devTimeOffsetDays} days
                </Text>
                <Pressable onPress={() => { setDevTimeOffset(0); setOffsetInput('0'); }}>
                  <Text style={[styles.clearBtn, { color: colors.danger }]}>clear</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>

        {/* ── TRIGGER MILESTONES ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(350)}>
          <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
            TRIGGER MILESTONE
          </Text>
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            <Text style={[styles.desc, { color: colors.text.secondary }]}>
              Preview any milestone screen instantly.
            </Text>
            <View style={styles.milestoneGrid}>
              {MILESTONES.map((m) => (
                <Pressable
                  key={m}
                  style={[styles.milestoneBtn, { borderColor: colors.accent.secondary }]}
                  onPress={() => triggerMilestone(m)}
                >
                  <Text style={[styles.milestoneDays, { color: colors.accent.primary }]}>{m}</Text>
                  <Text style={[styles.milestoneDaysLabel, { color: colors.text.muted }]}>d</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* ── MILESTONE PHRASES PREVIEW ── */}
        <Animated.View entering={FadeInDown.delay(160).duration(350)}>
          <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
            MILESTONE PHRASES
          </Text>
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            {MILESTONES.map((m, i) => (
              <View key={m}>
                <View style={styles.phraseRow}>
                  <Text style={[styles.phraseDay, { color: colors.accent.primary }]}>{m}d</Text>
                  <Text style={[styles.phraseText, { color: colors.text.secondary }]}>
                    {MILESTONE_PHRASES[m]}
                  </Text>
                </View>
                {i < MILESTONES.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: border }]} />
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── QUICK ACTIONS ── */}
        <Animated.View entering={FadeInDown.delay(240).duration(350)}>
          <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
            QUICK ACTIONS
          </Text>
          <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
            {/* Toggle premium */}
            <Pressable
              style={[styles.actionRow, { borderColor: border }]}
              onPress={() => setPremium(!isPremium)}
            >
              <Text style={[styles.actionLabel, { color: colors.text.primary }]}>
                {isPremium ? '✓ Premium ON' : '✗ Premium OFF'}
              </Text>
              <Text style={[styles.actionHint, { color: isPremium ? colors.accent.primary : colors.text.muted }]}>
                tap to toggle
              </Text>
            </Pressable>

            {/* Reset all */}
            <View style={[styles.divider, { backgroundColor: border }]} />
            <Pressable
              style={styles.actionRow}
              onPress={() =>
                Alert.alert('Reset everything?', 'All trackers and data will be deleted.', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                      await resetAllData();
                      router.replace('/onboarding');
                    },
                  },
                ])
              }
            >
              <Text style={[styles.actionLabel, { color: colors.danger }]}>
                Reset all data
              </Text>
              <Text style={[styles.actionHint, { color: colors.text.muted }]}>destructive</Text>
            </Pressable>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backIcon: { fontSize: 22, fontWeight: '300' },
  title: { fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
  scroll: { paddingHorizontal: 16, paddingTop: 4 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.5,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 4,
  },
  desc: { fontSize: 12, lineHeight: 18, marginBottom: 14 },
  // Time offset
  offsetRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  offsetInput: {
    fontSize: 24,
    fontWeight: '200',
    width: 80,
    borderBottomWidth: 1,
    paddingBottom: 4,
    textAlign: 'center',
  },
  offsetUnit: { fontSize: 13 },
  applyBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  applyText: { fontSize: 13, fontWeight: '600' },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  activeBadgeText: { fontSize: 12 },
  clearBtn: { fontSize: 12, fontWeight: '500' },
  // Milestones grid
  milestoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  milestoneBtn: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  milestoneDays: { fontSize: 18, fontWeight: '200' },
  milestoneDaysLabel: { fontSize: 11 },
  // Phrase list
  phraseRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  phraseDay: { fontSize: 12, fontWeight: '600', width: 36, marginTop: 2 },
  phraseText: { fontSize: 13, flex: 1, lineHeight: 18, fontStyle: 'italic' },
  divider: { height: 0.5, marginVertical: 2 },
  // Actions
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  actionLabel: { fontSize: 15, fontWeight: '400' },
  actionHint: { fontSize: 12 },
  row: { borderBottomWidth: 0.5, paddingVertical: 14 },
});
