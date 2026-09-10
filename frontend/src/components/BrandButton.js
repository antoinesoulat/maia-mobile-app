import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, type } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BrandButton({ children, disabled = false, onPress, variant = 'primary' }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue) => {
    Animated.spring(scale, {
      damping: 14,
      mass: 0.7,
      stiffness: 220,
      toValue,
      useNativeDriver: true
    }).start();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && styles.pressed,
        { transform: [{ scale }] }
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'ghost' && styles.ghostLabel,
          disabled && styles.disabledLabel
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
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
  disabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)'
  },
  disabledLabel: {
    color: colors.muted
  },
  pressed: {
    opacity: 0.86
  }
});
