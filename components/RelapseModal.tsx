import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useStrings } from '../hooks/useStrings';
import { getRandomRelapseQuote } from '../constants/quotes';
import { useTrackerStore } from '../store/useTrackerStore';

interface RelapseModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function RelapseModal({ visible, onDismiss }: RelapseModalProps) {
  const colors = useTheme();
  const s = useStrings();
  const language = useTrackerStore((st) => st.language);
  const quote = React.useRef(getRandomRelapseQuote(language));

  const translateY = useSharedValue(300);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      quote.current = getRandomRelapseQuote(language);
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(300, { duration: 250 });
    }
  }, [visible, language, opacity, translateY]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />

        <Animated.View
          style={[styles.sheet, { backgroundColor: colors.bg.card, borderColor: colors.border }, sheetStyle]}
        >
          {/* Drag indicator */}
          <View style={[styles.handle, { backgroundColor: colors.text.muted }]} />

          {/* Counter reset indicator */}
          <Animated.View entering={FadeIn.delay(200).duration(400)}>
            <View style={styles.resetRow}>
              <Text style={[styles.resetNumber, { color: colors.accent.primary }]}>0</Text>
              <Text style={[styles.resetLabel, { color: colors.text.muted }]}>
                {s.days_label}
              </Text>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {s.relapseTitle}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {s.relapseSubtitle}
            </Text>

            {/* Quote */}
            <View style={[styles.quoteBorder, { borderColor: colors.border }]}>
              <Text style={[styles.quote, { color: colors.text.muted }]}>
                "{quote.current}"
              </Text>
            </View>

            {/* CTA */}
            <Pressable
              style={[styles.button, { borderColor: colors.accent.primary }]}
              onPress={onDismiss}
            >
              <Text style={[styles.buttonText, { color: colors.accent.primary }]}>
                {s.startAgain}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    padding: 28,
    paddingBottom: 48,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 28,
    opacity: 0.4,
  },
  resetRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 16,
  },
  resetNumber: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 52,
  },
  resetLabel: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 24,
  },
  quoteBorder: {
    borderLeftWidth: 1.5,
    paddingLeft: 14,
    marginBottom: 28,
  },
  quote: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  button: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
});
