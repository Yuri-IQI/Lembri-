/** Relógio de demonstração, sem vínculo com pareamento ou transporte Wear real. */
export interface SimulatedDevice {
  id: string;
  name: string;
  model: string;
  status: 'connected' | 'disconnected';
}

export interface DevicesRepository {
  list(): Promise<SimulatedDevice[]>;
  setConnected(id: string, connected: boolean): Promise<SimulatedDevice>;
}
