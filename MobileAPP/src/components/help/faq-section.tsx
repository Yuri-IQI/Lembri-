import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { Spacing, TouchTarget } from '@/constants/theme';
import { helpMock } from '@/mocks/help.mock';
import type { FaqItem } from '@/types/help';

/** Mantém uma resposta aberta por vez, com possibilidade de recolher todas. */
export function FaqSection({ items = helpMock }: { items?: readonly FaqItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null);
  return (
    <View style={styles.section}>
      <ThemedText type="label" accessibilityRole="header">Perguntas frequentes</ThemedText>
      {items.length === 0 && <ThemedText>As instruções ainda não estão disponíveis.</ThemedText>}
      {items.map((item) => {
        const expanded = item.id === expandedId;
        return <Card key={item.id} style={styles.section}>
          <Pressable accessibilityRole="button" accessibilityLabel={item.question}
            accessibilityHint="Mostra ou oculta a resposta" accessibilityState={{ expanded }}
            onPress={() => setExpandedId(expanded ? null : item.id)} style={styles.trigger}>
            <ThemedText type="subheading" style={styles.question}>{item.question}</ThemedText>
            <ThemedText accessible={false} importantForAccessibility="no">{expanded ? '−' : '+'}</ThemedText>
          </Pressable>
          {expanded && <ThemedText themeColor="textSecondary">{item.answer}</ThemedText>}
        </Card>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.three },
  trigger: { minHeight: TouchTarget, minWidth: TouchTarget, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  question: { flex: 1 },
});
