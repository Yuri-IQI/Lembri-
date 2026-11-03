import { create } from 'zustand';

interface NotificationSyncState {
  isSyncing: boolean;
  permission: 'unknown' | 'granted' | 'denied' | 'unsupported';
  error: string | null;
  revision: number;
  retry: () => void;
}

export const useNotificationSyncStore = create<NotificationSyncState>((set) => ({
  isSyncing: false, permission: 'unknown', error: null, revision: 0,
  retry: () => set((state) => ({ revision: state.revision + 1 })),
}));
