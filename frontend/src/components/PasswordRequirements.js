import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme';
import { passwordRules } from '../utils/validation';

export function PasswordRequirements({ password }) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.panel}>
      <Text style={styles.title}>Ton mot de passe doit contenir :</Text>
      <View style={styles.grid}>
        {passwordRules.map((rule) => {
          const isMet = rule.test(password);

          return (
            <View key={rule.key} style={styles.rule}>
              <View style={[styles.status, isMet && styles.statusMet]}>
                <Text style={[styles.statusText, isMet && styles.statusTextMet]}>
                  {isMet ? 'OK' : '-'}
                </Text>
              </View>
              <Text style={[styles.ruleText, isMet && styles.ruleTextMet]}>{rule.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  rule: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm
  },
  ruleText: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 12,
    letterSpacing: 0
  },
  ruleTextMet: {
    color: colors.success
  },
  status: {
    alignItems: 'center',
    borderColor: colors.borderLight,
    borderRadius: 4,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 28
  },
  statusMet: {
    backgroundColor: colors.success,
    borderColor: colors.success
  },
  statusText: {
    color: colors.muted,
    fontFamily: fonts.strong,
    fontSize: 9,
    letterSpacing: 0
  },
  statusTextMet: {
    color: colors.ink
  },
  title: {
    color: colors.cream,
    fontFamily: fonts.strong,
    fontSize: 12,
    letterSpacing: 0
  }
});
