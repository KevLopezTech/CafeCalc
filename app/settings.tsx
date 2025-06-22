// app/settings.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Pressable, Share, Linking } from 'react-native';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';

import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AccentColorName, getThemeColors, AppThemes, AccentColorLabels, ColorScheme } from '@/constants/Colors';

type ThemeModeOptionValue = 'light' | 'dark' | 'system';

interface ThemeModeOption {
    label: string;
    value: ThemeModeOptionValue;
}

interface AccentColorOption {
    label: string;
    value: AccentColorName;
    colorSample: string;
}

// For the text modal
type InfoModalContent = {
    title: string;
    content: string;
} | null;

export default function SettingsScreen() {
    const {
        themeModePreference,
        setThemeModePreference,
        accentColorPreference,
        setAccentColorPreference,
        effectiveColorScheme
    } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const [isAccentModalVisible, setIsAccentModalVisible] = useState(false);
    const [infoModalContent, setInfoModalContent] = useState<InfoModalContent>(null);

    // Get themed colors
    const textColor = useThemeColor('text');
    const secondaryTextColor = useThemeColor('secondaryText');
    const separatorColor = useThemeColor('separator');
    const iconColor = useThemeColor('icon');
    const settingsButtonColor = useThemeColor('settingsButton');
    const settingsButtonTextColor = useThemeColor('settingsButtonText');
    const primaryColor = useThemeColor('primary');
    const inputBackgroundColor = useThemeColor('inputBackground');
    const modalTextColor = useThemeColor('text');


    const appVersion = Constants.expoConfig?.version ?? 'N/A';
    const appName = Constants.expoConfig?.name ?? 'CafeCalc';
    // IMPORTANT: Replace this with the numerical ID from your app's listing on App Store Connect.
    const appStoreNumericalId = 'YOUR_IOS_APP_STORE_NUMERICAL_ID';
    // This will pull the package name directly from your app.json
    const playStoreId = Constants.expoConfig?.android?.package ?? 'com.chronotech.CafeCalc';


    const themeModeOptions: ThemeModeOption[] = [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' },
    ];

    const accentColorOptions = useMemo((): AccentColorOption[] => {
        return (Object.keys(AppThemes) as AccentColorName[]).map((accentName) => ({
            label: AccentColorLabels[accentName] || accentName,
            value: accentName,
            colorSample: getThemeColors(effectiveColorScheme, accentName).tint,
        }));
    }, [effectiveColorScheme]);

    const currentAccentSelection = accentColorOptions.find(opt => opt.value === accentColorPreference) || accentColorOptions[0];

    const handleRateApp = () => {
        let storeUrl = '';
        if (Platform.OS === 'ios') {
            if (appStoreNumericalId === 'YOUR_IOS_APP_STORE_NUMERICAL_ID') {
                alert('This app is not yet available on the App Store.'); return;
            }
            storeUrl = `itms-apps://itunes.apple.com/app/id${appStoreNumericalId}?action=write-review`;
        } else {
            storeUrl = `market://details?id=${playStoreId}`;
        }

        Linking.canOpenURL(storeUrl).then(supported => {
            if (supported) {
                Linking.openURL(storeUrl);
            } else {
                alert("Could not open the app store.");
            }
        }).catch(err => console.error('An error occurred trying to open the store URL', err));
    };

    const handleShareApp = async () => {
        try {
            let storeLink = '';
            if (Platform.OS === 'ios') {
                if (appStoreNumericalId === 'YOUR_IOS_APP_STORE_NUMERICAL_ID') {
                    alert('This app is not yet available on the App Store for sharing.'); return;
                }
                storeLink = `https://apps.apple.com/app/id${appStoreNumericalId}`;
            } else {
                storeLink = `https://play.google.com/store/apps/details?id=${playStoreId}`;
            }
            const message = `Check out ${appName}! It's a great app for calculating tips.\n\nDownload it here:\n${storeLink}`;

            await Share.share({
                message,
                title: `Share ${appName}`,
                url: storeLink, // URL is helpful for some share targets
            });
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handlePrivacyPolicy = () => {
        setInfoModalContent({
            title: "Privacy Policy",
            content: "Last updated: June 22, 2025\n\nChronoTech built the CafeCalc app as an Ad Supported app. This service is provided by ChronoTech at no cost and is intended for use as is.\n\nThis page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.\n\nIf you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.\n\nThe app does use third-party services that may collect information used to identify you. Link to the privacy policy of third-party service providers used by the app:\n\n- Google AdMob\n\nWe want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third-party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.\n\nWe value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.\n\nThis Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13 years of age. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions.\n\nWe may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.\n\nIf you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at [Your Contact Email]."
        });
    };
    const handleTermsOfService = () => {
        setInfoModalContent({
            title: "Terms of Service",
            content: "Last updated: June 22, 2025\n\nBy downloading or using the CafeCalc app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app.\n\nYou’re not allowed to copy or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights, and other intellectual property rights related to it, still belong to ChronoTech.\n\nChronoTech is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for.\n\nThe CafeCalc app stores and processes personal data that you have provided to us, to provide our Service. It’s your responsibility to keep your phone and access to the app secure.\n\nWith respect to ChronoTech’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavor to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. ChronoTech accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.\n\nWe may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms and Conditions on this page. These changes are effective immediately after they are posted on this page.\n\nIf you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at [Your Contact Email]."
        });
    };

    const renderThemeModeOption = (option: ThemeModeOptionValue, label: string) => (
        <TouchableOpacity
            key={option}
            style={[
                styles.selectableButton,
                { backgroundColor: settingsButtonColor },
                themeModePreference === option && { borderColor: primaryColor, borderWidth: 2 }
            ]}
            onPress={() => setThemeModePreference(option)}
        >
            <Text style={[styles.selectableButtonText, { color: settingsButtonTextColor }]}>{label}</Text>
            {themeModePreference === option && (
                <Ionicons name="checkmark-circle" size={24} color={primaryColor} style={styles.checkmarkIcon} />
            )}
        </TouchableOpacity>
    );

    const handleAccentColorSelect = (accentValue: AccentColorName) => {
        setAccentColorPreference(accentValue);
        setIsAccentModalVisible(false);
    };

    return (
        <View style={[
            styles.outermostContainer,
            {
                paddingLeft: insets.left,
                paddingRight: insets.right,
                paddingBottom: insets.bottom,
            }
        ]}>
            <ScrollView
                style={[styles.container, { backgroundColor: 'transparent' }]}
                contentContainerStyle={[styles.scrollContentContainer, {paddingTop: headerHeight + 10}]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Stack.Screen options={{ title: 'Settings' }} />

                <View style={styles.section}><Text style={[styles.sectionTitle, { color: textColor }]}>Appearance Mode</Text><View style={styles.optionsRowContainer}>{themeModeOptions.map(opt => renderThemeModeOption(opt.value, opt.label))}</View></View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
                <View style={styles.section}><Text style={[styles.sectionTitle, { color: textColor }]}>Theme Color</Text><TouchableOpacity style={[styles.dropdownHeader, { backgroundColor: settingsButtonColor, borderColor: separatorColor }]} onPress={() => setIsAccentModalVisible(true)}><View style={styles.dropdownHeaderContent}><View style={[styles.colorSwatch, { backgroundColor: currentAccentSelection?.colorSample }]} /><Text style={[styles.dropdownHeaderText, { color: settingsButtonTextColor }]}>{currentAccentSelection?.label}</Text></View><Ionicons name="chevron-down-outline" size={22} color={iconColor} /></TouchableOpacity></View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
                <View style={styles.section}><Text style={[styles.sectionTitle, { color: textColor }]}>About</Text><View style={[styles.infoRow, { borderBottomColor: separatorColor }]}><Text style={[styles.infoLabel, { color: secondaryTextColor }]}>App Name</Text><Text style={[styles.infoValue, { color: textColor }]}>{appName}</Text></View><View style={[styles.infoRow, { borderBottomColor: separatorColor }]}><Text style={[styles.infoLabel, { color: secondaryTextColor }]}>App Version</Text><Text style={[styles.infoValue, { color: textColor }]}>{appVersion}</Text></View><View style={[styles.infoRow, styles.lastInfoRow]}><Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Developer</Text><Text style={[styles.infoValue, { color: textColor }]}>ChronoTech</Text></View></View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
                <View style={styles.section}><Text style={[styles.sectionTitle, { color: textColor }]}>Support & Feedback</Text><TouchableOpacity style={styles.linkButton} onPress={handleRateApp}><Ionicons name="star-outline" size={22} color={iconColor} style={styles.linkIcon} /><Text style={[styles.linkText, { color: textColor }]}>Rate {appName}</Text></TouchableOpacity><TouchableOpacity style={styles.linkButton} onPress={handleShareApp}><Ionicons name="share-social-outline" size={22} color={iconColor} style={styles.linkIcon} /><Text style={[styles.linkText, { color: textColor }]}>Share {appName}</Text></TouchableOpacity></View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
                <View style={styles.section}><Text style={[styles.sectionTitle, { color: textColor }]}>Legal</Text><TouchableOpacity style={styles.linkButton} onPress={handlePrivacyPolicy}><Ionicons name="shield-checkmark-outline" size={22} color={iconColor} style={styles.linkIcon} /><Text style={[styles.linkText, { color: textColor }]}>Privacy Policy</Text></TouchableOpacity><TouchableOpacity style={styles.linkButton} onPress={handleTermsOfService}><Ionicons name="document-text-outline" size={22} color={iconColor} style={styles.linkIcon} /><Text style={[styles.linkText, { color: textColor }]}>Terms of Service</Text></TouchableOpacity></View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            </ScrollView>

            <Modal animationType="fade" transparent={true} visible={isAccentModalVisible} onRequestClose={() => setIsAccentModalVisible(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setIsAccentModalVisible(false)}>
                    <View style={[styles.modalContent, { backgroundColor: inputBackgroundColor, borderColor: separatorColor }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Select Theme Color</Text>
                        {accentColorOptions.map((option) => (
                            <TouchableOpacity key={option.value} style={[ styles.modalOption, { backgroundColor: settingsButtonColor }, accentColorPreference === option.value && { borderColor: primaryColor, borderWidth: 2 } ]} onPress={() => handleAccentColorSelect(option.value)}>
                                <View style={[styles.colorSwatch, { backgroundColor: option.colorSample }]} />
                                <Text style={[styles.modalOptionText, { color: settingsButtonTextColor }]}>{option.label}</Text>
                                {accentColorPreference === option.value && ( <Ionicons name="checkmark-circle-outline" size={22} color={primaryColor} style={styles.checkmarkIconSmall} /> )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={[styles.modalCloseButton, {backgroundColor: settingsButtonColor, marginTop: 10}]} onPress={() => setIsAccentModalVisible(false)}><Text style={[styles.modalCloseButtonText, {color: settingsButtonTextColor}]}>Cancel</Text></TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
            <Modal animationType="slide" transparent={true} visible={!!infoModalContent} onRequestClose={() => setInfoModalContent(null)}>
                <Pressable style={styles.modalOverlay} onPress={() => setInfoModalContent(null)}>
                    <View style={[styles.modalContent, { backgroundColor: inputBackgroundColor, borderColor: separatorColor, maxHeight: '80%' }]}>
                        <Text style={[styles.modalTitle, { color: modalTextColor }]}>{infoModalContent?.title}</Text>
                        <ScrollView style={styles.infoModalScrollView}><Text style={[styles.infoModalText, { color: modalTextColor }]}>{infoModalContent?.content}</Text></ScrollView>
                        <TouchableOpacity style={[styles.modalCloseButton, {backgroundColor: settingsButtonColor, marginTop: 15}]} onPress={() => setInfoModalContent(null)}><Text style={[styles.modalCloseButtonText, {color: settingsButtonTextColor}]}>Close</Text></TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

// Styles remain the same
const styles = StyleSheet.create({
    outermostContainer: { flex: 1, backgroundColor: 'transparent', },
    container: { flex: 1, backgroundColor: 'transparent', },
    scrollContentContainer: { paddingBottom: 20, },
    section: { paddingHorizontal: 20, paddingVertical: 15, },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, },
    optionsRowContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, },
    selectableButton: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', minWidth: 100, marginHorizontal: 5, minHeight: 50, },
    selectableButtonText: { fontSize: 16, fontWeight: '500', },
    checkmarkIcon: { marginLeft: 'auto', paddingLeft: 8, },
    checkmarkIconSmall: { marginLeft: 'auto', paddingLeft: 8, },
    colorSwatch: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#888', marginRight: 10, },
    dropdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, },
    dropdownHeaderContent: { flexDirection: 'row', alignItems: 'center', },
    dropdownHeaderText: { fontSize: 16, fontWeight: '500', },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', },
    modalContent: { width: '90%', maxWidth: 400, padding: 20, borderRadius: 10, borderWidth: 1, alignItems: 'stretch', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', },
    modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderRadius: 8, marginBottom: 10, },
    modalOptionText: { fontSize: 16, fontWeight: '500', },
    modalCloseButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', },
    modalCloseButtonText: { fontSize: 16, fontWeight: '600', },
    infoModalScrollView: { maxHeight: '70%', marginBottom: 15, },
    infoModalText: { fontSize: 15, lineHeight: 22, },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, },
    lastInfoRow: { borderBottomWidth: 0, },
    infoLabel: { fontSize: 16, },
    infoValue: { fontSize: 16, fontWeight: '500', },
    separator: { height: 1, },
    linkButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, },
    linkIcon: { marginRight: 15, },
    linkText: { fontSize: 16, },
});