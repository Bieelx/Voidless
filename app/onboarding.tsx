import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTrackerStore } from '../store/useTrackerStore';
import { colors, typography, spacing } from '../constants/theme';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [money, setMoney] = useState('');
  const addTracker = useTrackerStore((s) => s.addTracker);

  const handleContinue = () => {
    if (!name.trim()) return;
    const moneySaved = parseFloat(money) || 0;
    addTracker(name.trim(), moneySaved);
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo mark */}
        <View style={styles.logo} />

        <Text style={styles.headline}>what are you leaving behind?</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="name your habit..."
            placeholderTextColor={colors.text.secondary}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="next"
          />
          <View style={styles.inputLine} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.moneyInput}
            placeholder="money saved per day ($) — optional"
            placeholderTextColor={colors.text.muted}
            value={money}
            onChangeText={setMoney}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
          <View style={styles.inputLine} />
        </View>

        <Pressable
          onPress={handleContinue}
          style={styles.cta}
          disabled={!name.trim()}
        >
          <Text
            style={[
              styles.ctaText,
              !name.trim() && styles.ctaDisabled,
            ]}
          >
            continue
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.accent.secondary,
    alignSelf: 'center',
    marginBottom: spacing.xxl,
  },
  headline: {
    fontSize: 22,
    fontWeight: '200',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.text.primary,
    paddingVertical: 12,
  },
  moneyInput: {
    ...typography.caption,
    color: colors.text.primary,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputLine: {
    height: 0.5,
    backgroundColor: colors.border,
  },
  cta: {
    alignSelf: 'center',
    paddingVertical: 16,
    marginTop: spacing.lg,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.accent.primary,
  },
  ctaDisabled: {
    opacity: 0.3,
  },
});
