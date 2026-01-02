/**
 * PhylloZinc Color Theme
 * Based on the green synthesis research website color scheme
 */

export const Colors = {
  light: {
    // Primary green theme
    primary: '#15803d', // green-700
    primaryLight: '#dcfce7', // green-100
    primaryDark: '#166534', // green-800
    primaryForeground: '#ffffff',
    
    // Background colors
    background: '#fafaf9', // stone-50 equivalent
    card: '#ffffff',
    cardAlt: '#f5f5f4', // stone-100
    cardForeground: '#1c1917', // stone-900
    
    // Text colors
    text: '#1c1917', // stone-900
    textMuted: '#78716c', // stone-500
    textSecondary: '#57534e', // stone-600
    
    // UI elements
    border: '#e7e5e4', // stone-200
    input: '#f5f5f4', // stone-100
    
    // Status colors
    success: '#15803d',
    warning: '#ca8a04', // yellow-600
    error: '#dc2626', // red-600
    info: '#2563eb', // blue-600
    
    // Accent
    accent: '#15803d',
    accentForeground: '#ffffff',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    // Primary green theme (lighter for dark mode)
    primary: '#22c55e', // green-500
    primaryLight: '#14532d', // green-900
    primaryDark: '#16a34a', // green-600
    primaryForeground: '#0c0a09', // stone-950
    
    // Background colors
    background: '#0c0a09', // stone-950
    card: '#1c1917', // stone-900
    cardAlt: '#292524', // stone-800
    cardForeground: '#fafaf9', // stone-50
    
    // Text colors
    text: '#fafaf9', // stone-50
    textMuted: '#a8a29e', // stone-400
    textSecondary: '#d6d3d1', // stone-300
    
    // UI elements
    border: '#292524', // stone-800
    input: '#1c1917', // stone-900
    
    // Status colors
    success: '#22c55e',
    warning: '#eab308', // yellow-500
    error: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
    
    // Accent
    accent: '#22c55e',
    accentForeground: '#0c0a09',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
