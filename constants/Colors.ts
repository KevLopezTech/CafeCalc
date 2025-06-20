// constants/Colors.ts

import {ImageSourcePropType} from "react-native";

export type ColorScheme = 'light' | 'dark';
// Reordered: 'default' first, then alphabetical
export type AccentColorName = 'default' | 'amethyst' | 'azul' | 'beach' | 'classicCoffee' | 'rainforest' | 'solar' | 'sunset';

// Reordered to match AccentColorName
export const AccentColorLabels: Record<AccentColorName, string> = {
  default: 'Default (Coffee)',
  amethyst: 'Amethyst',
  azul: 'Azul',
  beach: 'Beach',
  classicCoffee: 'Classic Coffee',
  rainforest: 'Rainforest Canopy',
  solar: 'Solar Flare',
  sunset: 'Sunset',
};

export type ColorRole =
    | 'text' | 'background' | 'backgroundGradientEnd' | 'tint' | 'primary'
    | 'secondaryText' | 'inputBackground' | 'inputBorder' | 'inputText'
    | 'buttonBackground' | 'buttonText' | 'selectedButtonBackground' | 'selectedButtonBorder'
    | 'resultBackground' | 'resultBorder' | 'totalBackground' | 'totalBorder'
    | 'dollarSign' | 'placeholderText' | 'icon' | 'separator'
    | 'settingsButton' | 'settingsButtonText' | 'headerText' | 'headerBackground';

// Define a type for a complete theme palette
export type ThemePalette = Record<ColorRole, string> & {
  backgroundImage?: ImageSourcePropType;
};

// --- Fully Defined Theme Palettes ---
// AppThemes is the single source of truth for all color values.
// Order updated: 'default' first, then alphabetical.
export const AppThemes: Record<AccentColorName, Record<ColorScheme, ThemePalette>> = {
  default: { // New Default: Modern Coffee (Clean base, Coffee accents)
    light: {
      text: '#111827', background: '#FFFFFF', backgroundGradientEnd: '#F9FAFB',
      secondaryText: '#6B7280', inputBackground: '#F3F4F6', inputBorder: '#D1D5DB', inputText: '#111827',
      resultBackground: '#F9FAFB', resultBorder: '#E5E7EB', totalBackground: '#F3F4F6', totalBorder: '#D1D5DB',
      dollarSign: '#6B7280', placeholderText: '#9CA3AF', separator: '#E5E7EB',
      settingsButton: '#F3F4F6', settingsButtonText: '#111827',
      tint: '#795548', primary: '#795548', buttonBackground: '#795548', buttonText: '#FFFFFF',
      selectedButtonBackground: '#5D4037', selectedButtonBorder: '#795548', icon: '#795548',
      headerText: '#795548', headerBackground: '#FFFFFF', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
    dark: {
      text: '#E5E7EB', background: '#030712', backgroundGradientEnd: '#000000',
      secondaryText: '#9CA3AF', inputBackground: '#1F2937', inputBorder: '#374151', inputText: '#E5E7EB',
      resultBackground: '#1F2937', resultBorder: '#374151', totalBackground: '#111827', totalBorder: '#1F2937',
      dollarSign: '#9CA3AF', placeholderText: '#6B7280', separator: '#374151',
      settingsButton: '#1F2937', settingsButtonText: '#E5E7EB',
      tint: '#A1887F', primary: '#A1887F', buttonBackground: '#A1887F', buttonText: '#FFFFFF',
      selectedButtonBackground: '#8D6E63', selectedButtonBorder: '#A1887F', icon: '#A1887F',
      headerText: '#A1887F', headerBackground: '#030712', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
  },
  amethyst: {
    light: {
      text: '#111827', background: '#FFFFFF', backgroundGradientEnd: '#F9FAFB', tint: '#6200EE', primary: '#6200EE',
      secondaryText: '#6B7280', inputBackground: '#F3F4F6', inputBorder: '#D1D5DB', inputText: '#111827',
      buttonBackground: '#6200EE', buttonText: '#FFFFFF', selectedButtonBackground: '#4500A0', selectedButtonBorder: '#6200EE',
      resultBackground: '#F9FAFB', resultBorder: '#E5E7EB', totalBackground: '#F3F4F6', totalBorder: '#D1D5DB',
      dollarSign: '#6B7280', placeholderText: '#9CA3AF', icon: '#6200EE', separator: '#E5E7EB',
      settingsButton: '#F3F4F6', settingsButtonText: '#111827', headerText: '#6200EE', headerBackground: '#FFFFFF', backgroundImage: require("@/assets/images/themeBGs/AmethystWallpaper.png")
    },
    dark: {
      text: '#E5E7EB', background: '#030712', backgroundGradientEnd: '#000000', tint: '#BB86FC', primary: '#BB86FC',
      secondaryText: '#9CA3AF', inputBackground: '#1F2937', inputBorder: '#374151', inputText: '#E5E7EB',
      buttonBackground: '#BB86FC', buttonText: '#121212', selectedButtonBackground: '#9050F0', selectedButtonBorder: '#BB86FC',
      resultBackground: '#1F2937', resultBorder: '#374151', totalBackground: '#111827', totalBorder: '#1F2937',
      dollarSign: '#9CA3AF', placeholderText: '#6B7280', icon: '#BB86FC', separator: '#374151',
      settingsButton: '#1F2937', settingsButtonText: '#E5E7EB', headerText: '#BB86FC', headerBackground: '#030712', backgroundImage: require("@/assets/images/themeBGs/AmethystWallpaper.png")
    },
  },
  azul: {
    light: {
      text: '#111827', background: '#FFFFFF', backgroundGradientEnd: '#F9FAFB', tint: '#00B0FF', primary: '#00B0FF',
      secondaryText: '#6B7280', inputBackground: '#F3F4F6', inputBorder: '#D1D5DB', inputText: '#111827',
      buttonBackground: '#00B0FF', buttonText: '#FFFFFF', selectedButtonBackground: '#0091EA', selectedButtonBorder: '#00B0FF',
      resultBackground: '#F9FAFB', resultBorder: '#E5E7EB', totalBackground: '#F3F4F6', totalBorder: '#D1D5DB',
      dollarSign: '#6B7280', placeholderText: '#9CA3AF', icon: '#00B0FF', separator: '#E5E7EB',
      settingsButton: '#F3F4F6', settingsButtonText: '#111827', headerText: '#00B0FF', headerBackground: '#FFFFFF', backgroundImage: require("@/assets/images/themeBGs/AzulWallpaper.png")
    },
    dark: {
      text: '#E5E7EB', background: '#030712', backgroundGradientEnd: '#000000', tint: '#40C4FF', primary: '#40C4FF',
      secondaryText: '#9CA3AF', inputBackground: '#1F2937', inputBorder: '#374151', inputText: '#E5E7EB',
      buttonBackground: '#40C4FF', buttonText: '#000000', selectedButtonBackground: '#00B0FF', selectedButtonBorder: '#40C4FF',
      resultBackground: '#1F2937', resultBorder: '#374151', totalBackground: '#111827', totalBorder: '#1F2937',
      dollarSign: '#9CA3AF', placeholderText: '#6B7280', icon: '#40C4FF', separator: '#374151',
      settingsButton: '#1F2937', settingsButtonText: '#E5E7EB', headerText: '#40C4FF', headerBackground: '#030712', backgroundImage: require("@/assets/images/themeBGs/AzulWallpaper.png")
    },
  },
  beach: {
    light: {
      text: '#0077BE', background: '#FDF5E6', backgroundGradientEnd: '#FAEBD7', tint: '#3498DB', primary: '#3498DB',
      secondaryText: '#2980B9', inputBackground: '#FFFFFF', inputBorder: '#AED6F1', inputText: '#0077BE',
      buttonBackground: '#3498DB', buttonText: '#FFFFFF', selectedButtonBackground: '#217DBB', selectedButtonBorder: '#3498DB',
      resultBackground: '#FFFFFF', resultBorder: '#E0F2F7', totalBackground: '#E0F2F7', totalBorder: '#B3E0F2',
      dollarSign: '#2980B9', placeholderText: '#85C1E9', icon: '#3498DB', separator: '#AED6F1',
      settingsButton: '#FFFFFF', settingsButtonText: '#0077BE', headerText: '#3498DB', headerBackground: '#FDF5E6', backgroundImage: require("@/assets/images/themeBGs/BeachWallpaper.png")
    },
    dark: {
      text: '#E0F2F7', background: '#2C3E50', backgroundGradientEnd: '#233140', tint: '#5DADE2', primary: '#5DADE2',
      secondaryText: '#A1887F', inputBackground: '#3B5369', inputBorder: '#A1887F', inputText: '#E0F2F7',
      buttonBackground: '#5DADE2', buttonText: '#17202A', selectedButtonBackground: '#4A90E2', selectedButtonBorder: '#5DADE2',
      resultBackground: '#3B5369', resultBorder: '#A1887F', totalBackground: '#34495E', totalBorder: '#A1887F',
      dollarSign: '#A1887F', placeholderText: '#85C1E9', icon: '#5DADE2', separator: '#A1887F',
      settingsButton: '#3B5369', settingsButtonText: '#E0F2F7', headerText: '#5DADE2', headerBackground: '#2C3E50', backgroundImage: require("@/assets/images/themeBGs/BeachWallpaper.png")
    },
  },
  classicCoffee: {
    light: {
      text: '#4E342E', background: '#EFEBE9', backgroundGradientEnd: '#D7CCC8', tint: '#795548', primary: '#795548',
      secondaryText: '#8D6E63', inputBackground: '#FFFFFF', inputBorder: '#BCAAA4', inputText: '#4E342E',
      buttonBackground: '#795548', buttonText: '#FFFFFF', selectedButtonBackground: '#5D4037', selectedButtonBorder: '#795548',
      resultBackground: '#FFFFFF', resultBorder: '#E0E0E0', totalBackground: '#F5F5F5', totalBorder: '#D7CCC8',
      dollarSign: '#8D6E63', placeholderText: '#A1887F', icon: '#795548', separator: '#D7CCC8',
      settingsButton: '#FFFFFF', settingsButtonText: '#4E342E', headerText: '#795548', headerBackground: '#EFEBE9', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
    dark: {
      text: '#EFEBE9', background: '#3E2723', backgroundGradientEnd: '#2E1F1C', tint: '#A1887F', primary: '#A1887F',
      secondaryText: '#A1887F', inputBackground: '#4E342E', inputBorder: '#6D4C41', inputText: '#EFEBE9',
      buttonBackground: '#A1887F', buttonText: '#FFFFFF', selectedButtonBackground: '#8D6E63', selectedButtonBorder: '#A1887F',
      resultBackground: '#4E342E', resultBorder: '#6D4C41', totalBackground: '#4A3730', totalBorder: '#5D4037',
      dollarSign: '#A1887F', placeholderText: '#8D6E63', icon: '#A1887F', separator: '#5D4037',
      settingsButton: '#4E342E', settingsButtonText: '#EFEBE9', headerText: '#A1887F', headerBackground: '#3E2723', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
  },
  rainforest: {
    light: {
      text: '#F0FFF0', background: '#1B5E20', backgroundGradientEnd: '#003300', tint: '#66BB6A', primary: '#66BB6A',
      secondaryText: '#A5D6A7', inputBackground: '#2E7D32', inputBorder: '#388E3C', inputText: '#F0FFF0',
      buttonBackground: '#66BB6A', buttonText: '#1B5E20', selectedButtonBackground: '#4CAF50', selectedButtonBorder: '#66BB6A',
      resultBackground: '#2E7D32', resultBorder: '#388E3C', totalBackground: '#1E88E5', totalBorder: '#1565C0',
      dollarSign: '#A5D6A7', placeholderText: '#C8E6C9', icon: '#66BB6A', separator: '#388E3C',
      settingsButton: '#2E7D32', settingsButtonText: '#F0FFF0', headerText: '#66BB6A', headerBackground: '#1B5E20', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
    dark: {
      text: '#A5D6A7', background: '#003300', backgroundGradientEnd: '#002200', tint: '#64B5F6', primary: '#64B5F6',
      secondaryText: '#90CAF9', inputBackground: '#1B5E20', inputBorder: '#2E7D32', inputText: '#A5D6A7',
      buttonBackground: '#64B5F6', buttonText: '#000000', selectedButtonBackground: '#42A5F5', selectedButtonBorder: '#64B5F6',
      resultBackground: '#1B5E20', resultBorder: '#2E7D32', totalBackground: '#144618', totalBorder: '#1B5E20',
      dollarSign: '#90CAF9', placeholderText: '#BBDEFB', icon: '#64B5F6', separator: '#2E7D32',
      settingsButton: '#1B5E20', settingsButtonText: '#A5D6A7', headerText: '#64B5F6', headerBackground: '#003300', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
  },
  solar: {
    light: {
      text: '#000000', background: '#FFFFFF', backgroundGradientEnd: '#F0F0F0', tint: '#FFEB3B', primary: '#FFEB3B',
      secondaryText: '#555555', inputBackground: '#E8E8E8', inputBorder: '#BDBDBD', inputText: '#000000',
      buttonBackground: '#FFEB3B', buttonText: '#000000', selectedButtonBackground: '#FBC02D', selectedButtonBorder: '#FFEB3B',
      resultBackground: '#F0F0F0', resultBorder: '#E0E0E0', totalBackground: '#E8E8E8', totalBorder: '#BDBDBD',
      dollarSign: '#555555', placeholderText: '#888888', icon: '#FFA000', separator: '#E0E0E0',
      settingsButton: '#F0F0F0', settingsButtonText: '#000000', headerText: '#FFA000', headerBackground: '#FFFFFF', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
    dark: {
      text: '#FFFFFF', background: '#000000', backgroundGradientEnd: '#121212', tint: '#FFC107', primary: '#FFC107',
      secondaryText: '#AAAAAA', inputBackground: '#1E1E1E', inputBorder: '#333333', inputText: '#FFFFFF',
      buttonBackground: '#FFC107', buttonText: '#000000', selectedButtonBackground: '#FFA000', selectedButtonBorder: '#FFC107',
      resultBackground: '#1E1E1E', resultBorder: '#333333', totalBackground: '#181818', totalBorder: '#282828',
      dollarSign: '#AAAAAA', placeholderText: '#777777', icon: '#FFC107', separator: '#333333',
      settingsButton: '#1E1E1E', settingsButtonText: '#FFFFFF', headerText: '#FFC107', headerBackground: '#000000', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
  },
  sunset: {
    light: {
      text: '#BF360C', background: '#FFFDE7', backgroundGradientEnd: '#FFF9C4', tint: '#FF9800', primary: '#FF9800',
      secondaryText: '#E65100', inputBackground: '#FFFFFF', inputBorder: '#FFCC80', inputText: '#BF360C',
      buttonBackground: '#FF9800', buttonText: '#FFFFFF', selectedButtonBackground: '#FB8C00', selectedButtonBorder: '#FF9800',
      resultBackground: '#FFFFFF', resultBorder: '#FFF5E1', totalBackground: '#FFF9C4', totalBorder: '#FFECB3',
      dollarSign: '#E65100', placeholderText: '#FFB74D', icon: '#FF9800', separator: '#FFECB3',
      settingsButton: '#FFF9C4', settingsButtonText: '#BF360C', headerText: '#FF9800', headerBackground: '#FFFDE7', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
    dark: {
      text: '#FFCC80', background: '#4A230E', backgroundGradientEnd: '#2E1607', tint: '#FF8F00', primary: '#FF8F00',
      secondaryText: '#FFAB40', inputBackground: '#5D4037', inputBorder: '#795548', inputText: '#FFCC80',
      buttonBackground: '#FF8F00', buttonText: '#000000', selectedButtonBackground: '#FF6F00', selectedButtonBorder: '#FF8F00',
      resultBackground: '#5D4037', resultBorder: '#795548', totalBackground: '#6D4C41', totalBorder: '#8D6E63',
      dollarSign: '#FFAB40', placeholderText: '#BCAAA4', icon: '#FFAB40', separator: '#795548',
      settingsButton: '#5D4037', settingsButtonText: '#FFCC80', headerText: '#FFAB40', headerBackground: '#4A230E', backgroundImage: require("@/assets/images/themeBGs/CoffeeWallpaper.png")
    },
  }
};

// --- Main Function to Get Colors ---
export function getThemeColors(scheme: ColorScheme, accent: AccentColorName): ThemePalette {
  const selectedAccentTheme = AppThemes[accent] || AppThemes.default;
  return selectedAccentTheme[scheme];
}