import { create } from 'zustand';

interface NotificationSyncState {
  isSyncing: boolean;
  permission: 'unknown' | 'granted' | 'denied' | 'unsupported';
  error: string | null;
  revision: number;
  retry: () => void;
}

/** Resultado confirmado pelo sistema, separado das preferências de cada domínio. */
export const useNotificationSyncStore = create<NotificationSyncState>((set) => ({
  isSyncing: false, permission: 'unknown', error: null, revision: 0,
  retry: () => set((state) => ({ revision: state.revision + 1 })),
}));
