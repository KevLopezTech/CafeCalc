// app/index.tsx (Tip Calculator with Styled Title Banner, Theming, and AdMob)
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

const TIP_OPTIONS = [
    { label: '15%', value: 0.15, key: '15' },
    { label: '18%', value: 0.18, key: '18' },
    { label: '20%', value: 0.20, key: '20' },
    // "Other" is handled as a special button below
];

export default function HomeScreen() {
    const [inputAmount, setInputAmount] = useState<string>('');
    const [tipAmount, setTipAmount] = useState<number | null>(null);
    const [activeButtonKey, setActiveButtonKey] = useState<string | null>(null); // '15', '18', '20', 'other', or 'rounded'
    const [customPercentStr, setCustomPercentStr] = useState<string>('');
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

    const customPercentInputRef = useRef<TextInput>(null);

    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();

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
            : 'YOUR_REAL_ANDROID_AD_UNIT_ID'); // Replace with your actual Ad Unit ID

    const billAmountNum = parseFloat(inputAmount);

    const handleBillAmountChange = (text: string) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setInputAmount(text);
            setTipAmount(null);
            setActiveButtonKey(null);
            setShowCustomInput(false);
            setCustomPercentStr('');
        }
    };

    const performCalculation = (bill: number, percentDecimal: number) => {
        if (!isNaN(bill) && bill > 0 && !isNaN(percentDecimal) && percentDecimal >= 0) {
            const calculatedTip = bill * percentDecimal;
            setTipAmount(calculatedTip);
        } else {
            setTipAmount(null);
        }
    };

    const handleTipButtonPress = (key: string, value?: number) => {
        Keyboard.dismiss();
        setActiveButtonKey(key);
        if (!isNaN(billAmountNum) && billAmountNum > 0) {
            if (key === 'other') {
                setShowCustomInput(true);
                setTimeout(() => customPercentInputRef.current?.focus(), 50);
                const currentCustomPercent = parseFloat(customPercentStr);
                if (!isNaN(currentCustomPercent) && currentCustomPercent >= 0) {
                    performCalculation(billAmountNum, currentCustomPercent / 100);
                } else {
                    setTipAmount(null);
                }
            } else if (value !== undefined) {
                setShowCustomInput(false);
                performCalculation(billAmountNum, value);
            }
        } else {
            setTipAmount(null);
            if (key === 'other') setShowCustomInput(true);
            else setShowCustomInput(false);
        }
    };

    const handleCustomPercentInputChange = (text: string) => {
        if (/^\d*\.?\d*$/.test(text)) {
            setCustomPercentStr(text);
            if (!isNaN(billAmountNum) && billAmountNum > 0) {
                const customPercent = parseFloat(text);
                if (!isNaN(customPercent) && customPercent >= 0) {
                    performCalculation(billAmountNum, customPercent / 100);
                } else {
                    setTipAmount(null);
                }
            }
        }
    };

    const handleCustomPercentSubmit = () => {
        Keyboard.dismiss();
        if (activeButtonKey === 'other') {
            const bill = parseFloat(inputAmount);
            const customPercent = parseFloat(customPercentStr);
            if (!isNaN(bill) && bill > 0 && !isNaN(customPercent) && customPercent >= 0) {
                performCalculation(bill, customPercent / 100);
            } else {
                setTipAmount(null);
            }
        }
    };

    const handleRoundTip = (direction: 'up' | 'down') => {
        if (tipAmount === null || isNaN(billAmountNum) || billAmountNum <= 0) return;
        Keyboard.dismiss();
        let newTip: number;
        if (direction === 'up') newTip = Math.ceil(tipAmount);
        else newTip = Math.floor(tipAmount);
        if (newTip < 0) newTip = 0;
        setTipAmount(newTip);
        setActiveButtonKey('rounded');
        setShowCustomInput(false);
        setCustomPercentStr('');
    };

    const handleRoundTotal = (direction: 'up' | 'down') => {
        if (isNaN(billAmountNum) || billAmountNum <= 0) return;
        Keyboard.dismiss();
        const currentTotal = billAmountNum + (tipAmount || 0);
        let newTotal: number;
        if (direction === 'up') newTotal = Math.ceil(currentTotal);
        else newTotal = Math.floor(currentTotal);
        if (newTotal < billAmountNum) newTotal = billAmountNum;
        const newTip = newTotal - billAmountNum;
        setTipAmount(newTip < 0 ? 0 : newTip);
        setActiveButtonKey('rounded');
        setShowCustomInput(false);
        setCustomPercentStr('');
    };

    const formatCurrency = (value: number | null): string => {
        if (value === null || isNaN(value)) return '$0.00';
        return `$${value.toFixed(2)}`;
    };

    const canRound = !isNaN(billAmountNum) && billAmountNum > 0 && tipAmount !== null;

    const styles = useMemo(() => StyleSheet.create({
        manualSafeAreaContainer: { flex: 1, backgroundColor: 'transparent', },
        touchableContentArea: { flex: 1, paddingTop: headerHeight, },
        scrollContentContainer: { flexGrow: 1, paddingHorizontal: 25, paddingVertical: 20, },
        // New banner styles
        mainTitleBanner: {
            backgroundColor: buttonBackgroundColor,
            paddingVertical: 10,
            paddingHorizontal: 0,
            borderRadius: 20,
            alignItems: 'center',
            marginTop: 100,
            marginBottom: 30,
            shadowColor: Platform.OS === 'ios' ? textColor : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.3,
            shadowRadius: Platform.OS === 'ios' ? 5 : 4,
            elevation: 8,
        },
        mainTitleText: {
            fontSize: 40,
            fontWeight: 'bold',
            color: buttonTextColor,
            textAlign: 'center',
            marginBottom: 4,
        },
        mainSubtitleText: {
            fontSize: 18,
            color: buttonTextColor,
            textAlign: 'center',
            opacity: 0.9,
        },
        // Existing styles
        inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: inputBackgroundColor, borderWidth: 1, borderColor: inputBorderColor, borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, width: '100%', maxWidth: 400, alignSelf: 'center', },
        dollarSign: { fontSize: 24, color: dollarSignColor, marginRight: 10, },
        input: { flex: 1, height: 55, fontSize: 24, color: inputText, textAlign: 'center', },
        buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: '100%', maxWidth: 450, alignSelf: 'center', alignItems: 'center', },
        tipButton: { backgroundColor: buttonBackgroundColor, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, marginHorizontal: 4, shadowColor: Platform.OS === 'ios' ? textColor : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.23, shadowRadius: Platform.OS === 'ios' ? 3 : 2.62, elevation: 4, minHeight: 50, height: 50, },
        selectedTipButton: { backgroundColor: selectedButtonBgColor, borderColor: selectedButtonBorderColor, borderWidth: 2, },
        tipButtonText: { color: buttonTextColor, fontSize: 16, fontWeight: '600', },
        otherTipButtonInput: { color: buttonTextColor, fontSize: 16, fontWeight: '600', textAlign: 'center', paddingVertical: 0, paddingHorizontal: 5, width: '100%', },
        resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: resultBgColor, paddingVertical: 15, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: resultBorderColor, shadowColor: Platform.OS === 'ios' ? textColor : '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.22, shadowRadius: Platform.OS === 'ios' ? 2 : 2.22, elevation: 3, marginBottom: 15, width: '100%', maxWidth: 400, alignSelf: 'center', },
        totalContainerOverride: { backgroundColor: totalBgColor, borderColor: totalBorderColor, },
        resultTextContainer: { alignItems: 'center', flex: 1, },
        resultLabelText: { fontSize: 18, color: secondaryTextColor, marginBottom: 4, },
        resultAmountText: { fontSize: 30, fontWeight: 'bold', color: primaryColor, },
        roundingButton: { padding: 8, },
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
        <View style={[
            styles.manualSafeAreaContainer,
            {
                paddingBottom: 0,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }
        ]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.touchableContentArea}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContentContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* New Title Banner Component */}
                        <View style={styles.mainTitleBanner}>
                            <Text style={styles.mainTitleText}>CafeCalc</Text>
                            <Text style={styles.mainSubtitleText}>Calculate your tip!</Text>
                        </View>

                        {/* Existing UI */}
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
                                    <Text style={styles.tipButtonText}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                key="other"
                                style={[
                                    styles.tipButton,
                                    activeButtonKey === 'other' && styles.selectedTipButton,
                                    showCustomInput && activeButtonKey === 'other' && { paddingVertical: 0, paddingHorizontal: 5, justifyContent: 'center' }
                                ]}
                                onPress={() => { if (!(showCustomInput && activeButtonKey === 'other')) { handleTipButtonPress('other'); } }}
                                activeOpacity={showCustomInput && activeButtonKey === 'other' ? 1 : 0.2}
                            >
                                {showCustomInput && activeButtonKey === 'other' ? (
                                    <TextInput
                                        ref={customPercentInputRef}
                                        style={styles.otherTipButtonInput}
                                        onChangeText={handleCustomPercentInputChange}
                                        value={customPercentStr}
                                        placeholder="%"
                                        keyboardType="numeric"
                                        placeholderTextColor={buttonTextColor}
                                        onSubmitEditing={handleCustomPercentSubmit}
                                        onBlur={handleCustomPercentSubmit}
                                        maxLength={5}
                                        autoFocus={true}
                                        textAlignVertical="center"
                                    />
                                ) : (
                                    <Text style={styles.tipButtonText}>
                                        {activeButtonKey === 'other' && customPercentStr ? `${customPercentStr}%` : 'Other'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {canRound && (
                            <>
                                <View style={styles.resultRow}>
                                    <TouchableOpacity style={styles.roundingButton} onPress={() => handleRoundTip('down')}>
                                        <Ionicons name="arrow-down-circle-outline" size={30} color={iconColor} />
                                    </TouchableOpacity>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultLabelText}>Tip Amount:</Text>
                                        <Text style={styles.resultAmountText}>
                                            {formatCurrency(tipAmount)}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.roundingButton} onPress={() => handleRoundTip('up')}>
                                        <Ionicons name="arrow-up-circle-outline" size={30} color={iconColor} />
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.resultRow, styles.totalContainerOverride]}>
                                    <TouchableOpacity style={styles.roundingButton} onPress={() => handleRoundTotal('down')}>
                                        <Ionicons name="arrow-down-circle-outline" size={30} color={iconColor} />
                                    </TouchableOpacity>
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultLabelText}>Total Bill:</Text>
                                        <Text style={styles.resultAmountText}>
                                            {formatCurrency(billAmountNum + (tipAmount || 0))}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.roundingButton} onPress={() => handleRoundTotal('up')}>
                                        <Ionicons name="arrow-up-circle-outline" size={30} color={iconColor} />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.adBannerContainer}>
                {adUnitId ? (
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        requestOptions={{ requestNonPersonalizedAdsOnly: false, }}
                        onAdLoaded={() => { console.log('Banner Ad loaded'); }}
                        onAdFailedToLoad={(error) => { console.error('Banner Ad failed to load: ', error); }}
                    />
                ) : (
                    <Text style={{textAlign: 'center', paddingVertical: 15, color: secondaryTextColor}}>
                        Ad Placeholder (ID missing)
                    </Text>
                )}
            </View>
            <View style={styles.bottomSafeAreaSpacer} />
        </View>
    );
}
