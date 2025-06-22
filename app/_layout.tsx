// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider, RouteProp, ParamListBase } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { PurchaseProvider } from '@/contexts/PurchaseContexts'; // Import the new PurchaseProvider
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
        headerBackground: headerBackgroundColor,
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
        headerTransparent: true,
        headerStyle: {
            backgroundColor: headerBackgroundColor + 'AA', // Semi-transparent header
        },
        headerTintColor: headerText,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: Platform.OS === 'ios' ? 17 : 20,
        },
    });

    const LayoutContent = () => (
        <NavThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    ...getThemedHeaderOptions(),
                    contentStyle: { backgroundColor: 'transparent' },
                    animation: 'slide_from_right',
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
            {currentPalette.backgroundImage ? (
                <ImageBackground
                    source={currentPalette.backgroundImage}
                    resizeMode="cover"
                    style={styles.imageBackground}
                >
                    <LayoutContent />
                </ImageBackground>
            ) : (
                <LayoutContent />
            )}
        </LinearGradient>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <PurchaseProvider>
                        <AppLayout />
                    </PurchaseProvider>
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    backgroundWrapper: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
    },
});