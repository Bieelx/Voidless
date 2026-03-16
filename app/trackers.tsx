import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTrackerStore } from '../store/useTrackerStore';
import TrackerCard from '../components/TrackerCard';
import { colors, typography, spacing } from '../constants/theme';

export default function Trackers() {
  const insets = useSafeAreaInsets();
  const {
    trackers,
    isPremium,
    addTracker,
    setActiveTracker,
    archiveTracker,
  } = useTrackerStore();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMoney, setNewMoney] = useState('');

  const activeTrackers = trackers.filter((t) => !t.isArchived);

  // FAB spring animation
  const fabScale = useSharedValue(1);
  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleAdd = () => {
    fabScale.value = withSpring(0.88, { damping: 12 }, () => {
      'worklet';
      fabScale.value = withSpring(1, { damping: 14 });
    });
    if (!isPremium && activeTrackers.length >= 2) {
      router.push('/paywall');
      return;
    }
    setShowModal(true);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    addTracker(newName.trim(), parseFloat(newMoney) || 0);
    setNewName('');
    setNewMoney('');
    setShowModal(false);
  };

  const handleSelect = (id: string) => {
    setActiveTracker(id);
    router.push('/home');
  };

  const handleArchive = (id: string, name: string) => {
    Alert.alert(
      'Archive tracker',
      `Archive "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: () => archiveTracker(id),
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(400)}>
        <View>
          <Text style={styles.title}>Trackers</Text>
          <Text style={styles.subtitle}>Keep going, you're doing great.</Text>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.5 }]}
        >
          <View style={styles.iconLine} />
          <View style={[styles.iconLine, { width: 14 }]} />
          <View style={[styles.iconLine, { width: 10 }]} />
        </Pressable>
      </Animated.View>

      {/* Tracker list */}
      <FlatList
        data={activeTrackers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TrackerCard
            tracker={item}
            index={index}
            onPress={() => handleSelect(item.id)}
            onArchive={() => handleArchive(item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          <Animated.Text style={styles.emptyText} entering={FadeIn.delay(200).duration(400)}>
            no trackers yet
          </Animated.Text>
        }
      />

      {/* FAB */}
      <Animated.View style={[styles.fab, fabAnimStyle]}>
        <Pressable onPress={handleAdd} style={styles.fabPressable}>
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      </Animated.View>

      {/* Create modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <Animated.View
            style={styles.modalCard}
            entering={FadeInDown.duration(300).springify()}
          >
            <Pressable onPress={() => {}}>
              <Text style={styles.modalTitle}>new tracker</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="habit name"
                placeholderTextColor={colors.text.muted}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <View style={styles.divider} />

              <TextInput
                style={styles.modalInputSmall}
                placeholder="money saved per day ($) — optional"
                placeholderTextColor={colors.text.muted}
                value={newMoney}
                onChangeText={setNewMoney}
                keyboardType="decimal-pad"
              />
              <View style={styles.divider} />

              <View style={styles.modalActions}>
                <Pressable onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelText}>cancel</Text>
                </Pressable>
                <Pressable onPress={handleCreate}>
                  <Text style={[styles.createText, !newName.trim() && { opacity: 0.3 }]}>
                    create
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: 4,
  },
  settingsBtn: {
    gap: 4,
    paddingVertical: 4,
    alignItems: 'flex-end',
    marginTop: 6,
  },
  iconLine: {
    height: 1.5,
    width: 18,
    backgroundColor: colors.text.secondary,
    borderRadius: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.secondary,
    shadowColor: colors.accent.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  fabPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 28,
    fontWeight: '300' as const,
    color: colors.text.primary,
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 20,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '300' as const,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  modalInput: {
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: 12,
  },
  modalInputSmall: {
    ...typography.caption,
    color: colors.text.primary,
    paddingVertical: 12,
    fontSize: 14,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  cancelText: {
    ...typography.body,
    color: colors.text.muted,
  },
  createText: {
    ...typography.body,
    color: colors.accent.primary,
  },
});
