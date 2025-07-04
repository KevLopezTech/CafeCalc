// components/Collapsible.tsx
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from "@/hooks/useThemeColor"; // Import our custom theme hook

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
    const [isOpen, setIsOpen] = useState(false);

    // Use our custom hook to get the correct themed color.
    // 'tint' is a good choice for interactive icons. You could also use 'icon' or 'primary'.
    const tintColor = useThemeColor('tint');

    return (
        <ThemedView>
            <TouchableOpacity
                style={styles.heading}
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}>
                <IconSymbol
                    name="chevron.right"
                    size={18}
                    weight="medium"
                    color={tintColor} // Use the themed color here
                    style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
                />

                <ThemedText type="defaultSemiBold">{title}</ThemedText>
            </TouchableOpacity>
            {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
