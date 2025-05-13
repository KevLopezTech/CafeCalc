// constants/Colors.ts

/**
 * This file defines the color palettes for light and dark themes.
 * You can expand this with more color roles as your app grows.
 */

const tintColorLight = '#6200EE'; // A primary tint color for light mode
const tintColorDark = '#BB86FC';  // A primary tint color for dark mode

export type ColorScheme = 'light' | 'dark';

// Define a type for our color roles to ensure consistency
export type ColorRole =
    | 'text'
    | 'background'
    | 'tint'
    | 'primary'
    | 'secondaryText'
    | 'inputBackground'
    | 'inputBorder'
    | 'inputText'
    | 'buttonBackground'
    | 'buttonText'
    | 'selectedButtonBackground'
    | 'selectedButtonBorder'
    | 'resultBackground'
    | 'resultBorder'
    | 'totalBackground'
    | 'totalBorder'
    | 'dollarSign'
    | 'placeholderText';

// Define the color palettes for light and dark modes
export const Colors: Record<ColorScheme, Record<ColorRole, string>> = {
  light: {
    text: '#333333',
    background: '#F4F4F8',
    tint: tintColorLight,
    primary: tintColorLight,
    secondaryText: '#555555',
    inputBackground: '#FFFFFF',
    inputBorder: '#DCDCDC',
    inputText: '#333333',
    buttonBackground: tintColorLight,
    buttonText: '#FFFFFF',
    selectedButtonBackground: '#3700B3', // Darker shade for selected button
    selectedButtonBorder: tintColorDark, // Use dark tint for selected border in light mode for contrast
    resultBackground: '#FFFFFF',
    resultBorder: '#E0E0E0',
    totalBackground: '#E8EAF6',
    totalBorder: '#C5CAE9',
    dollarSign: '#888888',
    placeholderText: '#9A9A9A',
  },
  dark: {
    text: '#E0E0E0',
    background: '#121212',
    tint: tintColorDark,
    primary: tintColorDark,
    secondaryText: '#A0A0A0',
    inputBackground: '#2C2C2C',
    inputBorder: '#4A4A4A',
    inputText: '#E0E0E0',
    buttonBackground: tintColorDark,
    buttonText: '#121212', // Dark text on light button for dark mode
    selectedButtonBackground: '#9050F0', // Lighter, more vibrant selected for dark mode
    selectedButtonBorder: tintColorLight, // Use light tint for selected border in dark mode
    resultBackground: '#1E1E1E',
    resultBorder: '#3A3A3A',
    totalBackground: '#2A2A3A', // Darker version of total background
    totalBorder: '#40405A',
    dollarSign: '#AAAAAA',
    placeholderText: '#777777',
  },
};
