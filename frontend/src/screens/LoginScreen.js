import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { TextField } from '../components/TextField';
import { AuthScreenLayout } from './AuthScreenLayout';
import { loginUser } from '../services/authApi';
import { colors, fonts, radius, spacing, type } from '../theme';

const maiaIcon = require('../../assets/maia-app-icon.png');

export function LoginScreen({ navigation, onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = email.trim().length > 0 && password.length >= 8;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const authData = await loginUser({
        email: email.trim().toLowerCase(),
        password
      });

      await onAuthenticated(authData);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenLayout
      eyebrow="Connexion"
      footer={
        <Pressable onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
          <Text style={styles.footerText}>Pas encore de compte ? Creer ton espace Maia</Text>
        </Pressable>
      }
      subtitle="Retrouve ton rythme, tes phases et ton entrainement du jour."
      title="Ravie de te revoir."
      topAccessory={
        <View style={styles.brandLockup}>
          <Image source={maiaIcon} style={styles.logo} />
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseBadgeText}>JUST FOR HER</Text>
          </View>
        </View>
      }
    >
      <TextField
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="toi@email.com"
        returnKeyType="next"
        textContentType="emailAddress"
        value={email}
      />
      <TextField
        autoComplete="password"
        label="Mot de passe"
        onChangeText={setPassword}
        placeholder="8 caracteres minimum"
        returnKeyType="done"
        secureTextEntry
        textContentType="password"
        value={password}
      />
      <Pressable style={styles.forgotButton}>
        <Text style={styles.forgotText}>Mot de passe oublie ?</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <BrandButton disabled={!canSubmit || isSubmitting} onPress={handleSubmit}>
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </BrandButton>
      <Text style={styles.notice}>
        Maia accompagne ton entrainement. L'application ne remplace pas un avis medical.
      </Text>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  brandLockup: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md
  },
  logo: {
    borderRadius: 18,
    height: 52,
    width: 52
  },
  phaseBadge: {
    backgroundColor: colors.honey,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  phaseBadgeText: {
    ...type.eyebrow,
    color: colors.ink
  },
  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: 36,
    justifyContent: 'center'
  },
  forgotText: {
    color: colors.honey,
    fontFamily: fonts.strong,
    fontSize: 14,
    letterSpacing: 0
  },
  notice: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center'
  },
  error: {
    color: colors.rose,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center'
  },
  footerLink: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md
  },
  footerText: {
    color: colors.honey,
    fontFamily: fonts.strong,
    fontSize: 14,
    letterSpacing: 0,
    textAlign: 'center'
  }
});
