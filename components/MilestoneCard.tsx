import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';
import { MILESTONE_PHRASES } from '../utils/milestones';

interface MilestoneCardProps {
  days: number;
}

export default function MilestoneCard({ days }: MilestoneCardProps) {
  const phrase = MILESTONE_PHRASES[days] ?? 'keep going.';

  return (
    <View style={styles.card}>
      <Text style={styles.number}>{days}</Text>
      <Text style={styles.label}>days free</Text>
      <Text style={styles.phrase}>{phrase}</Text>
      <Text style={styles.watermark}>via Voidless</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 300,
    backgroundColor: colors.bg.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  number: {
    fontSize: 88,
    fontWeight: '200',
    color: colors.accent.primary,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: -4,
  },
  phrase: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  watermark: {
    ...typography.caption,
    color: colors.text.muted,
    position: 'absolute',
    bottom: 16,
  },
});
