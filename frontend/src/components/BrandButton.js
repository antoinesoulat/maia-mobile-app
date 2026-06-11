import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, type } from '../theme';

export function BrandButton({ children, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{children}</Text>
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
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  }
});
