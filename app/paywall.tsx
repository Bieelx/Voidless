import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTrackerStore } from '../store/useTrackerStore';
import { colors, typography, spacing } from '../constants/theme';

const FEATURES = [
  'unlimited trackers',
  'home screen widgets',
  'shareable milestone cards',
];

export default function Paywall() {
  const setPremium = useTrackerStore((s) => s.setPremium);

  const handlePurchase = () => {
    // Beta: mock purchase — just enable premium locally
    setPremium(true);
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

      <View style={styles.card}>
        <Text style={styles.headline}>
          {'2 addictions.\n1 you.'}
        </Text>

        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <Text key={feature} style={styles.featureItem}>
              {feature}
            </Text>
          ))}
        </View>

        {/* Annual */}
        <Pressable
          style={styles.annualButton}
          onPress={handlePurchase}
        >
          <View style={styles.pill}>
            <Text style={styles.pillText}>best value</Text>
          </View>
          <Text style={styles.priceText}>$12.99 / year</Text>
        </Pressable>

        {/* Monthly */}
        <Pressable
          style={styles.monthlyButton}
          onPress={handlePurchase}
        >
          <Text style={styles.priceText}>$2.99 / month</Text>
        </Pressable>

        {/* Dismiss */}
        <Pressable
          style={styles.dismiss}
          onPress={() => router.back()}
        >
          <Text style={styles.dismissText}>maybe later</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  headline: {
    fontSize: 28,
    fontWeight: '200',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 36,
  },
  features: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  featureItem: {
    ...typography.body,
    color: colors.text.secondary,
    paddingVertical: 6,
    paddingLeft: 8,
  },
  annualButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.accent.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pillText: {
    ...typography.caption,
    color: colors.bg.primary,
    fontWeight: '600',
  },
  monthlyButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  priceText: {
    ...typography.body,
    color: colors.text.primary,
  },
  dismiss: {
    paddingVertical: 8,
  },
  dismissText: {
    ...typography.caption,
    color: colors.text.muted,
  },
});
