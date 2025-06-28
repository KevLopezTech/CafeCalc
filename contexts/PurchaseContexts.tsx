// contexts/PurchaseContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initConnection,
    endConnection,
    getProducts,
    getAvailablePurchases,
    finishTransaction,
    purchaseErrorListener,
    purchaseUpdatedListener,
    Product,
    Purchase,
    PurchaseError,
} from 'expo-iap';

// IMPORTANT: These MUST match the Product IDs you create in the app stores.
const IAP_SKUS = Platform.select({
    ios: [
        // 'com.chronotech.cafecalc.adfree',
    ],
    android: [
        'adfree', 'premiumpack01',
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
        setEntitlements(currentEntitlements => {
            const newEntitlements = { ...currentEntitlements };
            for (const purchase of purchaseHistory) {
                if (purchase.transactionReceipt) {
                    const { id } = purchase;
                    console.log(`[IAP] Granting entitlement for: ${id}`);
                    newEntitlements.isAdFree = true;
                    if (id.includes('premiumpack01')) {
                        newEntitlements.hasAllThemes = true;
                    } else if (id.includes('theme.')) {
                        const themeKey = id.split('theme.').pop();
                        if (themeKey && !newEntitlements.unlockedThemes.includes(themeKey)) {
                            newEntitlements.unlockedThemes.push(themeKey);
                        }
                    } else if (id.includes('theme_')) {
                        const themeKey = id.split('theme_').pop();
                        if (themeKey && !newEntitlements.unlockedThemes.includes(themeKey)) {
                            newEntitlements.unlockedThemes.push(themeKey);
                        }
                    }
                }
            }
            console.log("[IAP] Updating and saving entitlements:", newEntitlements);
            saveEntitlements(newEntitlements);
            return newEntitlements;
        });
    };

    useEffect(() => {
        let purchaseUpdateSubscription: any = null;
        let purchaseErrorSubscription: any = null;

        const initializeIAP = async () => {
            console.log('[IAP] Step 1: Initializing...');
            await loadEntitlements();
            try {
                console.log('[IAP] Step 2: Calling initConnection()...');
                const connectionResult = await initConnection();
                console.log('[IAP] Step 3: initConnection result:', connectionResult);

                // This listener is for purchases that are pending when the app starts
                // e.g., if the app closes before a purchase is finished.
                purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
                    console.log('[IAP] purchaseUpdatedListener triggered.', purchase);
                    const receipt = purchase.transactionReceipt;
                    if (receipt) {
                        try {
                            grantEntitlements([purchase]);
                            await finishTransaction({ purchase, isConsumable: false });
                            console.log(`[IAP] Transaction for ${purchase.id} finished.`);
                        } catch (error) {
                            console.error('[IAP] Failed to finish transaction.', error);
                        }
                    }
                });

                purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
                    console.warn('[IAP] purchaseErrorListener:', error);
                });

                if (IAP_SKUS.length > 0) {
                    console.log('[IAP] Step 4: Fetching products with getProducts()...');
                    try {
                        const fetchedProducts = await getProducts( IAP_SKUS );
                        console.log('[IAP] Step 5: Fetched products response:', fetchedProducts);
                        if (fetchedProducts && fetchedProducts.length > 0) {
                            setProducts(fetchedProducts);
                        }
                    } catch (error) {
                        console.error("[IAP] Could not get products from the store.", error);
                    }
                } else {
                    console.log("[IAP] Step 4: No IAP SKUs to fetch for this platform.");
                }

            } catch (error) {
                console.error('[IAP] Error during IAP initialization:', error);
            } finally {
                console.log('[IAP] Step 6: Initialization complete. Setting isIAPReady to true.');
                setIsIAPReady(true);
            }
        };

        initializeIAP();

        return () => {
            purchaseUpdateSubscription?.remove();
            purchaseErrorSubscription?.remove();
            endConnection();
            console.log('[IAP] Connection Ended.');
        };
    }, []);

    const purchaseItem = async (sku: string) => {
        try {
            await purchaseItem( sku );
        } catch (error) {
            console.error(`Error purchasing item ${sku}:`, error);
        }
    };

    const restorePurchases = async () => {
        try {
            const purchases = await getAvailablePurchases();
            if (purchases && purchases.length > 0) {
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
