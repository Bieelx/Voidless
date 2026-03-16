import React, { useCallback } from 'react';
import { StyleSheet, Text, Platform, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/theme';

interface RelapseButtonProps {
  onRelapse: () => void;
}

const HOLD_DURATION = 1500;

export default function RelapseButton({ onRelapse }: RelapseButtonProps) {
  const progress = useSharedValue(0);
  const isActive = useSharedValue(false);

  const triggerRelapse = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    onRelapse();
  }, [onRelapse]);

  const triggerImpact = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const longPress = Gesture.LongPress()
    .minDuration(HOLD_DURATION)
    .onBegin(() => {
      isActive.value = true;
      runOnJS(triggerImpact)();
      progress.value = withTiming(1, {
        duration: HOLD_DURATION,
        easing: Easing.linear,
      });
    })
    .onEnd((_e, success) => {
      if (success) {
        runOnJS(triggerRelapse)();
      }
      progress.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
      isActive.value = false;
    })
    .onFinalize(() => {
      progress.value = withTiming(0, { duration: 250 });
      isActive.value = false;
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    opacity: progress.value > 0 ? 1 : 0,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isActive.value ? 0.985 : 1, {
          damping: 20,
          stiffness: 300,
        }),
      },
    ],
    borderColor: `rgba(226,75,74,${interpolate(progress.value, [0, 1], [0.35, 0.9])})`,
  }));

  return (
    <GestureDetector gesture={longPress}>
      <Animated.View style={[styles.button, buttonStyle]}>
        <Animated.View style={[styles.fill, fillStyle]} />
        <View style={styles.labelContainer}>
          <Text style={styles.text}>I RELAPSED</Text>
          <Text style={styles.hint}>hold to confirm</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: 'rgba(226,75,74,0.35)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(226,75,74,0.11)',
    borderRadius: 16,
  },
  labelContainer: {
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 3,
    color: colors.danger,
  },
  hint: {
    fontSize: 11,
    color: colors.text.muted,
    letterSpacing: 1,
  },
});
