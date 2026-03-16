import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Share, Platform } from 'react-native';
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
import { MILESTONE_PHRASES } from '../utils/milestones';
import { colors, spacing } from '../constants/theme';

// Radial glow: concentric circles fading out from center
function RadialGlow() {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) }));
    scale.value = withDelay(100, withSpring(1, { damping: 20, stiffness: 60 }));
  }, [scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.glowRoot, animStyle]} pointerEvents="none">
      <View style={styles.glowRing4} />
      <View style={styles.glowRing3} />
      <View style={styles.glowRing2} />
      <View style={styles.glowRing1} />
      <View style={styles.glowCore} />
    </Animated.View>
  );
}

export default function Milestone() {
  const insets = useSafeAreaInsets();
  const { days: daysParam } = useLocalSearchParams<{ days: string }>();
  const days = parseInt(daysParam ?? '0', 10);
  const phrase = MILESTONE_PHRASES[days] ?? 'keep going.';

  // Pulsing glow on number
  const numberGlow = useSharedValue(1);
  useEffect(() => {
    const pulse = () => {
      numberGlow.value = withSequence(
        withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      );
      setTimeout(pulse, 3600);
    };
    const timer = setTimeout(pulse, 1200);
    return () => clearTimeout(timer);
  }, [numberGlow]);

  const numberPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberGlow.value }],
  }));

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${days} days free — via Voidless`,
      });
    } catch (_e) {
      // silent
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* Radial spotlight background */}
      <RadialGlow />

      {/* Center content */}
      <View style={styles.center}>

        {/* Hero number */}
        <Animated.View entering={FadeIn.delay(200).duration(600)} style={numberPulseStyle}>
          <Text style={styles.number}>{days}</Text>
        </Animated.View>

        {/* Phrase */}
        <Animated.Text
          entering={FadeInUp.delay(500).duration(600).easing(Easing.out(Easing.ease))}
          style={styles.phrase}
        >
          {phrase.toUpperCase()}
        </Animated.Text>
      </View>

      {/* Actions */}
      <Animated.View
        style={[styles.actions, { paddingBottom: insets.bottom + spacing.lg }]}
        entering={FadeInUp.delay(700).duration(500)}
      >
        <Pressable onPress={handleShare} style={({ pressed }) => [
          styles.shareButton,
          pressed && { opacity: 0.75 },
        ]}>
          <Text style={styles.shareIcon}>↑</Text>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.continueButton, pressed && { opacity: 0.6 }]}
        >
          <Text style={styles.continueText}>continue</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const GLOW_COLOR = 'rgba(200, 184, 245,';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  // Glow layers — concentric circles, absolute center
  glowRoot: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing4: {
    position: 'absolute',
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: `${GLOW_COLOR} 0.025)`,
  },
  glowRing3: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: `${GLOW_COLOR} 0.04)`,
  },
  glowRing2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: `${GLOW_COLOR} 0.055)`,
  },
  glowRing1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: `${GLOW_COLOR} 0.07)`,
  },
  glowCore: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${GLOW_COLOR} 0.09)`,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  number: {
    fontSize: 120,
    fontWeight: '200' as const,
    letterSpacing: -6,
    color: colors.accent.primary,
    lineHeight: 124,
    includeFontPadding: false,
    // iOS glow via shadow
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
  phrase: {
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 3,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: 12,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bg.card,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  shareIcon: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  shareText: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.text.primary,
  },
  continueButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 14,
    color: colors.text.muted,
    letterSpacing: 1,
  },
});
