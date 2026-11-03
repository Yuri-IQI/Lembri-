import { devicesMock } from '@/mocks/devices.mock';
import type { DevicesRepository, SimulatedDevice } from '@/types/device';

export function createDevicesRepository(initial: readonly SimulatedDevice[] = devicesMock): DevicesRepository {
  let devices = initial.map((device) => ({ ...device }));
  return {
    list: async () => devices.map((device) => ({ ...device })),
    setConnected: async (id, connected) => {
      const existing = devices.find((device) => device.id === id);
      if (!existing) throw new Error('Relógio de demonstração não encontrado.');
      const updated: SimulatedDevice = { ...existing, status: connected ? 'connected' : 'disconnected' };
      devices = devices.map((device) => device.id === id ? updated : device);
      return { ...updated };
    },
  };
}
