import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, type } from '../theme';

export function BrandButton({ children, onPress, variant = 'primary' }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'ghost' && styles.ghostLabel
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    justifyContent: 'center',
    minHeight: 54
  },
  label: {
    ...type.action,
    color: colors.ink
  },
  secondary: {
    backgroundColor: colors.honey
  },
  secondaryLabel: {
    color: colors.ink
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.borderLight,
    borderWidth: 1
  },
  ghostLabel: {
    color: colors.white
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  }
});
