import { StyleSheet, View, type ViewProps } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const MainContainer = ({ style, ...rest }: ViewProps) => {
  const theme = useTheme();

  return <View style={[styles.container, { backgroundColor: theme.background }, style]} {...rest} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
});
