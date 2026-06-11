import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { colors, fonts, radius, spacing, type } from '../theme';

const maiaIcon = require('../../assets/maia-app-icon.png');

const phases = ['Cycle', 'Run', 'Energy'];

export function WelcomeScreen() {
  const logoScale = useRef(new Animated.Value(0.84)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
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
      }),
      Animated.timing(progress, {
        delay: 520,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: false
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
  }, [contentOpacity, float, logoOpacity, logoScale, progress]);

  const floatUp = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14]
  });

  const floatDown = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16]
  });

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['8%', '100%']
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
              Des entrainements qui suivent ton cycle, ton energie et ton rythme du jour.
            </Text>

            <View style={styles.phaseRow}>
              {phases.map((phase, index) => (
                <View key={phase} style={[styles.phasePill, index === 1 && styles.phasePillActive]}>
                  <Text style={[styles.phaseText, index === 1 && styles.phaseTextActive]}>
                    {phase}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        <Animated.View style={[styles.launchPanel, { opacity: contentOpacity }]}>
          <View style={styles.launchHeader}>
            <Text style={styles.launchLabel}>Lancement</Text>
            <Text style={styles.launchState}>Pret</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <BrandButton>Ouvrir Maia</BrandButton>
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
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
    paddingVertical: 22
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
    flex: 1,
    justifyContent: 'center',
    paddingTop: 28
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
  launchPanel: {
    gap: spacing.lg,
    paddingBottom: spacing.xs
  },
  launchHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  launchLabel: {
    ...type.eyebrow,
    color: colors.white,
    textTransform: 'uppercase'
  },
  launchState: {
    ...type.eyebrow,
    color: colors.honey,
    textTransform: 'uppercase'
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: radius.round,
    height: 8,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: colors.rose,
    borderRadius: radius.round,
    height: '100%'
  }
});
