import type { SimulatedDevice } from '@/types/device';

export const devicesMock: readonly SimulatedDevice[] = [
  { id: 'demo-watch-1', name: 'Relógio 1', model: 'Smartwatch AB1', status: 'connected' },
  { id: 'demo-watch-2', name: 'Relógio 2', model: 'Smartwatch AB2', status: 'disconnected' },
];
