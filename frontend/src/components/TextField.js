import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme';

export function TextField({
  autoCapitalize = 'none',
  autoComplete,
  blurOnSubmit,
  editable = true,
  error,
  helperText,
  keyboardType = 'default',
  label,
  maxLength,
  onBlur,
  onChangeText,
  onFocus,
  onSubmitEditing,
  placeholder,
  returnKeyType,
  secureTextEntry = false,
  textContentType,
  value
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputShell, isFocused && styles.inputFocused, error && styles.inputError]}
      >
        <TextInput
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          blurOnSubmit={blurOnSubmit}
          editable={editable}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={styles.input}
          textContentType={textContentType}
          value={value}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityLabel={
              isPasswordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
            }
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
            style={styles.visibilityButton}
          >
            <Text style={styles.visibilityText}>{isPasswordVisible ? 'Masquer' : 'Afficher'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm
  },
  error: {
    color: colors.roseLight,
    fontFamily: fonts.strong,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 17
  },
  helper: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 17
  },
  input: {
    color: colors.white,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 54,
    overflow: 'hidden'
  },
  inputFocused: {
    backgroundColor: colors.surface,
    borderColor: colors.honey,
    borderWidth: 2
  },
  inputError: {
    borderColor: colors.roseLight
  },
  label: {
    color: colors.cream,
    fontFamily: fonts.strong,
    fontSize: 13,
    letterSpacing: 0
  },
  visibilityButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    minWidth: 76,
    paddingHorizontal: spacing.md
  },
  visibilityText: {
    color: colors.honey,
    fontFamily: fonts.strong,
    fontSize: 12,
    letterSpacing: 0
  }
});
