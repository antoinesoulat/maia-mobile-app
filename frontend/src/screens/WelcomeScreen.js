import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { colors, fonts, radius, spacing, type } from '../theme';

const maiaIcon = require('../../assets/maia-app-icon.png');

const phases = ['Cycle', 'Run', 'Energy'];
const benefits = [
  {
    label: 'Cycle',
    text: 'Des seances adaptees aux 4 phases hormonales.'
  },
  {
    label: 'Progression',
    text: 'De la debutante a la sportive confirmee, sans pression.'
  },
  {
    label: 'Bien-etre',
    text: 'Moins de culpabilite les jours ou le corps demande du calme.'
  }
];

export function WelcomeScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.84)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        duration: 520,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true
      }),
      Animated.spring(logoScale, {
        friction: 7,
        tension: 78,
        toValue: 1,
        useNativeDriver: true
      }),
      Animated.timing(contentOpacity, {
        delay: 380,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true
      })
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(float, {
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          toValue: 0,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [contentOpacity, float, logoOpacity, logoScale]);

  const floatUp = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14]
  });

  const floatDown = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16]
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Animated.View
          pointerEvents="none"
          style={[styles.patternLayer, { transform: [{ translateY: floatUp }] }]}
        >
          {Array.from({ length: 13 }).map((_, index) => (
            <Text
              key={index}
              style={[
                styles.patternMark,
                {
                  left: `${(index * 31) % 92}%`,
                  top: `${(index * 17) % 94}%`,
                  transform: [{ rotate: index % 2 ? '-12deg' : '10deg' }]
                }
              ]}
            >
              m
            </Text>
          ))}
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.sun, { opacity: contentOpacity, transform: [{ translateY: floatDown }] }]}
        />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Animated.View
              style={[styles.logoHalo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
            >
              <Image source={maiaIcon} style={styles.logo} />
            </Animated.View>

            <Animated.View style={[styles.copy, { opacity: contentOpacity }]}>
              <Text style={styles.eyebrow}>MAIA - JUST FOR HER</Text>
              <Text style={styles.title}>Courir avec son corps.</Text>
              <Text style={styles.subtitle}>
                Maia adapte tes entrainements a ton cycle, ton energie et ton rythme de vie.
              </Text>

              <View style={styles.phaseRow}>
                {phases.map((phase, index) => (
                  <View
                    key={phase}
                    style={[styles.phasePill, index === 1 && styles.phasePillActive]}
                  >
                    <Text style={[styles.phaseText, index === 1 && styles.phaseTextActive]}>
                      {phase}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>

          <Animated.View style={[styles.storyPanel, { opacity: contentOpacity }]}>
            <Text style={styles.storyTitle}>Le running pense pour la physiologie feminine.</Text>
            <Text style={styles.storyText}>
              Maia transforme le cycle en rythme d'entrainement, pas en obstacle. Intensite,
              recuperation et conseils evoluent avec ce que ton corps vit.
            </Text>

            <View style={styles.benefitList}>
              {benefits.map((benefit) => (
                <View key={benefit.label} style={styles.benefitItem}>
                  <Text style={styles.benefitLabel}>{benefit.label}</Text>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.actionStack, { opacity: contentOpacity }]}>
            <BrandButton onPress={() => navigation.navigate('Register')}>
              Rejoins l'aventure
            </BrandButton>
            <BrandButton onPress={() => navigation.navigate('Login')} variant="ghost">
              J'ai deja un compte
            </BrandButton>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.ink,
    flex: 1
  },
  screen: {
    backgroundColor: colors.ink,
    flex: 1,
    overflow: 'hidden'
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 22,
    paddingHorizontal: spacing.xl,
    paddingTop: 22
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22
  },
  patternMark: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 72,
    fontStyle: 'italic',
    letterSpacing: 0,
    lineHeight: 78,
    position: 'absolute'
  },
  sun: {
    backgroundColor: colors.honey,
    borderRadius: 190,
    height: 260,
    position: 'absolute',
    right: -96,
    top: 84,
    width: 260
  },
  hero: {
    justifyContent: 'center',
    minHeight: 430,
    paddingTop: 16
  },
  logoHalo: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.honeySoft,
    borderColor: 'rgba(249, 244, 184, 0.34)',
    borderRadius: 42,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    shadowColor: colors.honey,
    shadowOpacity: 0.26,
    shadowRadius: 28,
    width: 112
  },
  logo: {
    borderRadius: 30,
    height: 86,
    width: 86
  },
  copy: {
    maxWidth: 330
  },
  eyebrow: {
    ...type.eyebrow,
    color: colors.rose,
    marginBottom: 14
  },
  title: {
    ...type.title,
    color: colors.white,
    marginBottom: 18
  },
  subtitle: {
    ...type.body,
    color: colors.cream,
    marginBottom: 26
  },
  phaseRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  phasePill: {
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: spacing.sm
  },
  phasePillActive: {
    backgroundColor: colors.honey,
    borderColor: colors.honey
  },
  phaseText: {
    ...type.eyebrow,
    color: colors.white
  },
  phaseTextActive: {
    color: colors.ink
  },
  actionStack: {
    gap: spacing.md,
    paddingBottom: spacing.xs
  },
  storyPanel: {
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg
  },
  storyTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: 0,
    lineHeight: 27
  },
  storyText: {
    color: colors.cream,
    fontFamily: fonts.body,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 21
  },
  benefitList: {
    gap: spacing.md
  },
  benefitItem: {
    borderTopColor: 'rgba(255, 255, 255, 0.14)',
    borderTopWidth: 1,
    gap: spacing.xs,
    paddingTop: spacing.md
  },
  benefitLabel: {
    ...type.eyebrow,
    color: colors.honey,
    textTransform: 'uppercase'
  },
  benefitText: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20
  }
});
