import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useStrings } from '../hooks/useStrings';
import { useTrackerStore } from '../store/useTrackerStore';

const MOCK_APPS = [
  { id: '1', name: 'Instagram',   icon: '📸', category: 'Social' },
  { id: '2', name: 'TikTok',      icon: '🎵', category: 'Social' },
  { id: '3', name: 'Twitter / X', icon: '🐦', category: 'Social' },
  { id: '4', name: 'YouTube',     icon: '▶️',  category: 'Video'  },
  { id: '5', name: 'WhatsApp',    icon: '💬', category: 'Messaging' },
  { id: '6', name: 'Reddit',      icon: '🔴', category: 'Social' },
  { id: '7', name: 'Twitch',      icon: '🟣', category: 'Video'  },
  { id: '8', name: 'Netflix',     icon: '🎬', category: 'Video'  },
];

const SCHEDULES = [
  { id: 'night',   label: '22h – 8h',  icon: '🌙', labelPt: '22h – 8h'  },
  { id: 'work',    label: '9h – 18h',  icon: '💼', labelPt: '9h – 18h'  },
  { id: 'custom',  label: 'Custom',    icon: '⚙️', labelPt: 'Personalizado' },
];

export default function AppBlocking() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const s = useStrings();
  const isPremium = useTrackerStore((st) => st.isPremium);
  const language = useTrackerStore((st) => st.language);

  const [blocked, setBlocked] = useState<Record<string, boolean>>({
    '1': true, '4': true,
  });
  const [activeSchedule, setActiveSchedule] = useState<string | null>('night');
  const [focusActive, setFocusActive] = useState(false);

  const toggleApp = (id: string) => {
    setBlocked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const bg = colors.bg.primary;
  const card = colors.bg.card;
  const border = colors.border;

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <Text style={[styles.backIcon, { color: colors.text.secondary }]}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {s.appBlocking}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Coming soon banner */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.banner, { backgroundColor: colors.bg.secondary, borderColor: colors.accent.secondary }]}
      >
        <Text style={[styles.bannerEmoji]}>🔬</Text>
        <Text style={[styles.bannerText, { color: colors.text.secondary }]}>
          {language === 'pt'
            ? 'Em desenvolvimento. Esta é uma prévia do que está por vir.'
            : 'In development. This is a preview of what\'s coming.'}
        </Text>
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Focus Mode toggle */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.card, styles.focusCard, { backgroundColor: card, borderColor: focusActive ? colors.accent.primary : border }]}
        >
          <View style={styles.focusLeft}>
            <Text style={[styles.focusTitle, { color: colors.text.primary }]}>
              {s.focusMode}
            </Text>
            <Text style={[styles.focusSub, { color: colors.text.muted }]}>
              {language === 'pt'
                ? 'Bloqueia todos os apps selecionados agora'
                : 'Block all selected apps immediately'}
            </Text>
          </View>
          <Switch
            value={focusActive}
            onValueChange={setFocusActive}
            trackColor={{ false: colors.bg.secondary, true: colors.accent.secondary }}
            thumbColor={focusActive ? colors.accent.primary : colors.text.muted}
          />
        </Animated.View>

        {/* Schedule */}
        <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
          {s.scheduledBlocking.toUpperCase()}
        </Text>
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.card, { backgroundColor: card, borderColor: border }]}
        >
          {SCHEDULES.map((sch, i) => (
            <View key={sch.id}>
              <Pressable
                style={styles.scheduleRow}
                onPress={() => setActiveSchedule(sch.id)}
              >
                <View style={styles.scheduleLeft}>
                  <Text style={styles.scheduleIcon}>{sch.icon}</Text>
                  <Text style={[styles.scheduleLabel, { color: colors.text.primary }]}>
                    {language === 'pt' ? sch.labelPt : sch.label}
                  </Text>
                </View>
                <View style={[
                  styles.radio,
                  {
                    borderColor: activeSchedule === sch.id ? colors.accent.primary : border,
                    backgroundColor: activeSchedule === sch.id ? colors.accent.primary : 'transparent',
                  },
                ]} />
              </Pressable>
              {i < SCHEDULES.length - 1 && (
                <View style={[styles.divider, { backgroundColor: border }]} />
              )}
            </View>
          ))}
        </Animated.View>

        {/* App list */}
        <Text style={[styles.sectionLabel, { color: colors.text.muted }]}>
          {s.blockApps.toUpperCase()}
        </Text>
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={[styles.card, { backgroundColor: card, borderColor: border }]}
        >
          {MOCK_APPS.map((app, i) => (
            <View key={app.id}>
              <View style={styles.appRow}>
                <View style={styles.appLeft}>
                  <Text style={styles.appIcon}>{app.icon}</Text>
                  <View>
                    <Text style={[styles.appName, { color: colors.text.primary }]}>
                      {app.name}
                    </Text>
                    <Text style={[styles.appCat, { color: colors.text.muted }]}>
                      {app.category}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={blocked[app.id] ?? false}
                  onValueChange={() => toggleApp(app.id)}
                  trackColor={{ false: colors.bg.secondary, true: colors.accent.secondary }}
                  thumbColor={(blocked[app.id]) ? colors.accent.primary : colors.text.muted}
                />
              </View>
              {i < MOCK_APPS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: border }]} />
              )}
            </View>
          ))}
        </Animated.View>

        {/* Premium lock overlay hint if not premium */}
        {!isPremium && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={[styles.lockCard, { backgroundColor: card, borderColor: colors.accent.secondary }]}
          >
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={[styles.lockTitle, { color: colors.text.primary }]}>
              {language === 'pt' ? 'Disponível no Pro' : 'Available in Pro'}
            </Text>
            <Text style={[styles.lockSub, { color: colors.text.muted }]}>
              {language === 'pt'
                ? 'Bloqueio real de apps requer Voidless Pro.'
                : 'Real app blocking requires Voidless Pro.'}
            </Text>
            <Pressable
              style={[styles.upgradeBtn, { borderColor: colors.accent.primary }]}
              onPress={() => router.push('/paywall')}
            >
              <Text style={[styles.upgradeText, { color: colors.accent.primary }]}>
                {language === 'pt' ? 'Ver planos' : 'See plans'}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backIcon: { fontSize: 22, fontWeight: '300' },
  title: { fontSize: 17, fontWeight: '500', letterSpacing: -0.3 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  bannerEmoji: { fontSize: 16 },
  bannerText: { fontSize: 12, flex: 1, lineHeight: 18 },
  scroll: { paddingHorizontal: 16, paddingTop: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  focusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
  },
  focusLeft: { flex: 1, marginRight: 12 },
  focusTitle: { fontSize: 16, fontWeight: '500' },
  focusSub: { fontSize: 12, marginTop: 3, lineHeight: 16 },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  scheduleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scheduleIcon: { fontSize: 18 },
  scheduleLabel: { fontSize: 15 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
  },
  divider: { height: 0.5, marginHorizontal: 16 },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  appLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appIcon: { fontSize: 24 },
  appName: { fontSize: 15, fontWeight: '400' },
  appCat: { fontSize: 11, marginTop: 2 },
  lockCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  lockEmoji: { fontSize: 28, marginBottom: 10 },
  lockTitle: { fontSize: 16, fontWeight: '500', marginBottom: 6 },
  lockSub: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  upgradeBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  upgradeText: { fontSize: 13, fontWeight: '500' },
});
