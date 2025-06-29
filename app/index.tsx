// app/index.tsx (Tip Calculator with Split Feature, Theming, and AdMob Banner)
import React, { useState, useMemo, useRef } from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Ionicons } from '@expo/vector-icons';
import { usePurchases } from '@/contexts/PurchaseContexts';
import { useRouter } from 'expo-router';

const TIP_OPTIONS = [
    { label: '15%', value: 0.15, key: '15' },
    { label: '18%', value: 0.18, key: '18' },
    { label: '20%', value: 0.20, key: '20' },
];

export default function HomeScreen() {
    const [inputAmount, setInputAmount] = useState<string>('');
    const [tipAmount, setTipAmount] = useState<number | null>(null);
    const [activeButtonKey, setActiveButtonKey] = useState<string | null>(null);
    const [customPercentStr, setCustomPercentStr] = useState<string>('');
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
    // New state for the split feature
    const [splitByStr, setSplitByStr] = useState<string>('');
    const [showSplitInput, setShowSplitInput] = useState<boolean>(false);


    const customPercentInputRef = useRef<TextInput>(null);
    const splitInputRef = useRef<TextInput>(null);

    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const { entitlements } = usePurchases();
    const router = useRouter();

    // Theme Colors
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
    const iconColor = useThemeColor('icon');

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : (Platform.OS === 'ios'
            ? 'YOUR_REAL_IOS_AD_UNIT_ID' // Replace with your actual Ad Unit ID
            : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'); // Replace with your actual Ad Unit ID

    const billAmountNum = parseFloat(inputAmount);

    const handleBillAmountChange = (text: string) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setInputAmount(text);
            // Reset everything when bill amount changes
            setTipAmount(null);
            setActiveButtonKey(null);
            setShowCustomInput(false);
            setCustomPercentStr('');
            setShowSplitInput(false);
            setSplitByStr('');
        }
    };

    const performCalculation = (bill: number, percentDecimal: number) => {
        if (!isNaN(bill) && bill > 0 && !isNaN(percentDecimal) && percentDecimal >= 0) {
            setTipAmount(bill * percentDecimal);
        } else {
            setTipAmount(null);
        }
    };

    const handleTipButtonPress = (key: string, value?: number) => {
        Keyboard.dismiss();
        setActiveButtonKey(key);
        setShowSplitInput(false); // Hide split input when a tip button is pressed

        if (key === 'other') {
            setShowCustomInput(true);
            setTimeout(() => customPercentInputRef.current?.focus(), 50);
            const currentCustomPercent = parseFloat(customPercentStr);
            if (!isNaN(billAmountNum) && billAmountNum > 0 && !isNaN(currentCustomPercent) && currentCustomPercent >= 0) {
                performCalculation(billAmountNum, currentCustomPercent / 100);
            } else {
                setTipAmount(null);
            }
        } else if (value !== undefined) {
            setShowCustomInput(false);
            if (!isNaN(billAmountNum) && billAmountNum > 0) {
                performCalculation(billAmountNum, value);
            } else {
                setTipAmount(null);
            }
        }
    };

    // New handler for the Split button
    const handleSplitButtonPress = () => {
        Keyboard.dismiss();
        setActiveButtonKey('split');
        setShowCustomInput(false); // Hide custom % input
        setShowSplitInput(true);
        setTimeout(() => splitInputRef.current?.focus(), 50);
    };

    const handleCustomPercentInputChange = (text: string) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setCustomPercentStr(text);
            if (!isNaN(billAmountNum) && billAmountNum > 0) {
                const customPercent = parseFloat(text);
                performCalculation(billAmountNum, (!isNaN(customPercent) && customPercent >= 0) ? customPercent / 100 : 0);
            }
        }
    };

    // **FIX:** Added the missing handleSplitInputChange function
    const handleSplitInputChange = (text: string) => {
        // Allow only whole numbers
        if (/^\d*$/.test(text)) {
            setSplitByStr(text);
        }
    };

    const handleInputSubmit = () => {
        Keyboard.dismiss();
    };

    const handleRoundTip = (direction: 'up' | 'down') => {
        if (tipAmount === null || isNaN(billAmountNum) || billAmountNum <= 0) return;
        Keyboard.dismiss();
        let newTip = (direction === 'up') ? Math.ceil(tipAmount) : Math.floor(tipAmount);
        if (newTip < 0) newTip = 0;
        const newPercentage = (newTip / billAmountNum) * 100;
        setTipAmount(newTip);
        setActiveButtonKey('other');
        setShowCustomInput(false);
        setCustomPercentStr(newPercentage.toFixed(1));
    };

    const handleRoundTotal = (direction: 'up' | 'down') => {
        if (isNaN(billAmountNum) || billAmountNum <= 0) return;
        Keyboard.dismiss();
        const currentTotal = billAmountNum + (tipAmount || 0);
        let newTotal = (direction === 'up') ? Math.ceil(currentTotal) : Math.floor(currentTotal);
        if (newTotal < billAmountNum) newTotal = billAmountNum;
        const newTip = newTotal - billAmountNum;
        const newPercentage = (newTip / billAmountNum) * 100;
        setTipAmount(newTip < 0 ? 0 : newTip);
        setActiveButtonKey('other');
        setShowCustomInput(false);
        setCustomPercentStr(newPercentage.toFixed(1));
    };

    const formatCurrency = (value: number | null): string => {
        if (value === null || isNaN(value)) return '$0.00';
        return `$${value.toFixed(2)}`;
    };

    const splitByNum = parseInt(splitByStr, 10);
    const showTipAndTotal = !isNaN(billAmountNum) && billAmountNum > 0 && tipAmount !== null;
    const showSplitResults = !isNaN(billAmountNum) && billAmountNum > 0 && !isNaN(splitByNum) && splitByNum > 1;

    const styles = useMemo(() => StyleSheet.create({
        manualSafeAreaContainer: { flex: 1, backgroundColor: 'transparent', },
        touchableContentArea: { flex: 1, paddingTop: headerHeight, },
        scrollContentContainer: { flexGrow: 1, paddingHorizontal: 25, paddingVertical: 20, },
        mainTitleBanner: { backgroundColor: buttonBackgroundColor + 'CC', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 16, alignItems: 'center', marginBottom: 25, shadowColor: Platform.OS === 'ios' ? textColor : '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.3, shadowRadius: Platform.OS === 'ios' ? 5 : 4, elevation: 8, },
        mainTitleText: { fontSize: 32, fontWeight: 'bold', color: textColor, textAlign: 'center', marginBottom: 2, marginTop: 100 },
        mainSubtitleText: { fontSize: 16, color: textColor, textAlign: 'center', opacity: 0.9, marginBottom: 20 },
        inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: inputBackgroundColor + 'CC', borderWidth: 1, borderColor: inputBorderColor + 'CC', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, width: '100%', maxWidth: 400, alignSelf: 'center', },
        dollarSign: { fontSize: 24, color: dollarSignColor, marginRight: 10, },
        input: { flex: 1, height: 55, fontSize: 24, color: inputText, textAlign: 'center', },
        buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: '100%', maxWidth: 450, alignSelf: 'center', alignItems: 'center', },
        tipButton: { backgroundColor: buttonBackgroundColor, paddingVertical: 12, paddingHorizontal: 5, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, marginHorizontal: 3, shadowColor: Platform.OS === 'ios' ? textColor : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.23, shadowRadius: Platform.OS === 'ios' ? 3 : 2.62, elevation: 4, minHeight: 50, height: 50, borderWidth: 1, borderColor: 'transparent', },
        selectedTipButton: { backgroundColor: selectedButtonBgColor, borderColor: selectedButtonBorderColor, borderWidth: 2, },
        tipButtonText: { color: buttonTextColor, fontSize: 16, fontWeight: '600', },
        otherTipButtonInput: { color: buttonTextColor, fontSize: 16, fontWeight: '600', textAlign: 'center', paddingVertical: 0, paddingHorizontal: 2, width: '100%', },
        resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: resultBgColor + 'CC', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: resultBorderColor + 'CC', shadowColor: Platform.OS === 'ios' ? textColor : '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.22, shadowRadius: Platform.OS === 'ios' ? 2 : 2.22, elevation: 3, marginBottom: 15, width: '100%', maxWidth: 400, alignSelf: 'center', },
        totalContainerOverride: { backgroundColor: totalBgColor + 'CC', borderColor: totalBorderColor + 'CC', },
        resultTextContainer: { alignItems: 'center', flex: 1, },
        resultLabelText: { fontSize: 18, color: secondaryTextColor, marginBottom: 4, },
        resultAmountText: { fontSize: 30, fontWeight: 'bold', color: primaryColor, },
        roundingButton: { padding: 8, opacity: 1},
        roundingButtonLocked: { padding: 8, opacity: 0.5, },
        splitResultContainer: { backgroundColor: inputBackgroundColor + 'CC', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: inputBorderColor + 'CC', width: '100%', maxWidth: 400, alignSelf: 'center', marginTop: 5, },
        splitResultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, },
        splitResultLabel: { fontSize: 16, color: secondaryTextColor, },
        splitResultValue: { fontSize: 20, fontWeight: 'bold', color: textColor, },
        adBannerContainer: { alignItems: 'center', backgroundColor: 'transparent', marginTop: 'auto', paddingVertical: 10 },
        bottomSafeAreaSpacer: { height: insets.bottom, backgroundColor: 'transparent' }
    }), [
        headerHeight, insets.bottom, insets.left, insets.right,
        backgroundColor, textColor, secondaryTextColor, primaryColor,
        inputBackgroundColor, inputBorderColor, inputText,
        buttonBackgroundColor, buttonTextColor, selectedButtonBgColor, selectedButtonBorderColor,
        resultBgColor, resultBorderColor, totalBgColor, totalBorderColor,
        dollarSignColor, placeholderTextColor, iconColor
    ]);


    return (
        <View style={[ styles.manualSafeAreaContainer, { paddingBottom: 0, paddingLeft: insets.left, paddingRight: insets.right, }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.touchableContentArea}>
                    <ScrollView contentContainerStyle={styles.scrollContentContainer} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <Text style={styles.mainTitleText}>CafeCalc</Text><Text style={styles.mainSubtitleText}>Calculate your tip!</Text>
                        <View style={styles.inputGroup}><Text style={styles.dollarSign}>$</Text><TextInput style={styles.input} onChangeText={handleBillAmountChange} value={inputAmount} placeholder="Enter Bill Amount" keyboardType="numeric" placeholderTextColor={placeholderTextColor} clearButtonMode="while-editing" /></View>
                        <View style={styles.buttonsContainer}>
                            {TIP_OPTIONS.map((option) => (
                                <TouchableOpacity key={option.key} style={[ styles.tipButton, activeButtonKey === option.key && styles.selectedTipButton ]} onPress={() => handleTipButtonPress(option.key, option.value)}>
                                    <Text style={styles.tipButtonText}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity key="other" style={[ styles.tipButton, activeButtonKey === 'other' && styles.selectedTipButton, showCustomInput && activeButtonKey === 'other' && { paddingVertical: 0, paddingHorizontal: 5 } ]} onPress={() => handleTipButtonPress('other')} activeOpacity={showCustomInput && activeButtonKey === 'other' ? 1 : 0.2}>
                                {showCustomInput && activeButtonKey === 'other' ? (
                                    <TextInput ref={customPercentInputRef} style={styles.otherTipButtonInput} onChangeText={handleCustomPercentInputChange} value={customPercentStr} placeholder="%" keyboardType="numeric" placeholderTextColor={buttonTextColor} onSubmitEditing={handleInputSubmit} onBlur={handleInputSubmit} maxLength={5} autoFocus={true} textAlignVertical="center" />
                                ) : (<Text style={styles.tipButtonText}>{activeButtonKey === 'other' && customPercentStr ? `${customPercentStr}%` : 'Other'}</Text>)}
                            </TouchableOpacity>
                            <TouchableOpacity
                                key="split"
                                style={[ styles.tipButton, activeButtonKey === 'split' && styles.selectedTipButton, showSplitInput && activeButtonKey === 'split' && { paddingVertical: 0, paddingHorizontal: 5 }, !entitlements.hasAllThemes && { opacity: 0.6 } ]}
                                onPress={() => { if (entitlements.hasAllThemes) { handleSplitButtonPress(); } else { router.push('/shop'); } }}
                                activeOpacity={showSplitInput && activeButtonKey === 'split' ? 1 : 0.2}
                            >
                                {!entitlements.hasAllThemes ? (
                                    <Ionicons name="lock-closed" size={24} color={buttonTextColor} />
                                ) : showSplitInput && activeButtonKey === 'split' ? (
                                    <TextInput ref={splitInputRef} style={styles.otherTipButtonInput} onChangeText={handleSplitInputChange} value={splitByStr} placeholder="#" keyboardType="number-pad" placeholderTextColor={buttonTextColor} onSubmitEditing={handleInputSubmit} onBlur={handleInputSubmit} maxLength={2} autoFocus={true} textAlignVertical="center" />
                                ) : (<Text style={styles.tipButtonText}>{splitByStr && Number(splitByStr) > 1 ? `Split ${splitByStr}` : 'Split'}</Text>)}
                            </TouchableOpacity>
                        </View>
                        {showTipAndTotal && (
                            <>
                                <View style={styles.resultRow}>
                                    <TouchableOpacity style={entitlements.hasAllThemes ? styles.roundingButton : styles.roundingButtonLocked} onPress={() => { if (entitlements.hasAllThemes) { handleRoundTip('down'); } else { router.push('/shop'); } }}>
                                        {entitlements.hasAllThemes ? <Ionicons name="arrow-down-circle-outline" size={30} color={iconColor} /> : <Ionicons name="lock-closed" size={26} color={secondaryTextColor} />}
                                    </TouchableOpacity>
                                    <View style={styles.resultTextContainer}><Text style={styles.resultLabelText}>Tip Amount:</Text><Text style={styles.resultAmountText}>{formatCurrency(tipAmount)}</Text></View>
                                    <TouchableOpacity style={entitlements.hasAllThemes ? styles.roundingButton : styles.roundingButtonLocked} onPress={() => { if (entitlements.hasAllThemes) { handleRoundTip('up'); } else { router.push('/shop'); } }}>
                                        {entitlements.hasAllThemes ? <Ionicons name="arrow-up-circle-outline" size={30} color={iconColor} /> : <Ionicons name="lock-closed" size={26} color={secondaryTextColor} />}
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.resultRow, styles.totalContainerOverride]}>
                                    <TouchableOpacity style={entitlements.hasAllThemes ? styles.roundingButton : styles.roundingButtonLocked} onPress={() => { if (entitlements.hasAllThemes) { handleRoundTotal('down'); } else { router.push('/shop'); } }}>
                                        {entitlements.hasAllThemes ? <Ionicons name="arrow-down-circle-outline" size={30} color={iconColor} /> : <Ionicons name="lock-closed" size={26} color={secondaryTextColor} />}
                                    </TouchableOpacity>
                                    <View style={styles.resultTextContainer}><Text style={styles.resultLabelText}>Total Bill:</Text><Text style={styles.resultAmountText}>{formatCurrency(billAmountNum + (tipAmount || 0))}</Text></View>
                                    <TouchableOpacity style={entitlements.hasAllThemes ? styles.roundingButton : styles.roundingButtonLocked} onPress={() => { if (entitlements.hasAllThemes) { handleRoundTotal('up'); } else { router.push('/shop'); } }}>
                                        {entitlements.hasAllThemes ? <Ionicons name="arrow-up-circle-outline" size={30} color={iconColor} /> : <Ionicons name="lock-closed" size={26} color={secondaryTextColor} />}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                        {showSplitResults && (
                            <View style={styles.splitResultContainer}>
                                <View style={styles.splitResultRow}>
                                    <Text style={styles.splitResultLabel}>Tip / Person</Text>
                                    <Text style={styles.splitResultValue}>{formatCurrency((tipAmount || 0) / splitByNum)}</Text>
                                </View>
                                <View style={[styles.splitResultRow, { borderTopWidth: 1, borderTopColor: resultBorderColor, paddingTop: 8 }]}>
                                    <Text style={styles.splitResultLabel}>Total / Person</Text>
                                    <Text style={styles.splitResultValue}>{formatCurrency((billAmountNum + (tipAmount || 0)) / splitByNum)}</Text>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
            {!entitlements.isAdFree && adUnitId ? (
                <View>
                    <View style={styles.adBannerContainer}>
                        <BannerAd
                            unitId={adUnitId}
                            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                            requestOptions={{ requestNonPersonalizedAdsOnly: false, }}
                            onAdLoaded={() => { console.log('Banner Ad loaded'); }}
                            onAdFailedToLoad={(error) => { console.error('Banner Ad failed to load: ', error); }}
                        />
                    </View>
                    <View style={styles.bottomSafeAreaSpacer} />
                </View>
            ) : null}
        </View>
    );
}