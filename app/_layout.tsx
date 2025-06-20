// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider, RouteProp, ParamListBase } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getThemeColors } from '@/constants/Colors';

type ScreenOptionsProps = {
    route: RouteProp<ParamListBase, string>;
    navigation: any;
};

function AppLayout() {
    const { effectiveColorScheme, accentColorPreference } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const currentPalette = getThemeColors(effectiveColorScheme, accentColorPreference);

    const {
        icon,
        headerText,
        headerBackground: headerBackgroundColor, // Get the header background color
        background: gradientStartColor,
        backgroundGradientEnd: gradientEndColor,
    } = currentPalette;


    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (error) {
            console.error("Font loading error:", error);
            throw error;
        }
    }, [error]);

    if (!loaded) {
        return null;
    }

    const getThemedHeaderOptions = (): Partial<NativeStackNavigationOptions> => ({
        headerTransparent: true, // This is still necessary for the layout
        headerStyle: {
            // Apply the themed color with alpha transparency.
            // 'AA' is ~66% opaque, '80' is ~50% opaque. Let's use 'AA'. F2 95
            backgroundColor: headerBackgroundColor + 'CC',
        },
        headerTintColor: headerText,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: Platform.OS === 'ios' ? 17 : 20,
        },
    });

    // A component to hold the navigator, to be placed inside the background components
    const LayoutContent = () => (
        <NavThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    ...getThemedHeaderOptions(),
                    contentStyle: { backgroundColor: 'transparent' },
                    animation: 'slide_from_right'
                }}
            >
                <Stack.Screen
                    name="index"
                    options={() => ({
                        title: 'ChronoTech',
                        headerShown: true,
                        headerRight: () => (
                            <View style={{ flexDirection: 'row', marginRight: Platform.OS === 'ios' ? 10 : 15 }}>
                                <TouchableOpacity
                                    onPress={() => router.push('/shop')}
                                    style={{ paddingHorizontal: Platform.OS === 'ios' ? 8 : 12 }}
                                >
                                    <Ionicons name="cart-outline" size={28} color={icon} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => router.push('/settings')}
                                    style={{ paddingHorizontal: Platform.OS === 'ios' ? 8 : 12 }}
                                >
                                    <Ionicons name="settings-outline" size={26} color={icon} />
                                </TouchableOpacity>
                            </View>
                        ),
                    })}
                />
                <Stack.Screen
                    name="settings"
                    options={() => ({
                        title: 'Settings',
                        presentation: 'modal',
                    })}
                />
                <Stack.Screen
                    name="shop"
                    options={() => ({
                        title: 'Shop (Ad-Free)',
                        presentation: 'modal',
                    })}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={effectiveColorScheme === 'dark' ? 'light' : 'dark'} />
        </NavThemeProvider>
    );

    return (
        // The LinearGradient is now the permanent base layer
        <LinearGradient
            colors={[gradientStartColor, gradientEndColor]}
            style={[
                styles.backgroundWrapper,
                {
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                }
            ]}
        >
            {/* Conditionally render the ImageBackground on top of the gradient */}
            {currentPalette.backgroundImage ? (
                <ImageBackground
                    source={currentPalette.backgroundImage}
                    resizeMode="cover"
                    style={styles.imageBackground}
                    // You can add opacity to the image itself to blend it with the gradient
                    // imageStyle={{ opacity: 0.5 }}
                >
                    <LayoutContent />
                </ImageBackground>
            ) : (
                // If there's no image, just render the content directly on the gradient
                <LayoutContent />
            )}
        </LinearGradient>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AppLayout />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    backgroundWrapper: { // Style for the base LinearGradient
        flex: 1,
    },
    imageBackground: { // Style for the ImageBackground that overlays the gradient
        flex: 1,
    },
});
