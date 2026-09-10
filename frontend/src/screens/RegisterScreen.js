import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { TextField } from '../components/TextField';
import { AuthScreenLayout } from './AuthScreenLayout';
import { registerUser } from '../services/authApi';
import { colors, fonts, radius, spacing, type } from '../theme';

const steps = ['Compte', 'Profil', 'Cycle'];
const levels = [
  { label: 'Debutante', value: 'debutante' },
  { label: 'Intermediaire', value: 'intermediaire' },
  { label: 'Avancee', value: 'avancee' }
];
const goals = [
  { label: 'Regularite', value: 'regularite' },
  { label: 'Endurance', value: 'endurance' },
  { label: 'Performance', value: 'performance' }
];

export function RegisterScreen({ navigation, onAuthenticated }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('debutante');
  const [goal, setGoal] = useState('regularite');
  const [cycleStartDate, setCycleStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [cycleLength, setCycleLength] = useState('28');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountIsValid = name.trim().length >= 2 && email.trim().length > 0 && password.length >= 8;
  const cycleLengthValue = Number(cycleLength);
  const cycleIsValid =
    /^\d{4}-\d{2}-\d{2}$/.test(cycleStartDate) && cycleLengthValue >= 21 && cycleLengthValue <= 40;
  const canSubmit = accountIsValid && cycleIsValid;

  const goNext = () => {
    setError('');

    if (step === 0 && !accountIsValid) {
      setError('Complete ton prenom, ton email et un mot de passe de 8 caracteres.');
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, steps.length - 1));
  };

  const goBack = () => {
    setError('');
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      if (!cycleIsValid) {
        setError('Renseigne une date au format AAAA-MM-JJ et une duree entre 21 et 40 jours.');
      }

      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const authData = await registerUser({
        cycle_length: cycleLengthValue,
        cycle_start_date: cycleStartDate,
        email: email.trim().toLowerCase(),
        goal,
        level,
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
        <BrandButton onPress={() => navigation.navigate('Login')} variant="ghost">
          Deja un compte ? Connectez-vous
        </BrandButton>
      }
      subtitle="Cree ton compte, puis donne a Maia les infos utiles pour adapter tes premieres seances."
      title="Cree ton espace Maia."
    >
      <View style={styles.stepper}>
        {steps.map((stepLabel, index) => (
          <View key={stepLabel} style={[styles.stepDot, index <= step && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, index <= step && styles.stepDotTextActive]}>
              {index + 1}
            </Text>
          </View>
        ))}
      </View>

      {step === 0 ? (
        <View style={styles.stepContent}>
          <TextField
            autoCapitalize="words"
            label="Prenom"
            onChangeText={setName}
            placeholder="Ton prenom"
            returnKeyType="next"
            value={name}
          />
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
            autoComplete="new-password"
            label="Mot de passe"
            onChangeText={setPassword}
            onSubmitEditing={goNext}
            placeholder="8 caracteres minimum"
            returnKeyType="next"
            secureTextEntry
            textContentType="newPassword"
            value={password}
          />
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.stepContent}>
          <View style={styles.optionGroup}>
            <Text style={styles.groupLabel}>Ton niveau</Text>
            <View style={styles.optionGrid}>
              {levels.map((option) => (
                <BrandButton
                  key={option.value}
                  onPress={() => setLevel(option.value)}
                  variant={level === option.value ? 'secondary' : 'ghost'}
                >
                  {option.label}
                </BrandButton>
              ))}
            </View>
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.groupLabel}>Ton objectif</Text>
            <View style={styles.optionGrid}>
              {goals.map((option) => (
                <BrandButton
                  key={option.value}
                  onPress={() => setGoal(option.value)}
                  variant={goal === option.value ? 'secondary' : 'ghost'}
                >
                  {option.label}
                </BrandButton>
              ))}
            </View>
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.stepContent}>
          <Text style={styles.helper}>
            Ces infos servent a placer ton entrainement dans la bonne phase du cycle.
          </Text>
          <TextField
            keyboardType="numbers-and-punctuation"
            label="Debut des dernieres regles"
            onChangeText={setCycleStartDate}
            placeholder="AAAA-MM-JJ"
            returnKeyType="next"
            value={cycleStartDate}
          />
          <TextField
            keyboardType="number-pad"
            label="Duree moyenne du cycle"
            onChangeText={setCycleLength}
            onSubmitEditing={handleSubmit}
            placeholder="28"
            returnKeyType="done"
            value={cycleLength}
          />
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        {step > 0 ? (
          <BrandButton disabled={isSubmitting} onPress={goBack} variant="ghost">
            Retour
          </BrandButton>
        ) : null}
        {step < steps.length - 1 ? (
          <BrandButton onPress={goNext}>Continuer</BrandButton>
        ) : (
          <BrandButton disabled={!canSubmit || isSubmitting} onPress={handleSubmit}>
            {isSubmitting ? 'Creation...' : 'Creer le compte'}
          </BrandButton>
        )}
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  stepDot: {
    alignItems: 'center',
    borderColor: colors.borderLight,
    borderRadius: radius.round,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32
  },
  stepDotActive: {
    backgroundColor: colors.honey,
    borderColor: colors.honey
  },
  stepDotText: {
    ...type.eyebrow,
    color: colors.white
  },
  stepDotTextActive: {
    color: colors.ink
  },
  stepContent: {
    gap: spacing.lg
  },
  optionGroup: {
    gap: spacing.md
  },
  optionGrid: {
    gap: spacing.sm
  },
  groupLabel: {
    color: colors.cream,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0
  },
  helper: {
    color: colors.cream,
    fontFamily: fonts.body,
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm
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
