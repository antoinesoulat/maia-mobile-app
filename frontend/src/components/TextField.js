import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme';

export function TextField({
  autoCapitalize = 'none',
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  value
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: spacing.lg
  },
  label: {
    color: colors.cream,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0
  }
});
