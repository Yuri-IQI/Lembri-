import { useRef, useState, type ComponentRef, type Ref } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/controles/botao';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/themed-view';
import { supportContacts } from '@/constants/support';
import { Spacing } from '@/constants/theme';
import { openSupportContact } from '@/services/support-service';
import type { SupportContact } from '@/types/help';

interface SupportSectionProps {
  contacts?: { phone: SupportContact; email: SupportContact };
  headingRef?: Ref<ComponentRef<typeof Text>>;
}

export function SupportSection({ contacts = supportContacts, headingRef }: SupportSectionProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [failedContact, setFailedContact] = useState<SupportContact | null>(null);
  const inFlight = useRef(false);
  const openContact = async (contact: SupportContact) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setMessage(null);
    const result = await openSupportContact(contact);
    setMessage(result.status === 'opened' ? null : result.message);
    setFailedContact(result.status === 'failed' ? contact : null);
    setPending(false);
    inFlight.current = false;
  };
  return (
    <View style={styles.section}>
      <ThemedText ref={headingRef} accessible type="subheading" accessibilityRole="header">Falar com alguém</ThemedText>
      {(contacts.phone.kind === 'demo' || contacts.email.kind === 'demo')
        && <ThemedText themeColor="textSecondary">Os contatos de suporte ainda não estão disponíveis. Os valores indicados como demonstrativos são apenas exemplos.</ThemedText>}
      {([
        { key: 'phone', contact: contacts.phone, label: 'Ligar para o suporte' },
        { key: 'email', contact: contacts.email, label: 'Enviar e-mail' },
      ] as const).map(({ key, contact, label }) => <Card key={key} style={styles.section}>
        <ThemedText>{contact.displayValue}</ThemedText>
        {contact.kind === 'demo' && <ThemedText themeColor="textSecondary">Contato demonstrativo</ThemedText>}
        <Botao rotulo={label} variante="secundario" ocupado={pending} desabilitado={pending || contact.kind === 'demo'}
          accessibilityLabel={`${label}${contact.kind === 'demo' ? ', indisponível: contato demonstrativo' : `: ${contact.displayValue}`}`}
          onPress={() => void openContact(contact)} />
      </Card>)}
      {pending && <ThemedText accessibilityLiveRegion="polite">Abrindo aplicativo de contato…</ThemedText>}
      {message && <ThemedText accessibilityRole="alert">{message}</ThemedText>}
      {failedContact && <Botao rotulo="Tentar abrir o contato novamente" variante="secundario" desabilitado={pending}
        onPress={() => void openContact(failedContact)} />}
    </View>
  );
}

const styles = StyleSheet.create({ section: { gap: Spacing.three } });
