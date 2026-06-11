import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { colors, fonts, spacing } from '../theme';

const meshLines = Array.from({ length: 22 }, (_, index) => index);

function OrganicMesh() {
  return (
    <View pointerEvents="none" style={styles.meshWrap}>
      <View style={styles.glow} />
      <View style={styles.meshCore}>
        {meshLines.map((line) => (
          <View
            key={line}
            style={[
              styles.meshLine,
              {
                borderColor:
                  line % 3 === 0 ? 'rgba(207, 255, 186, 0.72)' : 'rgba(104, 189, 91, 0.56)',
                height: 86 + line * 5,
                opacity: 0.9 - line * 0.022,
                transform: [
                  { translateX: -88 + line * 9 },
                  { translateY: -18 + Math.sin(line) * 18 },
                  { rotate: `${-24 + line * 2.4}deg` }
                ],
                width: 350 + line * 11
              }
            ]}
          />
        ))}
      </View>
      <View style={styles.meshShadow} />
    </View>
  );
}

export function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>
            Real-Time{'\n'}
            Feedback, <Text style={styles.titleMuted}>Real</Text>
            {'\n'}
            Results
          </Text>
        </View>

        <View style={styles.visualArea}>
          <OrganicMesh />
          <View style={[styles.floatingPill, styles.chatPill]}>
            <Text style={styles.pillText}>Coach Maia</Text>
          </View>
          <View style={[styles.floatingPill, styles.goalPill]}>
            <Text style={styles.pillText}>Ton objectif</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <BrandButton onPress={() => {}} variant="mint">
            Se connecter
          </BrandButton>
          <Pressable onPress={() => navigation.navigate('Register')} style={styles.signup}>
            <Text style={styles.signupText}>
              Pas encore de compte ? <Text style={styles.signupStrong}>Créer un compte</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAF9',
    flex: 1
  },
  screen: {
    backgroundColor: '#F8FAF9',
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingBottom: 42,
    paddingHorizontal: 26,
    paddingTop: 50
  },
  titleBlock: {
    zIndex: 2
  },
  title: {
    color: '#25282C',
    fontFamily: fonts.body,
    fontSize: 48,
    letterSpacing: 0,
    lineHeight: 60
  },
  titleMuted: {
    color: '#A9AAAD'
  },
  visualArea: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: -26,
    marginTop: -8,
    minHeight: 390,
    position: 'relative'
  },
  meshWrap: {
    height: 380,
    left: -92,
    position: 'absolute',
    right: -92,
    top: 60
  },
  glow: {
    backgroundColor: 'rgba(183, 245, 146, 0.38)',
    borderRadius: 160,
    bottom: -46,
    height: 210,
    left: 36,
    position: 'absolute',
    width: 250
  },
  meshCore: {
    height: 330,
    left: -8,
    position: 'absolute',
    right: -8,
    top: 14,
    transform: [{ rotate: '-10deg' }]
  },
  meshLine: {
    borderRadius: 260,
    borderWidth: 1.2,
    left: 0,
    position: 'absolute',
    top: 102
  },
  meshShadow: {
    backgroundColor: 'rgba(15, 61, 38, 0.32)',
    borderRadius: 150,
    height: 190,
    left: 110,
    position: 'absolute',
    top: 102,
    transform: [{ rotate: '-16deg' }],
    width: 245
  },
  floatingPill: {
    backgroundColor: colors.moss,
    borderRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    position: 'absolute',
    zIndex: 3
  },
  chatPill: {
    right: 42,
    top: 168
  },
  goalPill: {
    left: 38,
    top: 262
  },
  pillText: {
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 17,
    letterSpacing: 0
  },
  footer: {
    gap: 18,
    zIndex: 4
  },
  signup: {
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center'
  },
  signupText: {
    color: '#77808C',
    fontFamily: fonts.body,
    fontSize: 14,
    letterSpacing: 0
  },
  signupStrong: {
    color: colors.black,
    fontFamily: fonts.strong
  }
});
