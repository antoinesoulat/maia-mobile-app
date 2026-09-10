import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { TextField } from '../components/TextField';
import { AuthScreenLayout } from './AuthScreenLayout';
import { registerUser } from '../services/authApi';
import { colors, fonts, spacing } from '../theme';

export function RegisterScreen({ navigation, onAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = name.trim().length >= 2 && email.trim().length > 0 && password.length >= 8;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const authData = await registerUser({
        email: email.trim().toLowerCase(),
        name: name.trim(),
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
      eyebrow="Inscription"
      footer={
        <Pressable onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
          <Text style={styles.footerText}>Deja un compte ? Connectez-vous</Text>
        </Pressable>
      }
      subtitle="Commence par les bases. Ton profil sportif et ton cycle viendront juste apres."
      title="Cree ton espace Maia."
    >
      <TextField
        autoCapitalize="words"
        label="Prenom"
        onChangeText={setName}
        placeholder="Ton prenom"
        value={name}
      />
      <TextField
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="toi@email.com"
        value={email}
      />
      <TextField
        label="Mot de passe"
        onChangeText={setPassword}
        placeholder="8 caracteres minimum"
        secureTextEntry
        value={password}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <BrandButton disabled={!canSubmit || isSubmitting} onPress={handleSubmit}>
        {isSubmitting ? 'Creation...' : 'Creer le compte'}
      </BrandButton>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
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
  },
  error: {
    color: colors.rose,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center'
  }
});
