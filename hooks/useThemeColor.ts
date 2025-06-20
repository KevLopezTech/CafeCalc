// hooks/useThemeColor.ts
import { ColorRole, getThemeColors } from '@/constants/Colors'; // Import getThemeColors
import { useTheme } from '@/contexts/ThemeContext'; // Use the renamed useTheme hook

/**
 * Custom hook to get a color value based on the current effective theme and accent color.
 */
export function useThemeColor(colorName: ColorRole): string {
  const { effectiveColorScheme, accentColorPreference } = useTheme();

  const fullPalette = getThemeColors(effectiveColorScheme, accentColorPreference);

  return fullPalette[colorName];
}
