// contexts/PurchaseContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initConnection,
    endConnection,
    getProducts,
    getAvailablePurchases,
    requestPurchase as iapRequestPurchase,
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

// Custom wrapper for requestPurchase to handle different API signatures
const requestPurchase = async (sku: string) => {
    try {
        // Try the most common API patterns for expo-iap
        return await (iapRequestPurchase as any)(sku);
    } catch (error1) {
        try {
            return await (iapRequestPurchase as any)({ sku });
        } catch (error2) {
            try {
                return await (iapRequestPurchase as any)({ productId: sku });
            } catch (error3) {
                throw new Error(`All requestPurchase attempts failed. Last error: ${error3}`);
            }
        }
    }
};

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
        } catch (e) {
            console.error("Failed to load entitlements.", e);
        }
    };

    const saveEntitlements = useCallback(async (newEntitlements: UserEntitlements) => {
        try {
            await AsyncStorage.setItem(ENTITLEMENTS_STORAGE_KEY, JSON.stringify(newEntitlements));
        } catch (e) {
            console.error("Failed to save entitlements.", e);
        }
    }, []);

    const grantEntitlements = useCallback((purchaseHistory: Purchase[]) => {
        setEntitlements(currentEntitlements => {
            const newEntitlements = { ...currentEntitlements };
            let hasChanges = false;

            for (const purchase of purchaseHistory) {
                if (purchase.transactionReceipt) {
                    // Try multiple possible property names for product identifier
                    const productSku = (purchase as any).productSku ||
                        (purchase as any).sku ||
                        (purchase as any).productId ||
                        (purchase as any).productIdentifier || '';

                    console.log(`[IAP] Purchase object keys:`, Object.keys(purchase));
                    console.log(`[IAP] Product SKU found:`, productSku);

                    if (productSku) {
                        console.log(`[IAP] Granting entitlement for: ${productSku}`);

                        if (!newEntitlements.isAdFree) {
                            newEntitlements.isAdFree = true;
                            hasChanges = true;
                        }

                        if (productSku.includes('premiumpack01') && !newEntitlements.hasAllThemes) {
                            newEntitlements.hasAllThemes = true;
                            hasChanges = true;
                        } else if (productSku.includes('theme.')) {
                            const themeKey = productSku.split('theme.').pop();
                            if (themeKey && !newEntitlements.unlockedThemes.includes(themeKey)) {
                                newEntitlements.unlockedThemes.push(themeKey);
                                hasChanges = true;
                            }
                        } else if (productSku.includes('theme_')) {
                            const themeKey = productSku.split('theme_').pop();
                            if (themeKey && !newEntitlements.unlockedThemes.includes(themeKey)) {
                                newEntitlements.unlockedThemes.push(themeKey);
                                hasChanges = true;
                            }
                        }
                    }
                }
            }

            if (hasChanges) {
                console.log("[IAP] Updating and saving entitlements:", newEntitlements);
                saveEntitlements(newEntitlements).catch(console.error);
            }

            return newEntitlements;
        });
    }, [saveEntitlements]);

    useEffect(() => {
        let purchaseUpdateSubscription: any = null;
        let purchaseErrorSubscription: any = null;
        let isComponentMounted = true;

        const initializeIAP = async () => {
            console.log('[IAP] Step 1: Initializing...');
            await loadEntitlements();

            try {
                console.log('[IAP] Step 2: Calling initConnection()...');
                const connectionResult = await initConnection();
                console.log('[IAP] Step 3: initConnection result:', connectionResult);

                if (!isComponentMounted) return;

                // Set up purchase listeners
                purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
                    console.log('[IAP] purchaseUpdatedListener triggered.', purchase);
                    const receipt = purchase.transactionReceipt;
                    if (receipt) {
                        try {
                            grantEntitlements([purchase]);
                            await finishTransaction({ purchase, isConsumable: false });
                            const productSku = (purchase as any).productSku ||
                                (purchase as any).sku ||
                                (purchase as any).productId ||
                                'unknown';
                            console.log(`[IAP] Transaction for ${productSku} finished.`);
                        } catch (error) {
                            console.error('[IAP] Failed to finish transaction.', error);
                        }
                    }
                });

                purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
                    console.warn('[IAP] purchaseErrorListener:', error);
                });

                if (IAP_SKUS.length > 0 && isComponentMounted) {
                    console.log('[IAP] Step 4: Fetching products with getProducts()...');
                    try {
                        const fetchedProducts = await getProducts(IAP_SKUS);
                        console.log('[IAP] Step 5: Fetched products response:', fetchedProducts);
                        if (fetchedProducts && fetchedProducts.length > 0 && isComponentMounted) {
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
                if (isComponentMounted) {
                    console.log('[IAP] Step 6: Initialization complete. Setting isIAPReady to true.');
                    setIsIAPReady(true);
                }
            }
        };

        initializeIAP();

        return () => {
            isComponentMounted = false;
            purchaseUpdateSubscription?.remove();
            purchaseErrorSubscription?.remove();
            endConnection();
            console.log('[IAP] Connection Ended.');
        };
    }, []);

    const purchaseItem = useCallback(async (sku: string) => {
        if (!isIAPReady) {
            console.warn('[IAP] IAP not ready yet');
            return;
        }

        try {
            console.log(`[IAP] Attempting to purchase: ${sku}`);
            await requestPurchase(sku);
        } catch (error) {
            console.error(`Error purchasing item ${sku}:`, error);
            throw error;
        }
    }, [isIAPReady]);

    const restorePurchases = useCallback(async () => {
        try {
            const purchases = await getAvailablePurchases();
            console.log('[IAP] Available purchases:', purchases);
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
    }, [grantEntitlements]);

    return (
        <PurchaseContext.Provider value={{
            isIAPReady,
            products,
            entitlements,
            purchaseItem,
            restorePurchases
        }}>
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