import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useCounter } from '../hooks/useCounter';
import { colors } from '../constants/theme';

interface CounterDisplayProps {
  startDate: string;
  relapses: string[];
}

// Sub-unit digit: hours / minutes — slides up on change
function AnimatedDigit({
  value,
  style,
  labelStyle,
  label,
}: {
  value: number;
  style: object;
  labelStyle: object;
  label: string;
}) {
  const prevValue = useRef(value);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;
    translateY.value = withTiming(-14, { duration: 80, easing: Easing.in(Easing.ease) }, () => {
      'worklet';
      translateY.value = 16;
      opacity.value = 0;
      translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
      opacity.value = withTiming(1, { duration: 180 });
    });
  }, [value, translateY, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.digitUnit}>
      <Animated.Text style={[style, animStyle]}>
        {String(value).padStart(2, '0')}
      </Animated.Text>
      <Animated.Text style={[labelStyle, animStyle]}>
        {label}
      </Animated.Text>
    </View>
  );
}

// Hero days number — bigger travel distance
function AnimatedDays({ value }: { value: number }) {
  const prevValue = useRef(value);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;
    translateY.value = withTiming(-24, { duration: 100, easing: Easing.in(Easing.ease) }, () => {
      'worklet';
      translateY.value = 30;
      opacity.value = 0;
      translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 220 });
    });
  }, [value, translateY, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.daysUnit}>
      <Animated.Text style={[styles.daysNumber, animStyle]}>
        {String(value)}
      </Animated.Text>
      <Animated.Text style={[styles.daysLabel, animStyle]}>
        DAYS
      </Animated.Text>
    </View>
  );
}

export default function CounterDisplay({ startDate, relapses }: CounterDisplayProps) {
  const { days, hours, minutes } = useCounter(startDate, relapses);

  return (
    <View style={styles.container}>
      <AnimatedDays value={days} />

      <View style={styles.divider} />

      <View style={styles.subRow}>
        <AnimatedDigit
          value={hours}
          style={styles.subNumber}
          labelStyle={styles.subLabel}
          label="HOURS"
        />
        <View style={styles.subDivider} />
        <AnimatedDigit
          value={minutes}
          style={styles.subNumber}
          labelStyle={styles.subLabel}
          label="MINUTES"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysUnit: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  daysNumber: {
    fontSize: 96,
    fontWeight: '200' as const,
    letterSpacing: -4,
    color: colors.text.primary,
    lineHeight: 100,
    includeFontPadding: false,
  },
  daysLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 4,
    color: colors.text.muted,
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subDivider: {
    width: 0.5,
    height: 36,
    backgroundColor: colors.border,
    marginHorizontal: 36,
  },
  digitUnit: {
    alignItems: 'center',
    overflow: 'hidden',
    minWidth: 64,
  },
  subNumber: {
    fontSize: 42,
    fontWeight: '200' as const,
    letterSpacing: -1,
    color: colors.accent.primary,
    lineHeight: 46,
    includeFontPadding: false,
  },
  subLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 3,
    color: colors.text.muted,
    marginTop: 6,
  },
});
