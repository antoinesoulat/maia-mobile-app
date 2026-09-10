import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { colors, fonts, radius, spacing, type } from '../theme';

const maiaIcon = require('../../assets/maia-app-icon.png');

export function HomeScreen({ navigation, onLogout }) {
  const handleLogout = async () => {
    await onLogout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }]
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Image source={maiaIcon} style={styles.logo} />
          <Text style={styles.eyebrow}>ESPACE MAIA</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Bienvenue dans l'aventure.</Text>
          <Text style={styles.subtitle}>
            Ton compte est pret. Prochaine etape : completer ton profil pour adapter tes runs a ton
            cycle.
          </Text>
        </View>

        <BrandButton onPress={handleLogout} variant="ghost">
          Se deconnecter
        </BrandButton>
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
    padding: spacing.xl
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md
  },
  logo: {
    borderRadius: radius.sm,
    height: 48,
    width: 48
  },
  eyebrow: {
    ...type.eyebrow,
    color: colors.rose
  },
  content: {
    gap: spacing.lg
  },
  title: {
    ...type.title,
    color: colors.white
  },
  subtitle: {
    color: colors.cream,
    fontFamily: fonts.body,
    fontSize: 17,
    letterSpacing: 0,
    lineHeight: 25
  }
});
