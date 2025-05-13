// app/index.tsx (Tip Calculator with Custom Percentage, Theming, and AdMob Banner)
import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Appearance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../hooks/useThemeColor';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'; // Import AdMobBanner
import mobileAds from 'react-native-google-mobile-ads';

mobileAds()
    .initialize()
    .then(adapterStatuses => {
        // Initialization complete!
    });

// Define the tip options, including "Other"
const TIP_OPTIONS = [
    { label: '15%', value: 0.15, key: '15' },
    { label: '18%', value: 0.18, key: '18' },
    { label: '20%', value: 0.20, key: '20' },
    { label: 'Other', key: 'other' },
];

export default function HomeScreen() {
    const [inputAmount, setInputAmount] = useState<string>('');
    const [tipAmount, setTipAmount] = useState<number | null>(null);
    const [activeButtonKey, setActiveButtonKey] = useState<string | null>(null);
    const [customPercentStr, setCustomPercentStr] = useState<string>('');
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

    const insets = useSafeAreaInsets();

    // --- Theme Colors ---
    const backgroundColor = useThemeColor('background');
    const textColor = useThemeColor('text');
    const secondaryTextColor = useThemeColor('secondaryText');
    const primaryColor = useThemeColor('primary');
    const inputBackgroundColor = useThemeColor('inputBackground');
    const inputBorderColor = useThemeColor('inputBorder');
    const inputText = useThemeColor('inputText');
    const buttonBackgroundColor = useThemeColor('buttonBackground');
    const buttonTextColor = useThemeColor('buttonText');
    const selectedButtonBgColor = useThemeColor('selectedButtonBackground');
    const selectedButtonBorderColor = useThemeColor('selectedButtonBorder');
    const resultBgColor = useThemeColor('resultBackground');
    const resultBorderColor = useThemeColor('resultBorder');
    const totalBgColor = useThemeColor('totalBackground');
    const totalBorderColor = useThemeColor('totalBorder');
    const dollarSignColor = useThemeColor('dollarSign');
    const placeholderTextColor = useThemeColor('placeholderText');

    const adUnitId = __DEV__
        ? TestIds.BANNER // Or TestIds.ADAPTIVE_BANNER if you use adaptive size
        : (Platform.OS === 'ios'
            ? 'ca-app-pub-3940256099942544/2934735716'
            : 'ca-app-pub-3940256099942544/6300978111');
    // Handles changes to the main bill amount input
    const handleBillAmountChange = (text: string) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setInputAmount(text);
            setTipAmount(null);
            setActiveButtonKey(null);
            setShowCustomInput(false);
        }
    };

    // Performs the tip calculation
    const performCalculation = (bill: number, percentDecimal: number) => {
        if (!isNaN(bill) && bill > 0 && !isNaN(percentDecimal) && percentDecimal >= 0) {
            const calculatedTip = bill * percentDecimal;
            setTipAmount(calculatedTip);
            Keyboard.dismiss();
        } else {
            setTipAmount(null);
        }
    };

    // Handles presses on the predefined tip buttons or the "Other" button
    const handleTipButtonPress = (key: string, value?: number) => {
        setActiveButtonKey(key);
        const bill = parseFloat(inputAmount);

        if (key === 'other') {
            setShowCustomInput(true);
            const currentCustomPercent = parseFloat(customPercentStr);
            if (!isNaN(currentCustomPercent) && currentCustomPercent >= 0) {
                performCalculation(bill, currentCustomPercent / 100);
            } else {
                setTipAmount(null);
            }
        } else if (value !== undefined) {
            setShowCustomInput(false);
            performCalculation(bill, value);
        }
    };

    // Handles changes to the custom percentage input field
    const handleCustomPercentInputChange = (text: string) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setCustomPercentStr(text);
        }
    };

    // Handles submission of the custom percentage
    const handleCustomPercentSubmit = () => {
        const bill = parseFloat(inputAmount);
        const customPercent = parseFloat(customPercentStr);

        if (activeButtonKey === 'other' && !isNaN(customPercent) && customPercent >= 0) {
            performCalculation(bill, customPercent / 100);
        } else if (activeButtonKey === 'other') {
            setTipAmount(null);
        }
    };

    const formatCurrency = (value: number | null): string => {
        if (value === null || isNaN(value)) {
            return '$0.00';
        }
        return `$${value.toFixed(2)}`;
    };

    const billAmountNum = parseFloat(inputAmount);
    const showResults = activeButtonKey !== null && !isNaN(billAmountNum) && billAmountNum > 0;

    const getDynamicStyles = () => StyleSheet.create({
        manualSafeAreaContainer: {
            flex: 1,
            backgroundColor: backgroundColor,
        },
        // This View is the single child for TouchableWithoutFeedback, covering the main content area
        touchableContentArea: {
            flex: 1, // This makes sure this View takes up space to push the ad down
        },
        contentWrapper: { // Contains the actual scrollable content or main UI elements
            flex: 1, // Ensures this part takes available space above the ad
            paddingHorizontal: 25,
            paddingVertical: 20,
        },
        titleContainer: { alignItems: 'center', marginBottom: 10, },
        titleText: { fontSize: 36, fontWeight: 'bold', color: textColor, },
        subtitleContainer: { alignItems: 'center', marginBottom: 30, },
        subtitleText: { fontSize: 18, color: secondaryTextColor, },
        inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: inputBackgroundColor, borderWidth: 1, borderColor: inputBorderColor, borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, width: '100%', maxWidth: 400, alignSelf: 'center', },
        dollarSign: { fontSize: 24, color: dollarSignColor, marginRight: 10, },
        input: { flex: 1, height: 55, fontSize: 24, color: inputText, textAlign: 'center', },
        buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: '100%', maxWidth: 450, alignSelf: 'center', },
        tipButton: { backgroundColor: buttonBackgroundColor, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center', flex: 1, marginHorizontal: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4, },
        selectedTipButton: { backgroundColor: selectedButtonBgColor, borderColor: selectedButtonBorderColor, borderWidth: 2, },
        tipButtonText: { color: buttonTextColor, fontSize: 16, fontWeight: '600', },
        selectedTipButtonText: { /* Optional: color: useThemeColor('text'), */ },
        customInputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: inputBackgroundColor, borderWidth: 1, borderColor: inputBorderColor, borderRadius: 10, paddingHorizontal: 15, marginBottom: 30, width: '80%', maxWidth: 250, alignSelf: 'center', },
        customInput: { flex: 1, height: 50, fontSize: 18, color: inputText, textAlign: 'right', },
        customDollarSign: { fontSize: 18, color: dollarSignColor, marginLeft: 8, },
        resultContainer: { backgroundColor: resultBgColor, padding: 25, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: resultBorderColor, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3, marginBottom: 15, width: '100%', maxWidth: 400, alignSelf: 'center', },
        totalContainer: { backgroundColor: totalBgColor, padding: 25, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: totalBorderColor, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3, width: '100%', maxWidth: 400, alignSelf: 'center', },
        resultLabelText: { fontSize: 18, color: secondaryTextColor, marginBottom: 8, },
        resultAmountText: { fontSize: 32, fontWeight: 'bold', color: primaryColor, },
        adBannerContainer: {
            // This container will sit at the bottom, above the safe area spacer
            // It doesn't need flex: 1. It's positioned by the overall flex layout.
            // Add padding or background if you want to see its bounds during testing
            // paddingVertical: 5,
            // backgroundColor: 'rgba(0,255,0,0.1)', // Light green tint for testing
            alignItems: 'center', // Center the banner if it's not 'fullBanner' size
        },
        bottomSafeAreaSpacer: {
            height: insets.bottom, // Use the bottom inset value
            backgroundColor: backgroundColor, // Match the screen background
        }
    });

    const styles = getDynamicStyles();

    return (
        // Outermost container that respects safe area insets via padding
        <View style={[
            styles.manualSafeAreaContainer,
            {
                paddingTop: insets.top,
                // No paddingBottom here; it's handled by the bottomSafeAreaSpacer
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }
        ]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* This View is the single child for TouchableWithoutFeedback, covering the main content area */}
                <View style={styles.touchableContentArea}>
                    <View style={styles.contentWrapper}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>CafCalc</Text>
                        </View>
                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subtitleText}>Calculate your tip!</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.dollarSign}>$</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleBillAmountChange}
                                value={inputAmount}
                                placeholder="Enter Bill Amount"
                                keyboardType="numeric"
                                placeholderTextColor={placeholderTextColor}
                                clearButtonMode="while-editing"
                            />
                        </View>

                        <View style={styles.buttonsContainer}>
                            {TIP_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.key}
                                    style={[
                                        styles.tipButton,
                                        activeButtonKey === option.key && styles.selectedTipButton
                                    ]}
                                    onPress={() => handleTipButtonPress(option.key, option.value)}
                                >
                                    <Text style={[
                                        styles.tipButtonText,
                                        activeButtonKey === option.key && styles.selectedTipButtonText
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {showCustomInput && activeButtonKey === 'other' && (
                            <View style={styles.customInputGroup}>
                                <Text style={styles.customDollarSign}>%</Text>
                                <TextInput
                                    style={styles.customInput}
                                    onChangeText={handleCustomPercentInputChange}
                                    value={customPercentStr}
                                    placeholder="Custom %"
                                    keyboardType="numeric"
                                    placeholderTextColor={placeholderTextColor}
                                    onSubmitEditing={handleCustomPercentSubmit}
                                    onBlur={handleCustomPercentSubmit}
                                    autoFocus={true}
                                />
                            </View>
                        )}

                        {showResults && (
                            <>
                                <View style={styles.resultContainer}>
                                    <Text style={styles.resultLabelText}>Tip Amount:</Text>
                                    <Text style={styles.resultAmountText}>
                                        {formatCurrency(tipAmount)}
                                    </Text>
                                </View>
                                <View style={styles.totalContainer}>
                                    <Text style={styles.resultLabelText}>Total Bill:</Text>
                                    <Text style={styles.resultAmountText}>
                                        {formatCurrency(billAmountNum + (tipAmount || 0))}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {/* AdMob Banner and Bottom Spacer are outside the TouchableWithoutFeedback's main content area,
                but inside the main safe area padded container. */}
            <View style={styles.adBannerContainer}>
                {adUnitId ? ( // Note: variable name changed to adUnitId for clarity
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} // Or FULL_BANNER, BANNER, etc.
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: false, // Set based on consent
                        }}
                        onAdLoaded={() => {
                            console.log('Banner Ad loaded');
                        }}
                        onAdFailedToLoad={(error) => {
                            console.error('Banner Ad failed to load: ', error);
                        }}
                    />
                ) : (
                    <Text style={{textAlign: 'center', paddingVertical: 15, color: secondaryTextColor}}>
                        Ad Placeholder (ID missing)
                    </Text>
                )}
            </View>
            {/* This View ensures that the content above the ad (or the ad itself)
                does not go into the bottom safe area (e.g., home bar on iOS) */}
            <View style={styles.bottomSafeAreaSpacer} />
        </View>
    );
}
