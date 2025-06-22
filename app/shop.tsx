// app/shop.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { usePurchases } from '@/contexts/PurchaseContexts'; // Import our IAP hook
import { Product } from 'react-native-iap'; // Correct import from the new library

export default function ShopScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    // Get everything we need from our PurchaseContext
    const { isIAPReady, products, purchaseItem, restorePurchases, entitlements } = usePurchases();

    // --- Theme Colors ---
    const textColor = useThemeColor('text');
    const secondaryTextColor = useThemeColor('secondaryText');
    const buttonBackgroundColor = useThemeColor('buttonBackground');
    const buttonTextColor = useThemeColor('buttonText');
    const primaryColor = useThemeColor('primary');
    const cardBackgroundColor = useThemeColor('inputBackground');
    const cardBorderColor = useThemeColor('inputBorder');
    const settingsButtonColor = useThemeColor('settingsButton');
    const settingsButtonTextColor = useThemeColor('settingsButtonText');

    // Helper function to find a product by its SKU/ID identifier
    const findProduct = (skuIdentifier: string): Product | undefined => { // Corrected type to Product
        // Finds a product where the productId ends with the identifier
        // This works for both iOS (com.company.app.adfree) and Android (adfree)
        return products.find(p => p.productId.endsWith(skuIdentifier));
    };

    // Find the specific products we want to display
    const adFreeProduct = findProduct('adfree');
    const allThemesProduct = findProduct('premiumpack01'); // Using the correct SKU 'premiumpack01'

    // Determine if the user already owns these items
    const hasAdFree = entitlements.isAdFree && !entitlements.hasAllThemes; // True only if they bought just ad-free
    const hasAllThemes = entitlements.hasAllThemes;

    const renderPurchaseCard = (
        product: Product | undefined, // Corrected type to Product
        title: string,
        description: string,
        priceFallback: string,
        isPurchased: boolean,
        purchaseButtonText: string = 'Purchase'
    ) => {
        // The localizedPrice property is available on the Product type from react-native-iap
        const displayPrice = isIAPReady ? (product?.localizedPrice || priceFallback) : '...';

        return (
            <View style={[styles.optionCard, { backgroundColor: cardBackgroundColor, borderColor: cardBorderColor }]}>
                <Text style={[styles.optionTitle, { color: textColor }]}>{title}</Text>
                <Text style={[styles.optionPrice, { color: primaryColor }]}>
                    {displayPrice}
                </Text>
                <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>
                    {description}
                </Text>
                <TouchableOpacity
                    style={[
                        styles.purchaseButton,
                        { backgroundColor: buttonBackgroundColor },
                        (!product || isPurchased) && styles.disabledButton // Visual style for disabled
                    ]}
                    onPress={() => product && purchaseItem(product.productId)}
                    disabled={!product || isPurchased}
                >
                    <Text style={[styles.purchaseButtonText, { color: buttonTextColor }]}>
                        {isPurchased ? 'Owned' : purchaseButtonText}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[ styles.outermostContainer, { paddingBottom: 0, paddingLeft: insets.left, paddingRight: insets.right, }]}>
            <Stack.Screen options={{ title: 'Shop' }} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={[ styles.scrollContentContainer, { paddingTop: headerHeight + 20 } ]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: textColor }]}>App Upgrades</Text>
                <Text style={[styles.description, { color: secondaryTextColor }]}>
                    Enhance your experience and support future development. All purchases remove ads.
                </Text>

                {!isIAPReady ? (
                    <ActivityIndicator size="large" color={primaryColor} style={{ marginTop: 20 }}/>
                ) : (
                    <>
                        {renderPurchaseCard(
                            adFreeProduct,
                            'Ad-Free Only',
                            'One-time purchase to remove all advertisements from the app.',
                            '$1.99',
                            hasAdFree
                        )}

                        {renderPurchaseCard(
                            allThemesProduct,
                            'All Access Pass',
                            'Remove ads and unlock all current and future themes. The ultimate support pack!',
                            '$9.99',
                            hasAllThemes,
                            'Get the Bundle'
                        )}
                        {/* Here you could map over your individual themes to create more purchase cards */}
                    </>
                )}

                <View style={styles.bottomActionsContainer}>
                    {Platform.OS === 'android' && router.canGoBack() && (
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: settingsButtonColor }]} onPress={() => router.back()}>
                            <Text style={[styles.actionButtonText, { color: settingsButtonTextColor }]}>Close</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[ styles.actionButton, { backgroundColor: settingsButtonColor }, (Platform.OS === 'android' && router.canGoBack()) && { marginLeft: 10 } ]}
                        onPress={restorePurchases} // Connect to the restore function
                    >
                        <Text style={[styles.actionButtonText, { color: settingsButtonTextColor }]}>Restore Purchases</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ height: insets.bottom, backgroundColor: 'transparent' }} />
        </View>
    );
}

const styles = StyleSheet.create({
    outermostContainer: { flex: 1, backgroundColor: 'transparent', },
    container: { flex: 1, backgroundColor: 'transparent', },
    scrollContentContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 20, },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', },
    description: { fontSize: 16, textAlign: 'center', marginBottom: 30, marginHorizontal: 20, },
    optionCard: { borderRadius: 12, padding: 25, marginBottom: 25, alignItems: 'center', width: '100%', maxWidth: 380, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, },
    optionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 10, },
    optionPrice: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, },
    optionDescription: { fontSize: 15, textAlign: 'center', marginBottom: 25, },
    purchaseButton: { paddingVertical: 14, paddingHorizontal: 35, borderRadius: 8, width: '90%', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2, },
    purchaseButtonText: { fontSize: 17, fontWeight: 'bold', },
    disabledButton: { opacity: 0.6, },
    bottomActionsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 15, width: '100%', maxWidth: 380, },
    actionButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'center', flex: 1, marginHorizontal: 5, alignItems: 'center', },
    actionButtonText: { fontSize: 16, fontWeight: '600', }
});