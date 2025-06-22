// contexts/PurchaseContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initConnection,
    endConnection,
    getProducts,
    getAvailablePurchases,
    requestPurchase,
    finishTransaction,
    purchaseErrorListener,
    purchaseUpdatedListener,
    Product,
    Purchase,
} from 'react-native-iap';

// IMPORTANT: Update these to match your Product IDs in the stores.
const IAP_SKUS = Platform.select({
    ios: [
        // 'com.chronotech.cafecalc.adfree',
        // 'com.chronotech.cafecalc.theme.amethyst',
        // 'com.chronotech.cafecalc.allthemes',
        // ... add all your other iOS theme SKUs
    ],
    android: [
        'adfree',
        'premiumpack01',
        // ... add all your other Android theme SKUs
    ],
}) || [];

const ENTITLEMENTS_STORAGE_KEY = '@CafeCalc:entitlements';

interface UserEntitlements {
    isAdFree: boolean;
    unlockedThemes: string[];
    hasAllThemes: boolean;
}

interface PurchaseContextType {
    isIAPReady: boolean;
    products: Product[];
    entitlements: UserEntitlements;
    purchaseItem: (sku: string) => Promise<void>;
    restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isIAPReady, setIsIAPReady] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [entitlements, setEntitlements] = useState<UserEntitlements>({
        isAdFree: false,
        unlockedThemes: [],
        hasAllThemes: false,
    });

    const loadEntitlements = async () => {
        try {
            const storedEntitlements = await AsyncStorage.getItem(ENTITLEMENTS_STORAGE_KEY);
            if (storedEntitlements) {
                setEntitlements(JSON.parse(storedEntitlements));
            }
        } catch (e) { console.error("Failed to load entitlements.", e); }
    };

    const saveEntitlements = async (newEntitlements: UserEntitlements) => {
        try {
            await AsyncStorage.setItem(ENTITLEMENTS_STORAGE_KEY, JSON.stringify(newEntitlements));
        } catch (e) { console.error("Failed to save entitlements.", e); }
    };

    const grantEntitlements = (purchaseHistory: Purchase[]) => {
        const newEntitlements = { ...entitlements };

        for (const purchase of purchaseHistory) {
            const { productId } = purchase;
            console.log(`Granting entitlement for: ${productId}`);

            newEntitlements.isAdFree = true;

            if (productId.includes('allthemes')) {
                newEntitlements.hasAllThemes = true;
            } else if (productId.includes('theme.')) { // iOS format
                const themeKey = productId.split('theme.').pop();
                if (themeKey && !newEntitlements.unlockedThemes.includes(themeKey)) {
                    newEntitlements.unlockedThemes.push(themeKey);
                }
            } else if (productId.includes('theme_')) { // Android format
                const themeKey = productId.split('theme_').pop();
                if (themeKey && !newEntitlements.unlockedThemes.includes(themeKey)) {
                    newEntitlements.unlockedThemes.push(themeKey);
                }
            }
        }

        setEntitlements(newEntitlements);
        saveEntitlements(newEntitlements);
    };

    useEffect(() => {
        let purchaseUpdateSubscription: any = null;
        let purchaseErrorSubscription: any = null;

        const initializeIAP = async () => {
            await loadEntitlements();
            try {
                await initConnection();
                // For Amazon, you may need this: await flushFailedPurchasesCachedAsPendingAndroid();
                console.log('IAP Connection Initialized.');

                purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
                    console.log('purchaseUpdatedListener', purchase);
                    const receipt = purchase.transactionReceipt;
                    if (receipt) {
                        try {
                            // Finish transaction (acknowledge purchase)
                            await finishTransaction({ purchase, isConsumable: false });
                            console.log(`Transaction for ${purchase.productId} finished.`);
                            // Grant entitlements after successful transaction finish
                            grantEntitlements([purchase]);
                        } catch (error) {
                            console.error('Failed to finish transaction.', error);
                        }
                    }
                });

                purchaseErrorSubscription = purchaseErrorListener((error) => {
                    console.warn('purchaseErrorListener', error);
                });

                console.log('Fetching products:', IAP_SKUS);
                const fetchedProducts = await getProducts({ skus: IAP_SKUS });
                console.log('Fetched products:', fetchedProducts);
                setProducts(fetchedProducts);

            } catch (error) {
                console.error('Error during IAP initialization:', error);
            } finally {
                setIsIAPReady(true);
            }
        };

        initializeIAP();

        return () => {
            purchaseUpdateSubscription?.remove();
            purchaseErrorSubscription?.remove();
            endConnection();
        };
    }, []);

    const purchaseItem = async (sku: string) => {
        console.log("Attempting to purchase:", sku);
        try {
            await requestPurchase({ skus: [sku] });
        } catch (error) {
            console.error(`Error purchasing item ${sku}:`, error);
        }
    };

    const restorePurchases = async () => {
        console.log("Attempting to restore purchases...");
        try {
            const purchases = await getAvailablePurchases();
            if (purchases && purchases.length > 0) {
                console.log("Found purchases to restore:", purchases.map(p => p.productId));
                grantEntitlements(purchases);
                alert("Your previous purchases have been successfully restored!");
            } else {
                alert("No previous purchases found to restore.");
            }
        } catch (error) {
            console.error("Error restoring purchases:", error);
            alert("An error occurred while trying to restore purchases.");
        }
    };

    return (
        <PurchaseContext.Provider value={{ isIAPReady, products, entitlements, purchaseItem, restorePurchases }}>
            {children}
        </PurchaseContext.Provider>
    );
};

export const usePurchases = () => {
    const context = useContext(PurchaseContext);
    if (context === undefined) {
        throw new Error('usePurchases must be used within a PurchaseProvider');
    }
    return context;
};