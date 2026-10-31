import type { TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, type ViewProps } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { BarFrame } from '@/components/app-bar/bar-frame';
import { ThemedText } from '@/components/themed-text';
import { ComponentSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type BottomBarIcone = ComponentType<SvgProps & { preenchimento?: string }>;

export const BottomBar = ({ style, ...rest }: ViewProps) => {
  return <BarFrame posicao="bottom" style={[styles.barra, style]} {...rest} />;
};

type BottomBarItemProps = Omit<TabTriggerSlotProps, 'ref'> & {
  Icone: BottomBarIcone;
  rotulo: string;
};

export const BottomBarItem = ({ Icone, rotulo, isFocused, style, ...rest }: BottomBarItemProps) => {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={rotulo}
      accessibilityState={{ selected: isFocused }}
      style={(estado) => [typeof style === 'function' ? style(estado) : style, styles.item]}
      {...rest}>
      <Icone
        width={36}
        height={36}
        preenchimento={isFocused ? theme.tabActive : 'transparent'}
      />
      <ThemedText type="smallBold">{rotulo}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  barra: {
    minHeight: ComponentSize.bottomBarHeight,
    gap: 0,
    paddingHorizontal: Spacing.two,
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
});
