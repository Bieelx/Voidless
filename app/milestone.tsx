import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Share,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { MILESTONE_INSIGHTS, MILESTONE_PHRASES } from '../utils/milestones';
import { useTheme } from '../contexts/ThemeContext';
import { useTrackerStore } from '../store/useTrackerStore';
import { spacing } from '../constants/theme';

// ── Radial spotlight ──────────────────────────────────────────────────────────

function RadialGlow({ accentColor }: { accentColor: string }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) }));
    scale.value = withDelay(100, withSpring(1, { damping: 18, stiffness: 55 }));
  }, [scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const c = accentColor;

  return (
    <Animated.View style={[styles.glowRoot, animStyle]} pointerEvents="none">
      {[
        { size: 560, opacity: 0.018 },
        { size: 400, opacity: 0.03  },
        { size: 270, opacity: 0.045 },
        { size: 160, opacity: 0.06  },
        { size: 80,  opacity: 0.08  },
      ].map(({ size, opacity: op }) => (
        <View
          key={size}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: c.startsWith('#')
              ? hexToRgba(c, op)
              : `rgba(200,184,245,${op})`,
          }}
        />
      ))}
    </Animated.View>
  );
}

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Milestone() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const language = useTrackerStore((s) => s.language);
  const { days: daysParam } = useLocalSearchParams<{ days: string }>();
  const days = parseInt(daysParam ?? '0', 10);

  const phrase = MILESTONE_PHRASES[days] ?? 'keep going.';
  const insight = MILESTONE_INSIGHTS[days]?.[language];
  const pt = language === 'pt';

  // Hero number pulse
  const pulse = useSharedValue(1);
  useEffect(() => {
    const run = () => {
      pulse.value = withSequence(
        withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: 1800, easing: Easing.inOut(Easing.ease) })
      );
      setTimeout(run, 3600);
    };
    const t = setTimeout(run, 1200);
    return () => clearTimeout(t);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleShare = async () => {
    try {
      await Share.share({
        message: pt
          ? `${days} dias livre — via Voidless`
          : `${days} days free — via Voidless`,
      });
    } catch (_) { /* silent */ }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.primary }]}>
      <RadialGlow accentColor={colors.accent.primary} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tagline */}
        {insight && (
          <Animated.Text
            entering={FadeIn.delay(100).duration(500)}
            style={[styles.tagline, { color: colors.text.muted }]}
          >
            {insight.tagline}
          </Animated.Text>
        )}

        {/* Hero number */}
        <Animated.View entering={FadeIn.delay(200).duration(600)} style={[styles.numberWrap, pulseStyle]}>
          <Text style={[styles.number, {
            color: colors.accent.primary,
            shadowColor: colors.accent.primary,
          }]}>
            {days}
          </Text>
        </Animated.View>

        {/* Celebration phrase */}
        <Animated.Text
          entering={FadeInUp.delay(450).duration(600)}
          style={[styles.phrase, { color: colors.text.secondary }]}
        >
          {phrase.toUpperCase()}
        </Animated.Text>

        {/* ── Insight card ── */}
        {insight && (
          <Animated.View
            entering={FadeInUp.delay(650).duration(700)}
            style={[styles.insightCard, { backgroundColor: colors.bg.card, borderColor: colors.border }]}
          >
            {/* Main insight text */}
            <Text style={[styles.insightBody, { color: colors.text.primary }]}>
              {insight.insight}
            </Text>

            {/* Body fact */}
            <View style={[styles.factRow, { borderColor: colors.border }]}>
              <Text style={[styles.factLabel, { color: colors.accent.primary }]}>
                {pt ? 'o que acontece no seu corpo' : 'what\'s happening in your body'}
              </Text>
              <Text style={[styles.factText, { color: colors.text.secondary }]}>
                {insight.bodyFact}
              </Text>
            </View>

            {/* Next milestone teaser */}
            {insight.nextTeaser && insight.nextDays !== null && (
              <View style={[styles.teaserRow, { borderColor: colors.accent.secondary + '40' }]}>
                <View style={styles.teaserLeft}>
                  <Text style={[styles.teaserNext, { color: colors.text.muted }]}>
                    {pt ? 'próximo marco' : 'next milestone'}
                  </Text>
                  <Text style={[styles.teaserDays, { color: colors.accent.primary }]}>
                    {insight.nextDays} {pt ? 'dias' : 'days'}
                  </Text>
                </View>
                <Text style={[styles.teaserText, { color: colors.text.secondary }]}>
                  {insight.nextTeaser}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Actions */}
        <Animated.View
          style={styles.actions}
          entering={FadeInUp.delay(900).duration(500)}
        >
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.shareBtn,
              { backgroundColor: colors.bg.card, borderColor: colors.border },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.shareIcon, { color: colors.text.secondary }]}>↑</Text>
            <Text style={[styles.shareText, { color: colors.text.primary }]}>
              {pt ? 'compartilhar' : 'share'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.continueBtn, pressed && { opacity: 0.5 }]}
          >
            <Text style={[styles.continueText, { color: colors.text.muted }]}>
              {pt ? 'continuar' : 'continue'}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  glowRoot: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  tagline: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 16,
  },

  numberWrap: { marginBottom: 8 },
  number: {
    fontSize: 120,
    fontWeight: '200',
    letterSpacing: -6,
    lineHeight: 124,
    includeFontPadding: false,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
  },

  phrase: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: spacing.lg,
  },

  // ── Insight card ──
  insightCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 20,
    marginBottom: 28,
    gap: 0,
  },

  insightBody: {
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 24,
    marginBottom: 20,
  },

  factRow: {
    borderTopWidth: 0.5,
    paddingTop: 16,
    marginBottom: 16,
    gap: 6,
  },
  factLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  factText: {
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  teaserRow: {
    borderTopWidth: 0.5,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  teaserLeft: { alignItems: 'center', minWidth: 52 },
  teaserNext: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    textAlign: 'center',
  },
  teaserDays: {
    fontSize: 22,
    fontWeight: '200',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  teaserText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 20,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ── Actions ──
  actions: { width: '100%', gap: 12 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 0.5,
  },
  shareIcon: { fontSize: 16 },
  shareText: { fontSize: 15, fontWeight: '400' },
  continueBtn: { paddingVertical: 14, alignItems: 'center' },
  continueText: { fontSize: 14, letterSpacing: 1 },
});
