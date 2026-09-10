import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandButton } from '../components/BrandButton';
import { TextField } from '../components/TextField';
import { getProfile, updateProfile } from '../services/userApi';
import { colors, fonts, radius, spacing, type } from '../theme';

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

export function ProfileSetupScreen({ navigation }) {
  const [birthdate, setBirthdate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [level, setLevel] = useState('debutante');
  const [goal, setGoal] = useState('regularite');
  const [cycleStartDate, setCycleStartDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then(({ user }) => {
        setBirthdate(user.birthdate || '');
        setWeight(String(user.weight || ''));
        setHeight(String(user.height || ''));
        setLevel(user.level || 'debutante');
        setGoal(user.goal || 'regularite');
        setCycleStartDate(user.cycleStartDate || '');
        setCycleLength(String(user.cycleLength || 28));
      })
      .catch((nextError) => setError(nextError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await updateProfile({
        birthdate,
        cycle_length: Number(cycleLength),
        cycle_start_date: cycleStartDate,
        goal,
        height: Number(height),
        level,
        weight: Number(weight)
      });
      setSuccess('Profil sauvegarde.');
      navigation.navigate('Home');
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.honey} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PROFIL MVP</Text>
          <Text style={styles.title}>Personnalise tes runs.</Text>
          <Text style={styles.subtitle}>
            Maia utilise ces infos pour ajuster intensite, recuperation et rythme.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            keyboardType="numbers-and-punctuation"
            label="Date de naissance"
            onChangeText={setBirthdate}
            placeholder="AAAA-MM-JJ"
            value={birthdate}
          />
          <View style={styles.inlineFields}>
            <View style={styles.inlineField}>
              <TextField
                keyboardType="decimal-pad"
                label="Poids"
                onChangeText={setWeight}
                placeholder="60"
                value={weight}
              />
            </View>
            <View style={styles.inlineField}>
              <TextField
                keyboardType="number-pad"
                label="Taille"
                onChangeText={setHeight}
                placeholder="165"
                value={height}
              />
            </View>
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.groupLabel}>Niveau</Text>
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
            <Text style={styles.groupLabel}>Objectif</Text>
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

          <TextField
            keyboardType="numbers-and-punctuation"
            label="Debut des dernieres regles"
            onChangeText={setCycleStartDate}
            placeholder="AAAA-MM-JJ"
            value={cycleStartDate}
          />
          <TextField
            keyboardType="number-pad"
            label="Duree moyenne du cycle"
            onChangeText={setCycleLength}
            onSubmitEditing={handleSave}
            placeholder="28"
            returnKeyType="done"
            value={cycleLength}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
        </View>

        <View style={styles.actions}>
          <BrandButton disabled={isSaving} onPress={handleSave}>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder mon profil'}
          </BrandButton>
          <BrandButton onPress={() => navigation.goBack()} variant="ghost">
            Plus tard
          </BrandButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.ink,
    flex: 1
  },
  screen: {
    gap: spacing.xxl,
    padding: spacing.xl
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    gap: spacing.md
  },
  eyebrow: {
    ...type.eyebrow,
    color: colors.rose
  },
  title: {
    ...type.title,
    color: colors.white
  },
  subtitle: {
    color: colors.cream,
    fontFamily: fonts.body,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 23
  },
  form: {
    gap: spacing.lg
  },
  inlineFields: {
    flexDirection: 'row',
    gap: spacing.md
  },
  inlineField: {
    flex: 1
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
  actions: {
    gap: spacing.md
  },
  error: {
    color: colors.rose,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: 'center'
  },
  success: {
    backgroundColor: colors.honeySoft,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.honey,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    padding: spacing.md,
    textAlign: 'center'
  }
});
