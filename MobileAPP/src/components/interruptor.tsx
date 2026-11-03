import type { ComponentRef, Ref } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { BorderWidth, ComponentSize, Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InterruptorProps = {
  ligado: boolean;
  onAlternar: () => void;
  accessibilityLabel: string;
  controlRef?: Ref<ComponentRef<typeof View>>;
};

const LARGURA = ComponentSize.switchWidth;
const ALTURA = ComponentSize.switchHeight;
const BOLINHA = ComponentSize.switchKnob;

export const Interruptor = ({ ligado, onAlternar, accessibilityLabel, controlRef }: InterruptorProps) => {
  const theme = useTheme();

  return (
    <Pressable
      ref={controlRef}
      onPress={onAlternar}
      accessibilityRole="switch"
      accessibilityState={{ checked: ligado }}
      aria-checked={ligado}
      accessibilityLabel={accessibilityLabel}
      onKeyDown={Platform.OS === 'web' ? (event) => {
        const { key, repeat } = event.nativeEvent;
        if (key === ' ' || key === 'Spacebar') {
          event.preventDefault();
          if (!repeat) onAlternar();
        }
      } : undefined}
      style={styles.areaToque}>
      <View style={[styles.trilho, {
        backgroundColor: ligado ? theme.primary : theme.surface,
        borderColor: theme.textSecondary,
        alignItems: ligado ? 'flex-end' : 'flex-start',
      }]}>
      <View
        style={[
          styles.bolinha,
          { backgroundColor: ligado ? theme.surface : theme.textSecondary },
        ]}
      />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  areaToque: {
    minWidth: TouchTarget,
    minHeight: TouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trilho: {
    width: LARGURA,
    height: ALTURA,
    justifyContent: 'center',
    paddingHorizontal: (ALTURA - BOLINHA) / 2 - BorderWidth.thin,
    borderWidth: BorderWidth.thin,
    borderRadius: Radius.full,
  },
  bolinha: {
    width: BOLINHA - BorderWidth.thin * 2,
    height: BOLINHA - BorderWidth.thin * 2,
    borderRadius: Radius.full,
  },
});
