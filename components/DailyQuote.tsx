import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { getDailyQuote } from '../constants/quotes';
import { useTrackerStore } from '../store/useTrackerStore';
import { useTheme } from '../contexts/ThemeContext';

export default function DailyQuote() {
  const language = useTrackerStore((s) => s.language);
  const colors = useTheme();
  const quote = getDailyQuote(language);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(800, withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(800, withTiming(0, { duration: 700, easing: Easing.out(Easing.ease) }));
  }, [opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={[styles.quote, { color: colors.text.muted }, animStyle]}>
      {quote}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  quote: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
  },
});
