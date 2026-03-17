import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeInUp,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrackerStore } from '../store/useTrackerStore';
import { useTheme } from '../contexts/ThemeContext';
import { colors as defaultColors, spacing } from '../constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Content data ──────────────────────────────────────────────────────────────

const HABIT_SUGGESTIONS = [
  { id: 'cigarro',       pt: 'cigarro',       en: 'smoking'       },
  { id: 'alcool',        pt: 'álcool',         en: 'alcohol'       },
  { id: 'redes',         pt: 'redes sociais',  en: 'social media'  },
  { id: 'pornografia',   pt: 'pornografia',    en: 'pornography'   },
  { id: 'jogos',         pt: 'jogos',          en: 'gaming'        },
  { id: 'cafeina',       pt: 'cafeína',        en: 'caffeine'      },
  { id: 'acucar',        pt: 'açúcar',         en: 'sugar'         },
  { id: 'apostas',       pt: 'apostas',        en: 'gambling'      },
];

type History = 'first' | 'some' | 'many';

interface HistoryOption {
  id: History;
  pt: string;
  en: string;
  responsePt: string;
  responseEn: string;
}

const HISTORY_OPTIONS: HistoryOption[] = [
  {
    id: 'first',
    pt: 'é a primeira vez que tento',
    en: 'this is my first time trying',
    responsePt: 'todo começo tem um valor enorme.\nvocê está no lugar certo.',
    responseEn: 'every beginning holds immense value.\nyou\'re in the right place.',
  },
  {
    id: 'some',
    pt: 'já tentei algumas vezes antes',
    en: 'I\'ve tried a few times before',
    responsePt: 'tentar de novo não é fraqueza.\né a única estratégia que funciona.',
    responseEn: 'trying again isn\'t weakness.\nit\'s the only strategy that works.',
  },
  {
    id: 'many',
    pt: 'já tentei muitas vezes',
    en: 'I\'ve tried many times',
    responsePt: 'cada tentativa te trouxe até aqui.\nvocê já sabe mais do que imagina.',
    responseEn: 'each attempt brought you here.\nyou already know more than you think.',
  },
];

// ── Step counter ──────────────────────────────────────────────────────────────

function StepDots({ current, total, accentColor }: { current: number; total: number; accentColor: string }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === current ? accentColor : 'rgba(255,255,255,0.15)',
              width: i === current ? 20 : 6,
            },
          ]}
        />
      ))}
    </View>
  );
}

// ── Animated step wrapper ─────────────────────────────────────────────────────

interface StepProps {
  children: React.ReactNode;
  visible: boolean;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const colors = useTheme();
  const language = useTrackerStore((s) => s.language);
  const addTracker = useTrackerStore((s) => s.addTracker);

  const [step, setStep] = useState(0);
  const [habitName, setHabitName] = useState('');
  const [history, setHistory] = useState<History | null>(null);
  const [showHistoryResponse, setShowHistoryResponse] = useState(false);
  const [money, setMoney] = useState('');

  // Slide animation
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const goToStep = useCallback((next: number) => {
    opacity.value = withTiming(0, { duration: 180, easing: Easing.in(Easing.ease) }, () => {
      'worklet';
      translateX.value = SCREEN_W * 0.12;
      runOnJS(setStep)(next);
      translateX.value = withSpring(0, { damping: 22, stiffness: 180 });
      opacity.value = withTiming(1, { duration: 300 });
    });
  }, [opacity, translateX]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const handleHistorySelect = (opt: HistoryOption) => {
    setHistory(opt.id);
    setShowHistoryResponse(true);
    setTimeout(() => goToStep(3), 1800);
  };

  const handleFinish = () => {
    if (!habitName.trim()) return;
    addTracker(habitName.trim(), parseFloat(money) || 0);
    router.replace('/home');
  };

  const pt = language === 'pt';

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.bg.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.safeTop, { paddingTop: insets.top + 12 }]}>
        <StepDots current={step} total={4} accentColor={colors.accent.primary} />
      </View>

      <Animated.View style={[styles.stepContainer, containerStyle]}>
        {step === 0 && <StepWelcome colors={colors} pt={pt} onNext={() => goToStep(1)} />}
        {step === 1 && (
          <StepHabit
            colors={colors}
            pt={pt}
            habitName={habitName}
            setHabitName={setHabitName}
            onNext={() => { if (habitName.trim()) goToStep(2); }}
          />
        )}
        {step === 2 && (
          <StepHistory
            colors={colors}
            pt={pt}
            selected={history}
            showResponse={showHistoryResponse}
            onSelect={handleHistorySelect}
          />
        )}
        {step === 3 && (
          <StepMoney
            colors={colors}
            pt={pt}
            habitName={habitName}
            money={money}
            setMoney={setMoney}
            onFinish={handleFinish}
          />
        )}
      </Animated.View>

      <View style={{ height: insets.bottom + 24 }} />
    </KeyboardAvoidingView>
  );
}

// ── Step 0: Welcome ───────────────────────────────────────────────────────────

function StepWelcome({ colors, pt, onNext }: { colors: any; pt: boolean; onNext: () => void }) {
  return (
    <View style={styles.step}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.centerBlock}>
        {/* Logo */}
        <View style={[styles.logo, { borderColor: colors.accent.secondary }]} />

        <Animated.Text
          entering={FadeInUp.delay(200).duration(600)}
          style={[styles.welcomeHeadline, { color: colors.text.primary }]}
        >
          {pt ? 'você não está sozinho.' : 'you are not alone.'}
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(400).duration(600)}
          style={[styles.welcomeBody, { color: colors.text.secondary }]}
        >
          {pt
            ? 'o Voidless é um espaço seguro para acompanhar sua jornada.\nsem julgamentos. só progresso.'
            : 'Voidless is a safe space to track your journey.\nno judgment. just progress.'}
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(700).duration(600)} style={styles.ctaBlock}>
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [styles.primaryBtn, { borderColor: colors.accent.primary }, pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.primaryBtnText, { color: colors.accent.primary }]}>
            {pt ? 'começar' : 'begin'}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Step 1: Habit name ────────────────────────────────────────────────────────

function StepHabit({
  colors, pt, habitName, setHabitName, onNext,
}: { colors: any; pt: boolean; habitName: string; setHabitName: (v: string) => void; onNext: () => void }) {
  return (
    <ScrollView
      style={styles.step}
      contentContainerStyle={styles.stepScroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text
        entering={FadeInUp.duration(500)}
        style={[styles.stepHeadline, { color: colors.text.primary }]}
      >
        {pt ? 'o que você quer\ndeixar para trás?' : 'what do you want\nto leave behind?'}
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(150).duration(500)}
        style={[styles.stepSub, { color: colors.text.secondary }]}
      >
        {pt
          ? 'pode ser qualquer coisa. só você precisa saber.'
          : 'it can be anything. only you need to know.'}
      </Animated.Text>

      {/* Input */}
      <Animated.View
        entering={FadeInUp.delay(250).duration(500)}
        style={styles.inputWrap}
      >
        <TextInput
          style={[styles.habitInput, { color: colors.text.primary }]}
          placeholder={pt ? 'nomeie seu hábito...' : 'name your habit...'}
          placeholderTextColor={colors.text.muted}
          value={habitName}
          onChangeText={setHabitName}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={onNext}
        />
        <View style={[styles.inputLine, { backgroundColor: habitName ? colors.accent.primary : colors.border }]} />
      </Animated.View>

      {/* Suggestion pills */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.pillsWrap}>
        {HABIT_SUGGESTIONS.map((s) => (
          <Pressable
            key={s.id}
            style={[
              styles.pill,
              {
                borderColor: habitName === (pt ? s.pt : s.en)
                  ? colors.accent.primary
                  : colors.border,
                backgroundColor: habitName === (pt ? s.pt : s.en)
                  ? `${colors.accent.primary}18`
                  : 'transparent',
              },
            ]}
            onPress={() => setHabitName(pt ? s.pt : s.en)}
          >
            <Text style={[styles.pillText, {
              color: habitName === (pt ? s.pt : s.en)
                ? colors.accent.primary
                : colors.text.secondary,
            }]}>
              {pt ? s.pt : s.en}
            </Text>
          </Pressable>
        ))}
      </Animated.View>

      {/* CTA */}
      <Animated.View entering={FadeInUp.delay(550).duration(500)} style={styles.ctaBlock}>
        <Pressable
          onPress={onNext}
          disabled={!habitName.trim()}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
        >
          <Text style={[styles.textBtn, { color: colors.accent.primary, opacity: habitName.trim() ? 1 : 0.3 }]}>
            {pt ? 'continuar' : 'continue'}
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

// ── Step 2: History ───────────────────────────────────────────────────────────

function StepHistory({
  colors, pt, selected, showResponse, onSelect,
}: { colors: any; pt: boolean; selected: History | null; showResponse: boolean; onSelect: (o: HistoryOption) => void }) {
  const selectedOpt = HISTORY_OPTIONS.find((o) => o.id === selected);

  return (
    <View style={styles.step}>
      <View style={styles.stepContent}>
        {!showResponse ? (
          <>
            <Animated.Text
              entering={FadeInUp.duration(500)}
              style={[styles.stepHeadline, { color: colors.text.primary }]}
            >
              {pt ? 'há quanto tempo\nvocê tenta parar?' : 'how long have you\nbeen trying to stop?'}
            </Animated.Text>

            <Animated.Text
              entering={FadeInUp.delay(150).duration(500)}
              style={[styles.stepSub, { color: colors.text.secondary }]}
            >
              {pt ? 'não existe resposta errada.' : 'there\'s no wrong answer.'}
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.historyOptions}>
              {HISTORY_OPTIONS.map((opt, i) => (
                <Pressable
                  key={opt.id}
                  style={({ pressed }) => [
                    styles.historyOption,
                    {
                      borderColor: selected === opt.id ? colors.accent.primary : colors.border,
                      backgroundColor: selected === opt.id ? `${colors.accent.primary}12` : colors.bg.card,
                    },
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => onSelect(opt)}
                >
                  <Text style={[styles.historyText, { color: selected === opt.id ? colors.accent.primary : colors.text.primary }]}>
                    {pt ? opt.pt : opt.en}
                  </Text>
                </Pressable>
              ))}
            </Animated.View>
          </>
        ) : (
          <Animated.View entering={FadeIn.duration(500)} style={styles.responseBlock}>
            <Text style={[styles.responseText, { color: colors.text.primary }]}>
              {selectedOpt ? (pt ? selectedOpt.responsePt : selectedOpt.responseEn) : ''}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

// ── Step 3: Money + launch ────────────────────────────────────────────────────

function StepMoney({
  colors, pt, habitName, money, setMoney, onFinish,
}: { colors: any; pt: boolean; habitName: string; money: string; setMoney: (v: string) => void; onFinish: () => void }) {
  return (
    <KeyboardAvoidingView
      style={styles.step}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.stepContent}>
        <Animated.Text
          entering={FadeInUp.duration(500)}
          style={[styles.habitEcho, { color: colors.accent.primary }]}
        >
          {habitName}
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(150).duration(500)}
          style={[styles.stepHeadline, { color: colors.text.primary }]}
        >
          {pt ? 'quanto você gasta\ncom isso por dia?' : 'how much do you\nspend on this per day?'}
        </Animated.Text>

        <Animated.Text
          entering={FadeInUp.delay(250).duration(500)}
          style={[styles.stepSub, { color: colors.text.secondary }]}
        >
          {pt
            ? 'usamos pra mostrar quanto você vai economizar.\npode pular se preferir.'
            : 'we use this to show how much you\'ll save.\nskip if you prefer.'}
        </Animated.Text>

        <Animated.View
          entering={FadeInUp.delay(350).duration(500)}
          style={styles.moneyWrap}
        >
          <Text style={[styles.currencySymbol, { color: colors.text.muted }]}>
            {pt ? 'R$' : '$'}
          </Text>
          <TextInput
            style={[styles.moneyInput, { color: colors.text.primary }]}
            placeholder="0"
            placeholderTextColor={colors.text.muted}
            value={money}
            onChangeText={setMoney}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={onFinish}
          />
          <View style={[styles.inputLine, { backgroundColor: money ? colors.accent.primary : colors.border }]} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.launchBlock}>
          <Pressable
            onPress={onFinish}
            style={({ pressed }) => [
              styles.launchBtn,
              { backgroundColor: colors.accent.primary },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.launchText, { color: colors.bg.primary }]}>
              {pt ? 'começar minha jornada' : 'start my journey'}
            </Text>
          </Pressable>

          {!!money === false && (
            <Pressable onPress={onFinish} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: colors.text.muted }]}>
                {pt ? 'pular' : 'skip'}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeTop: { alignItems: 'center', paddingBottom: 8 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 4, borderRadius: 2 },
  stepContainer: { flex: 1 },
  step: { flex: 1, paddingHorizontal: spacing.lg },
  stepScroll: { paddingBottom: 40 },
  stepContent: { flex: 1, justifyContent: 'center' },
  centerBlock: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ctaBlock: { alignItems: 'center', paddingBottom: 16, paddingTop: 32 },

  // Welcome
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 48,
  },
  welcomeHeadline: {
    fontSize: 30,
    fontWeight: '200',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 36,
  },
  welcomeBody: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 24,
  },
  primaryBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '400', letterSpacing: 0.5 },

  // Steps
  stepHeadline: {
    fontSize: 28,
    fontWeight: '200',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 14,
  },
  stepSub: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 22,
    marginBottom: 32,
  },
  textBtn: { fontSize: 16, fontWeight: '400', letterSpacing: 0.3 },

  // Habit input
  inputWrap: { marginBottom: 28 },
  habitInput: {
    fontSize: 22,
    fontWeight: '200',
    paddingVertical: 8,
    letterSpacing: -0.3,
  },
  inputLine: { height: 0.5 },

  // Pills
  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  pill: {
    borderWidth: 0.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: { fontSize: 13, fontWeight: '400' },

  // History
  historyOptions: { gap: 10 },
  historyOption: {
    borderWidth: 0.5,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  historyText: { fontSize: 15, fontWeight: '300', lineHeight: 22 },
  responseBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  responseText: {
    fontSize: 26,
    fontWeight: '200',
    letterSpacing: -0.5,
    lineHeight: 38,
    textAlign: 'center',
  },

  // Money
  habitEcho: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  moneyWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 40 },
  currencySymbol: { fontSize: 22, fontWeight: '200', paddingBottom: 8 },
  moneyInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '200',
    letterSpacing: -1,
    paddingVertical: 4,
    includeFontPadding: false,
  },
  launchBlock: { gap: 14, alignItems: 'center' },
  launchBtn: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  launchText: { fontSize: 16, fontWeight: '600', letterSpacing: 0.3 },
  skipBtn: { paddingVertical: 8 },
  skipText: { fontSize: 13, letterSpacing: 0.5 },
});
