// contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme, AccentColorName } from '@/constants/Colors';

type ThemeModePreference = ColorScheme | 'system';

interface ThemeContextType {
    themeModePreference: ThemeModePreference;
    setThemeModePreference: (themeMode: ThemeModePreference) => void;
    accentColorPreference: AccentColorName;
    setAccentColorPreference: (accentColor: AccentColorName) => void;
    effectiveColorScheme: ColorScheme;
    isLoadingTheme: boolean; // To indicate if preferences are still loading
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_STORAGE_KEY = '@MyApp:themeModePreference';
const ACCENT_COLOR_STORAGE_KEY = '@MyApp:accentColorPreference';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const deviceColorScheme = useDeviceColorScheme() ?? 'light';

    const [themeModePreference, setThemeModePreferenceState] = useState<ThemeModePreference>('system');
    const [accentColorPreference, setAccentColorPreferenceState] = useState<AccentColorName>('default');
    const [effectiveColorScheme, setEffectiveColorScheme] = useState<ColorScheme>(deviceColorScheme);
    const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(true); // New loading state

    // Load saved preferences on component mount
    useEffect(() => {
        const loadPreferences = async () => {
            console.log('[ThemeProvider] Attempting to load preferences from AsyncStorage...');
            try {
                const storedThemeMode = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY) as ThemeModePreference | null;
                console.log('[ThemeProvider] Loaded themeModePreference from AsyncStorage:', storedThemeMode);
                if (storedThemeMode) {
                    setThemeModePreferenceState(storedThemeMode);
                } else {
                    console.log('[ThemeProvider] No themeModePreference found, using default "system".');
                }

                const storedAccentColor = await AsyncStorage.getItem(ACCENT_COLOR_STORAGE_KEY) as AccentColorName | null;
                console.log('[ThemeProvider] Loaded accentColorPreference from AsyncStorage:', storedAccentColor);
                if (storedAccentColor) {
                    setAccentColorPreferenceState(storedAccentColor);
                } else {
                    console.log('[ThemeProvider] No accentColorPreference found, using default "default".');
                }
            } catch (e) {
                console.error("[ThemeProvider] Failed to load theme preferences from AsyncStorage.", e);
            } finally {
                console.log("[ThemeProvider] Finished loading preferences.");
                setIsLoadingTheme(false); // Set loading to false after attempting to load
            }
        };
        loadPreferences();
    }, []);

    // Effect to update effectiveColorScheme and save preferences when they change
    // This effect will now only save if isLoadingTheme is false
    useEffect(() => {
        // Only run this effect if initial loading is complete
        if (isLoadingTheme) {
            console.log("[ThemeProvider] Still loading preferences, skipping save/effective scheme update.");
            return;
        }

        let currentScheme: ColorScheme;
        if (themeModePreference === 'system') {
            currentScheme = deviceColorScheme;
        } else {
            currentScheme = themeModePreference;
        }
        console.log(`[ThemeProvider] Preferences loaded. themeModePreference or deviceColorScheme changed. New effectiveColorScheme: ${currentScheme}`);
        setEffectiveColorScheme(currentScheme);

        console.log(`[ThemeProvider] Attempting to save themeModePreference to AsyncStorage: ${themeModePreference}`);
        AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, themeModePreference)
            .then(() => console.log(`[ThemeProvider] Successfully saved themeModePreference: ${themeModePreference}`))
            .catch(e => console.error("[ThemeProvider] Failed to save theme mode preference.", e));

        console.log(`[ThemeProvider] Attempting to save accentColorPreference to AsyncStorage: ${accentColorPreference}`);
        AsyncStorage.setItem(ACCENT_COLOR_STORAGE_KEY, accentColorPreference)
            .then(() => console.log(`[ThemeProvider] Successfully saved accentColorPreference: ${accentColorPreference}`))
            .catch(e => console.error("[ThemeProvider] Failed to save accent color preference.", e));

    }, [themeModePreference, accentColorPreference, deviceColorScheme, isLoadingTheme]); // Added isLoadingTheme to dependencies

    // Effect to listen to device color scheme changes if 'system' mode is selected
    useEffect(() => {
        if (isLoadingTheme) return; // Don't set up listener until initial theme is loaded

        console.log('[ThemeProvider] Setting up Appearance change listener. Current themeModePreference:', themeModePreference);
        const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
            const newDeviceScheme = newColorScheme ?? 'light';
            console.log('[ThemeProvider] Device color scheme changed via Appearance listener to:', newDeviceScheme);
            if (themeModePreference === 'system') {
                console.log('[ThemeProvider] System preference selected, updating effectiveColorScheme to new device scheme:', newDeviceScheme);
                // This will trigger the above useEffect to re-evaluate and save
                // No, this should directly set effectiveColorScheme, deviceColorScheme is a prop to the other useEffect
                setEffectiveColorScheme(newDeviceScheme);
            }
        });
        return () => {
            console.log('[ThemeProvider] Removing Appearance change listener.');
            subscription.remove();
        };
    }, [themeModePreference, isLoadingTheme]); // Added isLoadingTheme

    return (
        <ThemeContext.Provider value={{
            themeModePreference,
            setThemeModePreference: setThemeModePreferenceState,
            accentColorPreference,
            setAccentColorPreference: setAccentColorPreferenceState,
            effectiveColorScheme,
            isLoadingTheme // Provide loading state
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};