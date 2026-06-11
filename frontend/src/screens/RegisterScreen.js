import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { TextField } from '../components/TextField';
import { AuthScreenLayout } from './AuthScreenLayout';
import { colors, fonts, spacing } from '../theme';

export function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreenLayout
      eyebrow="Inscription"
      footer={
        <Pressable onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
          <Text style={styles.footerText}>J'ai deja un compte</Text>
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
      <BrandButton>Continuer</BrandButton>
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
