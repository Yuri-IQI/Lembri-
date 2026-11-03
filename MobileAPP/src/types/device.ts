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
