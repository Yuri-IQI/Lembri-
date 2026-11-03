import { create } from 'zustand';

import { createDevicesRepository } from '@/services/devices-repository';
import type { DevicesRepository, SimulatedDevice } from '@/types/device';

interface DevicesState {
  devices: SimulatedDevice[];
  loaded: boolean;
  isLoading: boolean;
  pendingDeviceId: string | null;
  error: string | null;
  load: () => Promise<void>;
  setConnected: (id: string, connected: boolean) => Promise<void>;
  resetToMocks: () => void;
}

export function createDevicesStore(repository: DevicesRepository = createDevicesRepository()) {
  let generation = 0;
  return create<DevicesState>((set, get) => ({
    devices: [], loaded: false, isLoading: false, pendingDeviceId: null, error: null,
    load: async () => {
      if (get().isLoading || get().pendingDeviceId) return;
      const request = generation;
      set({ isLoading: true, error: null });
      try {
        const devices = await repository.list();
        if (generation === request) set({ devices, loaded: true });
      } catch {
        if (generation === request) set({ error: 'Não foi possível carregar os relógios. Tente novamente.' });
      } finally {
        if (generation === request) set({ isLoading: false });
      }
    },
    setConnected: async (id, connected) => {
      if (get().pendingDeviceId || get().isLoading) return;
      const request = generation;
      set({ pendingDeviceId: id, error: null });
      try {
        const updated = await repository.setConnected(id, connected);
        if (generation === request) set((state) => ({
          devices: state.devices.map((device) => device.id === id ? updated : device),
        }));
      } catch {
        if (generation === request) set({ error: 'Não foi possível alterar a conexão de demonstração. Tente novamente.' });
      } finally {
        if (generation === request) set({ pendingDeviceId: null });
      }
    },
    resetToMocks: () => {
      generation += 1;
      repository = createDevicesRepository();
      set({ devices: [], loaded: false, isLoading: false, pendingDeviceId: null, error: null });
      void get().load();
    },
  }));
}

export const useDevicesStore = createDevicesStore();
