import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTrackerStore } from '../store/useTrackerStore';
import { useTheme } from '../contexts/ThemeContext';
import { useStrings } from '../hooks/useStrings';
import { THEMES, THEME_ORDER, PREMIUM_THEMES, type ThemeKey } from '../constants/themes';
import type { Language } from '../constants/quotes';

const APP_VERSION = '1.0.0-beta';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const s = useStrings();
  const {
    isPremium,
    theme,
    language,
    setTheme,
    setLanguage,
    resetAllData,
  } = useTrackerStore();

  // Hidden dev menu — 5 rapid taps on version
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [devUnlocked, setDevUnlocked] = useState(false);

  const handleVersionTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setDevUnlocked(true);
    }
  };

  const handleThemeSelect = (key: ThemeKey) => {
    if (PREMIUM_THEMES.includes(key) && !isPremium) {
      router.push('/paywall');
      return;
    }
    setTheme(key);
  };

  const handleReset = () => {
    Alert.alert(s.resetConfirm, s.resetConfirmMsg, [
      { text: s.cancel, style: 'cancel' },
      {
        text: s.confirm,
        style: 'destructive',
        onPress: async () => {
          await resetAllData();
          router.replace('/onboarding');
        },
      },
    ]);
  };

  const bg = colors.bg.primary;
  const cardBg = colors.bg.card;
  const border = colors.border;

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInDown.duration(400)}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.5 }]}
        >
          <Text style={[styles.backIcon, { color: colors.text.secondary }]}>←</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text.primary }]}>{s.settings}</Text>
        <View style={{ width: 32 }} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── APPEARANCE ── */}
        <SectionLabel label={s.appearance} colors={colors} />
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.rowLabel, { color: colors.text.secondary }]}>{s.themeLabel}</Text>
          <View style={styles.themesGrid}>
            {THEME_ORDER.map((key) => {
              const t = THEMES[key];
              const isSelected = theme === key;
              const locked = t.isPremium && !isPremium;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.themeChip,
                    {
                      borderColor: isSelected ? colors.accent.primary : border,
                      borderWidth: isSelected ? 1.5 : 0.5,
                    },
                  ]}
                  onPress={() => handleThemeSelect(key)}
                >
                  {/* Color swatch */}
                  <View style={styles.swatchRow}>
                    <View style={[styles.swatch, { backgroundColor: t.colors.bg.primary }]} />
                    <View style={[styles.swatchAccent, { backgroundColor: t.colors.accent.primary }]} />
                  </View>
                  <Text style={[styles.themeName, { color: isSelected ? colors.accent.primary : colors.text.secondary }]}>
                    {language === 'pt' ? t.name : t.nameEn}
                  </Text>
                  {locked && (
                    <View style={[styles.lockBadge, { backgroundColor: colors.accent.secondary }]}>
                      <Text style={styles.lockText}>PRO</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── PREFERENCES ── */}
        <SectionLabel label={s.preferences} colors={colors} />
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Row
            label={s.languageLabel}
            colors={colors}
            right={
              <View style={styles.langToggle}>
                {(['pt', 'en'] as Language[]).map((lang) => (
                  <Pressable
                    key={lang}
                    style={[
                      styles.langChip,
                      {
                        backgroundColor: language === lang ? colors.accent.primary : 'transparent',
                        borderColor: language === lang ? colors.accent.primary : border,
                      },
                    ]}
                    onPress={() => setLanguage(lang)}
                  >
                    <Text style={[
                      styles.langText,
                      { color: language === lang ? colors.bg.primary : colors.text.secondary },
                    ]}>
                      {lang === 'pt' ? 'PT' : 'EN'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            }
          />
        </View>

        {/* ── SUBSCRIPTION ── */}
        <SectionLabel label={s.subscription} colors={colors} />
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Row
            label={s.currentPlan}
            colors={colors}
            right={
              <View style={[styles.planBadge, { borderColor: isPremium ? colors.accent.primary : border }]}>
                <Text style={[styles.planText, { color: isPremium ? colors.accent.primary : colors.text.muted }]}>
                  {isPremium ? s.proPlan : s.freePlan}
                </Text>
              </View>
            }
          />
          {!isPremium && (
            <>
              <View style={[styles.cardDivider, { backgroundColor: border }]} />
              <Pressable
                style={({ pressed }) => [styles.rowPressable, pressed && { opacity: 0.6 }]}
                onPress={() => router.push('/paywall')}
              >
                <Text style={[styles.actionText, { color: colors.accent.primary }]}>{s.upgrade}</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* ── TOOLS ── */}
        <SectionLabel label={s.tools} colors={colors} />
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Pressable
            style={({ pressed }) => [styles.rowPressable, pressed && { opacity: 0.6 }]}
            onPress={() => router.push('/app-blocking')}
          >
            <View style={styles.rowInner}>
              <View>
                <Text style={[styles.rowLabel, { color: colors.text.primary }]}>{s.appBlocking}</Text>
                <Text style={[styles.rowSubLabel, { color: colors.text.muted }]}>{s.appBlockingDesc}</Text>
              </View>
              <Text style={[styles.chevron, { color: colors.text.muted }]}>›</Text>
            </View>
          </Pressable>
        </View>

        {/* ── DANGER ZONE ── */}
        <SectionLabel label={s.dangerZone} colors={colors} danger />
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Pressable
            style={({ pressed }) => [styles.rowPressable, pressed && { opacity: 0.6 }]}
            onPress={handleReset}
          >
            <Text style={[styles.actionText, { color: colors.danger }]}>{s.resetData}</Text>
          </Pressable>
        </View>

        {/* Dev menu (unlocked) */}
        {devUnlocked && (
          <Pressable
            style={[styles.devButton, { borderColor: colors.accent.secondary }]}
            onPress={() => router.push('/dev')}
          >
            <Text style={[styles.devText, { color: colors.accent.secondary }]}>
              ⚙ {s.devMenu}
            </Text>
          </Pressable>
        )}

        {/* Version — tap 5x to unlock dev menu */}
        <Pressable onPress={handleVersionTap} style={styles.versionBtn}>
          <Text style={[styles.version, { color: colors.text.muted }]}>
            {s.version} {APP_VERSION}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ──

function SectionLabel({
  label,
  colors,
  danger,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>;
  danger?: boolean;
}) {
  return (
    <Text style={[styles.sectionLabel, { color: danger ? colors.danger : colors.text.muted }]}>
      {label.toUpperCase()}
    </Text>
  );
}

function Row({
  label,
  colors,
  right,
}: {
  label: string;
  colors: ReturnType<typeof useTheme>;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.rowInner}>
      <Text style={[styles.rowLabel, { color: colors.text.primary }]}>{label}</Text>
      {right}
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
  backBtn: { width: 32, alignItems: 'flex-start' },
  backIcon: { fontSize: 22, fontWeight: '300' },
  title: { fontSize: 17, fontWeight: '500', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
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
  cardDivider: { height: 0.5, marginHorizontal: 16 },
  rowPressable: { paddingHorizontal: 16, paddingVertical: 14 },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 15, fontWeight: '400' },
  rowSubLabel: { fontSize: 12, marginTop: 2, lineHeight: 16, maxWidth: '90%' },
  actionText: { fontSize: 15, fontWeight: '400' },
  chevron: { fontSize: 20, fontWeight: '300' },
  // Themes grid
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  themeChip: {
    width: '46%',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  swatchRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  swatch: { width: 24, height: 24, borderRadius: 6 },
  swatchAccent: { width: 12, height: 12, borderRadius: 4, marginTop: 6 },
  themeName: { fontSize: 13, fontWeight: '500' },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lockText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  // Language
  langToggle: { flexDirection: 'row', gap: 6 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  langText: { fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  // Plan badge
  planBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  planText: { fontSize: 12, fontWeight: '500' },
  // Dev + version
  devButton: {
    marginTop: 24,
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  devText: { fontSize: 13, fontWeight: '500', letterSpacing: 1 },
  versionBtn: { marginTop: 20, alignItems: 'center', paddingVertical: 8 },
  version: { fontSize: 11, letterSpacing: 1 },
});
