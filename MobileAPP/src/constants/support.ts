import type { SupportContact } from '@/types/help';

export const supportContacts: { phone: SupportContact; email: SupportContact } = {
  phone: { kind: 'demo', displayValue: '0800 1234 5678' },
  email: { kind: 'demo', displayValue: 'email@email.com' },
};
