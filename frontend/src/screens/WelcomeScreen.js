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

const phases = ['Cycle', 'Run', 'Énergie'];
const benefits = [
  {
    label: 'Cycle',
    text: 'Séances adaptées.'
  },
  {
    label: 'Progression',
    text: 'Rythme juste.'
  },
  {
    label: 'Bien-être',
    text: 'Moins de pression.'
  }
];

export function WelcomeScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.84)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const splashPulse = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(splashPulse, {
          duration: 620,
          easing: Easing.inOut(Easing.cubic),
          toValue: 1.08,
          useNativeDriver: true
        }),
        Animated.timing(splashPulse, {
          duration: 620,
          easing: Easing.inOut(Easing.cubic),
          toValue: 1,
          useNativeDriver: true
        })
      ])
    );

    const floatAnimation = Animated.loop(
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
    );

    pulseAnimation.start();
    floatAnimation.start();

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
      })
    ]).start();

    const introTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(splashOpacity, {
          duration: 640,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true
        }),
        Animated.timing(contentOpacity, {
          duration: 680,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true
        })
      ]).start();
    }, 1000);

    return () => {
      clearTimeout(introTimer);
      pulseAnimation.stop();
      floatAnimation.stop();
    };
  }, [contentOpacity, float, logoOpacity, logoScale, splashOpacity, splashPulse]);

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
              <Text style={styles.eyebrow}>MAÏA - JUST FOR HER</Text>
              <Text style={styles.title}>Courir avec son corps.</Text>
              <Text style={styles.subtitle}>
                Des runs ajustés à ton cycle, ton énergie et tes objectifs.
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
            <View style={styles.visualRow}>
              <View style={styles.visualCard}>
                <Image source={maiaIcon} style={styles.visualImage} />
                <Text style={styles.visualLabel}>Phase actuelle</Text>
              </View>
              <View style={[styles.visualCard, styles.visualCardActive]}>
                <Image source={maiaIcon} style={styles.visualImageSmall} />
                <Text style={styles.visualLabelActive}>Run du jour</Text>
              </View>
            </View>

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
              J'ai déjà un compte
            </BrandButton>
          </Animated.View>
        </ScrollView>

        <Animated.View pointerEvents="none" style={[styles.splash, { opacity: splashOpacity }]}>
          <Animated.Image
            source={maiaIcon}
            style={[styles.splashLogo, { transform: [{ scale: splashPulse }] }]}
          />
        </Animated.View>
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
    paddingBottom: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: 30
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: colors.rose,
    justifyContent: 'center',
    zIndex: 10
  },
  splashLogo: {
    borderRadius: 42,
    height: 132,
    width: 132
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
    minHeight: 390,
    paddingTop: 10
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
    marginBottom: 44,
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
    marginBottom: 24
  },
  subtitle: {
    ...type.body,
    color: colors.cream,
    marginBottom: 34
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
    gap: 28,
    marginBottom: 34
  },
  visualRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  visualCard: {
    backgroundColor: colors.honeySoft,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    minHeight: 156,
    overflow: 'hidden',
    padding: spacing.md
  },
  visualCardActive: {
    backgroundColor: colors.honey
  },
  visualImage: {
    alignSelf: 'center',
    borderRadius: 30,
    height: 86,
    marginBottom: spacing.lg,
    width: 86
  },
  visualImageSmall: {
    alignSelf: 'center',
    borderRadius: 24,
    height: 70,
    marginBottom: 32,
    marginTop: spacing.sm,
    width: 70
  },
  visualLabel: {
    ...type.eyebrow,
    color: colors.white,
    textTransform: 'uppercase'
  },
  visualLabelActive: {
    ...type.eyebrow,
    color: colors.ink,
    textTransform: 'uppercase'
  },
  benefitList: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  benefitItem: {
    flex: 1,
    gap: spacing.xs,
    minHeight: 84
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
