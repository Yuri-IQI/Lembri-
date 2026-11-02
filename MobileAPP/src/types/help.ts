/** Conteúdo local de instruções, sem estado compartilhado. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type SupportContact =
  | { kind: 'demo'; displayValue: string }
  | { kind: 'phone'; displayValue: string; phoneNumber: string }
  | { kind: 'email'; displayValue: string; emailAddress: string };

export type OpenContactResult =
  | { status: 'opened' }
  | { status: 'unavailable'; message: string }
  | { status: 'failed'; message: string };
