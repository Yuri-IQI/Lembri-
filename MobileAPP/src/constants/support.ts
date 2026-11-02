import type { SupportContact } from '@/types/help';

/** Substituir por contatos reais e seu discriminador para habilitar cada ação. */
export const supportContacts: { phone: SupportContact; email: SupportContact } = {
  phone: { kind: 'demo', displayValue: '0800 1234 5678' },
  email: { kind: 'demo', displayValue: 'email@email.com' },
};
