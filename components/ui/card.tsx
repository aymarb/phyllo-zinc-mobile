import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ViewProps,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, Spacing, Shadows } from '@/constants';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  ...props
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
    };

    // Variant styles
    switch (variant) {
      case 'elevated':
        Object.assign(baseStyle, Shadows.md);
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
        break;
      default:
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.border;
    }

    // Padding styles
    switch (padding) {
      case 'none':
        baseStyle.padding = 0;
        break;
      case 'sm':
        baseStyle.padding = Spacing.sm;
        break;
      case 'lg':
        baseStyle.padding = Spacing.xl;
        break;
      default:
        baseStyle.padding = Spacing.lg;
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}
