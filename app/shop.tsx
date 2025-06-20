// app/shop.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

export default function ShopScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();

    // Theme colors
    const textColor = useThemeColor('text');
    const secondaryTextColor = useThemeColor('secondaryText');
    const buttonBackgroundColor = useThemeColor('buttonBackground');
    const buttonTextColor = useThemeColor('buttonText');
    const primaryColor = useThemeColor('primary');
    const cardBackgroundColor = useThemeColor('inputBackground');
    const cardBorderColor = useThemeColor('inputBorder');
    const settingsButtonColor = useThemeColor('settingsButton');
    const settingsButtonTextColor = useThemeColor('settingsButtonText');


    const handlePurchase = (option: string) => {
        alert(`Purchase: ${option} - Feature coming soon!`);
        // Here you would integrate your in-app purchase logic
    };

    const handleRestorePurchases = () => {
        alert('Restore Purchases: Feature coming soon!');
        // Here you would integrate your restore purchases logic
        // e.g., using expo-in-app-purchases getPurchaseHistoryAsync() or similar
    };

    return (
        <View style={[
            styles.outermostContainer,
            {
                paddingBottom: 0, // Bottom inset handled by spacer
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }
        ]}>
            <Stack.Screen options={{ title: 'Shop (Ad-Free)' }} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={[
                    styles.scrollContentContainer,
                    { paddingTop: headerHeight + 20 } // Adjust for transparent header
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: textColor }]}>Go Ad-Free!</Text>
                <Text style={[styles.description, { color: secondaryTextColor }]}>
                    Enjoy an uninterrupted experience and support future development.
                </Text>

                <View style={[styles.optionCard, { backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]}>
                    <Text style={[styles.optionTitle, { color: textColor }]}>Remove Ads</Text>
                    <Text style={[styles.optionPrice, { color: primaryColor }]}>$0.99</Text>
                    <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>
                        One-time purchase to remove all advertisements from the app.
                    </Text>
                    <TouchableOpacity
                        style={[styles.purchaseButton, { backgroundColor: buttonBackgroundColor }]}
                        onPress={() => handlePurchase('$0.99 Ad-Free')}
                    >
                        <Text style={[styles.purchaseButtonText, { color: buttonTextColor }]}>Purchase</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.optionCard, { backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]}>
                    <Text style={[styles.optionTitle, { color: textColor }]}>Ad-Free + Themes</Text>
                    <Text style={[styles.optionPrice, { color: primaryColor }]}>$1.99</Text>
                    <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>
                        Remove all ads and unlock additional app themes for personalization.
                    </Text>
                    <TouchableOpacity
                        style={[styles.purchaseButton, { backgroundColor: buttonBackgroundColor }]}
                        onPress={() => handlePurchase('$1.99 Ad-Free + Themes')}
                    >
                        <Text style={[styles.purchaseButtonText, { color: buttonTextColor }]}>Purchase</Text>
                    </TouchableOpacity>
                </View>

                {/* Container for bottom buttons (Close and Restore) */}
                <View style={styles.bottomActionsContainer}>
                    {Platform.OS === 'android' && router.canGoBack() && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: settingsButtonColor }]}
                            onPress={() => router.back()}
                        >
                            <Text style={[styles.actionButtonText, { color: settingsButtonTextColor }]}>Close</Text>
                        </TouchableOpacity>
                    )}
                    {/* Restore Purchases Button - always show, but functionality is iOS-centric */}
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: settingsButtonColor },
                            // Add margin if both buttons are visible
                            (Platform.OS === 'android' && router.canGoBack()) && { marginLeft: 10 }
                        ]}
                        onPress={handleRestorePurchases}
                    >
                        <Text style={[styles.actionButtonText, { color: settingsButtonTextColor }]}>Restore Purchases</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {/* Spacer for bottom safe area */}
            <View style={{ height: insets.bottom, backgroundColor: 'transparent' }} />
        </View>
    );
}

const styles = StyleSheet.create({
    outermostContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContentContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20, // Ensure space for bottom buttons
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        marginHorizontal: 20,
    },
    optionCard: {
        borderRadius: 12,
        padding: 25,
        marginBottom: 25,
        alignItems: 'center',
        width: '100%',
        maxWidth: 380,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    optionTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
    },
    optionPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    optionDescription: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 25,
    },
    purchaseButton: {
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 8,
        width: '90%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1, },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    purchaseButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    bottomActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Or 'space-around' if you want them more spread out
        alignItems: 'center',
        marginTop: 30, // Space above the buttons
        width: '100%',
        maxWidth: 380, // Match card width for alignment
    },
    actionButton: { // Common style for Close and Restore buttons
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'center', // If only one button is shown, it will be centered
        flex: 1, // If two buttons, they share space
        marginHorizontal: 5, // Space between buttons if two are shown
        alignItems: 'center', // Center text inside button
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});