import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const maiaIcon = require('./assets/maia-app-icon.png');

const phases = ['Cycle', 'Run', 'Energy'];

export default function App() {
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
      <StatusBar style="light" />
      <View style={styles.screen}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.patternLayer,
            {
              transform: [{ translateY: floatUp }]
            }
          ]}
        >
          {Array.from({ length: 13 }).map((_, index) => (
            <View
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
            </View>
          ))}
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.sun,
            {
              opacity: contentOpacity,
              transform: [{ translateY: floatDown }]
            }
          ]}
        />

        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.logoHalo,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }]
              }
            ]}
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
          <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}>
            <Text style={styles.ctaText}>Ouvrir Maia</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0F0F0F',
    flex: 1
  },
  screen: {
    backgroundColor: '#0F0F0F',
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 22
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.22
  },
  patternMark: {
    color: '#FFFFFF',
    fontSize: 72,
    fontStyle: 'italic',
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 78,
    position: 'absolute'
  },
  sun: {
    backgroundColor: '#FBF4B0',
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
    backgroundColor: 'rgba(251, 244, 176, 0.14)',
    borderColor: 'rgba(251, 244, 176, 0.34)',
    borderRadius: 42,
    borderWidth: 1,
    height: 112,
    justifyContent: 'center',
    marginBottom: 34,
    shadowColor: '#FBF4B0',
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
    color: '#D54588',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 14
  },
  title: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 48,
    marginBottom: 18
  },
  subtitle: {
    color: '#F4F1DA',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 25,
    marginBottom: 26
  },
  phaseRow: {
    flexDirection: 'row',
    gap: 8
  },
  phasePill: {
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  phasePillActive: {
    backgroundColor: '#FBF4B0',
    borderColor: '#FBF4B0'
  },
  phaseText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0
  },
  phaseTextActive: {
    color: '#0F0F0F'
  },
  launchPanel: {
    gap: 16,
    paddingBottom: 6
  },
  launchHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  launchLabel: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  launchState: {
    color: '#FBF4B0',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: '#D54588',
    borderRadius: 999,
    height: '100%'
  },
  cta: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minHeight: 54,
    justifyContent: 'center'
  },
  ctaPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  ctaText: {
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0
  }
});
