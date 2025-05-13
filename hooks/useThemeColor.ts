// hooks/useThemeColor.ts
// Make sure you have a Colors.ts file in your project's constants directory with proper exports
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { Colors, ColorRole, ColorScheme } from '../constants/Colors'; // Using relative path

/**
 * Custom hook to get a color value based on the current theme.
 * It uses the `useColorScheme` hook (which you mentioned you have,
 * assuming it's similar to React Native's built-in one or Expo's).
 *
 * @param colorName The role of the color you want (e.g., 'text', 'background').
 * @returns The hex color string for the current theme.
 */
export function useThemeColor(colorName: ColorRole): string {
  // Assuming your existing '@/hooks/useColorScheme' returns 'light' or 'dark'
  // If it's different, you might need to adapt this line.
  // For this example, I'll use the direct 'react-native' useColorScheme.
  // Replace with your own if it's customized:
  // import { useColorScheme as useAppColorScheme } from '@/hooks/useColorScheme';
  // const theme = useAppColorScheme() ?? 'light';

  const deviceTheme = useDeviceColorScheme() as ColorScheme | null | undefined;
  const currentTheme: ColorScheme = deviceTheme || 'light'; // Default to light if undefined

  return Colors[currentTheme][colorName];
}
