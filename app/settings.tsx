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
    // IMPORTANT: Replace these with your actual IDs from app.json or directly here
    const appStoreId = Constants.expoConfig?.ios?.bundleIdentifier ?? 'YOUR_IOS_APP_STORE_ID_OR_BUNDLE_ID';
    const playStoreId = Constants.expoConfig?.android?.package ?? 'YOUR_ANDROID_PACKAGE_NAME';


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
            // For iOS, you typically need the numerical App Store ID, not the bundle identifier for the review URL.
            // You'll need to get this ID from App Store Connect once your app is listed.
            // For now, using a placeholder that will likely fail but illustrates the structure.
            const actualAppStoreNumericalId = "YOUR_APPLE_APP_ID_NUMERICAL"; // e.g., "123456789"
            if (actualAppStoreNumericalId === "YOUR_APPLE_APP_ID_NUMERICAL") {
                alert('iOS App Store ID not configured for rating.'); return;
            }
            storeUrl = `itms-apps://itunes.apple.com/app/id${actualAppStoreNumericalId}?action=write-review`;
        } else if (Platform.OS === 'android') {
            if (playStoreId === 'YOUR_ANDROID_PACKAGE_NAME') {
                alert('Android Package Name not configured for rating.'); return;
            }
            storeUrl = `market://details?id=${playStoreId}`;
        } else {
            alert('Rating is not supported on this platform.');
            return;
        }

        Linking.canOpenURL(storeUrl).then(supported => {
            if (supported) {
                Linking.openURL(storeUrl);
            } else {
                alert("Could not open the app store. Please try again later.");
                console.log("Don't know how to open URI: " + storeUrl);
            }
        }).catch(err => console.error('An error occurred trying to open the store URL', err));
    };

    const handleShareApp = async () => {
        try {
            let storeLink = '';
            let message = `Check out ${appName}! It's a great app for calculating tips.\n\n`;

            if (Platform.OS === 'ios') {
                // For iOS, you typically need the numerical App Store ID for the public link.
                const actualAppStoreNumericalId = "YOUR_APPLE_APP_ID_NUMERICAL"; // e.g., "123456789"
                if (actualAppStoreNumericalId === "YOUR_APPLE_APP_ID_NUMERICAL") {
                    alert('iOS App Store ID not configured for sharing.'); return;
                }
                storeLink = `https://apps.apple.com/app/id${actualAppStoreNumericalId}`;
            } else if (Platform.OS === 'android') {
                if (playStoreId === 'YOUR_ANDROID_PACKAGE_NAME') {
                    alert('Android Package Name not configured for sharing.'); return;
                }
                storeLink = `https://play.google.com/store/apps/details?id=${playStoreId}`;
            } else {
                alert('Sharing is not supported on this platform.');
                return;
            }
            message += `Download it here: ${storeLink}`;

            await Share.share({
                message: message,
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
            content: "Last updated: May 22, 2025\n\nYour privacy is important to us. It is CafeCalc's policy to respect your privacy regarding any information we may collect from you through our app, CafeCalc.\n\nWe only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.\n\nWe only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.\n\nWe don’t share any personally identifying information publicly or with third-parties, except when required to by law.\n\nOur app may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.\n\nYou are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some ofyour desired services.\n\nYour continued use of our app will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.\n\nThis policy is effective as of May 22, 2025."
        });
    };
    const handleTermsOfService = () => {
        setInfoModalContent({
            title: "Terms of Service",
            content: "Last updated: May 22, 2025\n\nPlease read these terms and conditions carefully before using Our Service.\n\nInterpretation and Definitions...\n\n(Your full Terms of Service text would go here. This is just a placeholder. Consider using a terms of service generator or consulting a legal professional for your specific needs.)\n\nBy using CafeCalc, you signify your acceptance of these terms. If you do not agree to these terms, please do not use our app.\n\n**1. Acceptance of Terms**\nBy accessing and using CafeCalc (\"the App\"), you accept and agree to be bound by the terms and provision of this agreement. \n\n**2. Use of the App**\nThe App is provided for personal, non-commercial use to calculate tips. You agree not to use the App for any illegal or unauthorized purpose.\n\n**3. Intellectual Property**\nThe App and its original content, features, and functionality are and will remain the exclusive property of ChronoTech and its licensors.\n\n**4. Limitation of Liability**\nIn no event shall ChronoTech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the App.\n\n**5. Changes to Terms**\nWe reserve the right, at our sole discretion, to modify or replace these Terms at any time. \n\n**6. Contact Us**\nIf you have any questions about these Terms, please contact us at [Your Contact Email/Method]."
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

                {/* Appearance Mode Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance Mode</Text>
                    <View style={styles.optionsRowContainer}>
                        {themeModeOptions.map(opt => renderThemeModeOption(opt.value, opt.label))}
                    </View>
                </View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />

                {/* Theme Color Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Theme Color</Text>
                    <TouchableOpacity
                        style={[styles.dropdownHeader, { backgroundColor: settingsButtonColor, borderColor: separatorColor }]}
                        onPress={() => setIsAccentModalVisible(true)}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <View style={[styles.colorSwatch, { backgroundColor: currentAccentSelection?.colorSample }]} />
                            <Text style={[styles.dropdownHeaderText, { color: settingsButtonTextColor }]}>
                                {currentAccentSelection?.label}
                            </Text>
                        </View>
                        <Ionicons name="chevron-down-outline" size={22} color={iconColor} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
                    <View style={[styles.infoRow, { borderBottomColor: separatorColor }]}>
                        <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>App Name</Text>
                        <Text style={[styles.infoValue, { color: textColor }]}>{appName}</Text>
                    </View>
                    <View style={[styles.infoRow, { borderBottomColor: separatorColor }]}>
                        <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>App Version</Text>
                        <Text style={[styles.infoValue, { color: textColor }]}>{appVersion}</Text>
                    </View>
                    <View style={[styles.infoRow, styles.lastInfoRow]}>
                        <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Developer</Text>
                        <Text style={[styles.infoValue, { color: textColor }]}>ChronoTech</Text>
                    </View>
                </View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />


                {/* Support & Feedback Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Support & Feedback</Text>
                    <TouchableOpacity style={styles.linkButton} onPress={handleRateApp}>
                        <Ionicons name="star-outline" size={22} color={iconColor} style={styles.linkIcon} />
                        <Text style={[styles.linkText, { color: textColor }]}>Rate {appName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkButton} onPress={handleShareApp}>
                        <Ionicons name="share-social-outline" size={22} color={iconColor} style={styles.linkIcon} />
                        <Text style={[styles.linkText, { color: textColor }]}>Share {appName}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />

                {/* Legal Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Legal</Text>
                    <TouchableOpacity style={styles.linkButton} onPress={handlePrivacyPolicy}>
                        <Ionicons name="shield-checkmark-outline" size={22} color={iconColor} style={styles.linkIcon} />
                        <Text style={[styles.linkText, { color: textColor }]}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkButton} onPress={handleTermsOfService}>
                        <Ionicons name="document-text-outline" size={22} color={iconColor} style={styles.linkIcon} />
                        <Text style={[styles.linkText, { color: textColor }]}>Terms of Service</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.separator, { backgroundColor: separatorColor }]} />
            </ScrollView>

            {/* Accent Color Picker Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isAccentModalVisible}
                onRequestClose={() => setIsAccentModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsAccentModalVisible(false)}>
                    <View style={[styles.modalContent, { backgroundColor: inputBackgroundColor, borderColor: separatorColor }]}>
                        <Text style={[styles.modalTitle, { color: textColor }]}>Select Theme Color</Text>
                        {accentColorOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.modalOption,
                                    { backgroundColor: settingsButtonColor },
                                    accentColorPreference === option.value && { borderColor: primaryColor, borderWidth: 2 }
                                ]}
                                onPress={() => handleAccentColorSelect(option.value)}
                            >
                                <View style={[styles.colorSwatch, { backgroundColor: option.colorSample }]} />
                                <Text style={[styles.modalOptionText, { color: settingsButtonTextColor }]}>{option.label}</Text>
                                {accentColorPreference === option.value && (
                                    <Ionicons name="checkmark-circle-outline" size={22} color={primaryColor} style={styles.checkmarkIconSmall} />
                                )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.modalCloseButton, {backgroundColor: settingsButtonColor, marginTop: 10}]}
                            onPress={() => setIsAccentModalVisible(false)}
                        >
                            <Text style={[styles.modalCloseButtonText, {color: settingsButtonTextColor}]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Info Modal for Privacy Policy / Terms of Service */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!infoModalContent}
                onRequestClose={() => setInfoModalContent(null)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setInfoModalContent(null)}>
                    <View style={[styles.modalContent, { backgroundColor: inputBackgroundColor, borderColor: separatorColor, maxHeight: '80%' }]}>
                        <Text style={[styles.modalTitle, { color: modalTextColor }]}>{infoModalContent?.title}</Text>
                        <ScrollView style={styles.infoModalScrollView}>
                            <Text style={[styles.infoModalText, { color: modalTextColor }]}>{infoModalContent?.content}</Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={[styles.modalCloseButton, {backgroundColor: settingsButtonColor, marginTop: 15}]}
                            onPress={() => setInfoModalContent(null)}
                        >
                            <Text style={[styles.modalCloseButtonText, {color: settingsButtonTextColor}]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
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
        paddingBottom: 20,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
    optionsRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    selectableButton: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minWidth: 100,
        marginHorizontal: 5,
        minHeight: 50,
    },
    selectableButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    checkmarkIcon: {
        marginLeft: 'auto',
        paddingLeft: 8,
    },
    checkmarkIconSmall: {
        marginLeft: 'auto',
        paddingLeft: 8,
    },
    colorSwatch: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#888',
        marginRight: 10,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
    },
    dropdownHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownHeaderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    modalOptionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalCloseButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoModalScrollView: {
        maxHeight: '70%',
        marginBottom: 15,
    },
    infoModalText: {
        fontSize: 15,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    lastInfoRow: {
        borderBottomWidth: 0,
    },
    infoLabel: {
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    separator: {
        height: 1,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    linkIcon: {
        marginRight: 15,
    },
    linkText: {
        fontSize: 16,
    },
});