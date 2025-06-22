// components/ThemedText.tsx
import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorRole } from '@/constants/Colors'; // Import the ColorRole type

export type ThemedTextProps = TextProps & {
    /**
     * The color role from your Colors.ts file to use for the text.
     * Defaults to 'text'.
     */
    colorRole?: ColorRole;
    /**
     * The predefined type of text style to apply.
     */
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
                               style,
                               colorRole = 'text', // Default to the main 'text' color role
                               type = 'default',
                               ...rest
                           }: ThemedTextProps) {
    // Use our custom hook with a single argument: the color role.
    const color = useThemeColor(colorRole);

    return (
        <Text
            style={[
                { color },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4', // Consider making this a 'link' color role in your theme
    },
});