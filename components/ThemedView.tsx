import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { ColorRole } from '@/constants/Colors'

export type ThemedViewProps = ViewProps & {
  colorRole?: ColorRole;
};

export function ThemedView({ style, colorRole = 'background', ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(colorRole);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
