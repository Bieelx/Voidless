import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { colors } from '../constants/theme';

export default function Index() {
  const { trackers, isLoaded } = useTrackerStore();

  useEffect(() => {
    if (!isLoaded) return;

    const activeTrackers = trackers.filter((t) => !t.isArchived);
    if (activeTrackers.length === 0) {
      router.replace('/onboarding');
    } else {
      router.replace('/home');
    }
  }, [isLoaded, trackers]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accent.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
