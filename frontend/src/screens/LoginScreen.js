import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { TextField } from '../components/TextField';
import { AuthScreenLayout } from './AuthScreenLayout';
import { colors, fonts, spacing } from '../theme';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreenLayout
      eyebrow="Connexion"
      footer={
        <Pressable onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
          <Text style={styles.footerText}>Pas encore de compte ? Creer ton espace Maia</Text>
        </Pressable>
      }
      subtitle="Retrouve ton rythme, tes phases et tes recommandations la ou tu les as laissees."
      title="Ravie de te revoir."
    >
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
      <BrandButton>Se connecter</BrandButton>
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
  }
});
