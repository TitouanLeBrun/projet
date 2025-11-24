// Types pour l'API Electron exposée au renderer process

export interface Goal {
  id: number;
  targetAmount: number;
  targetDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Asset {
  id: number;
  name: string;
  category: string;
  expectedRoi: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Snapshot {
  id: number;
  assetId: number;
  value: number;
  date: Date | string;
  createdAt: Date | string;
  asset?: Asset;
}

export interface AssetCreateData {
  name: string;
  category: string;
  expectedRoi: number;
}

export interface SnapshotCreateData {
  assetId: number;
  value: number;
  date?: Date;
}

export interface AssetWithLatestSnapshot {
  asset: Asset;
  snapshot: Snapshot | null;
}

export interface HistoryPoint {
  date: Date;
  snapshots: Snapshot[];
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ElectronAPI {
  goal: {
    save: (targetAmount: number, targetDate: Date) => Promise<ApiResponse<Goal>>;
    get: () => Promise<ApiResponse<Goal | null>>;
  };
  asset: {
    create: (data: AssetCreateData) => Promise<ApiResponse<Asset>>;
    list: () => Promise<ApiResponse<Asset[]>>;
    get: (id: string) => Promise<ApiResponse<Asset | null>>;
    update: (id: string, data: AssetCreateData) => Promise<ApiResponse<Asset>>;
    delete: (id: string) => Promise<ApiResponse<Asset>>;
  };
  snapshot: {
    createBatch: (snapshots: SnapshotCreateData[]) => Promise<ApiResponse<Snapshot[]>>;
    create: (data: SnapshotCreateData) => Promise<ApiResponse<Snapshot>>;
    getByAsset: (assetId: number) => Promise<ApiResponse<Snapshot[]>>;
    getLatest: () => Promise<ApiResponse<AssetWithLatestSnapshot[]>>;
    getTotalValue: (date?: Date) => Promise<ApiResponse<{ totalValue: number; date: Date }>>;
    getHistory: () => Promise<ApiResponse<HistoryPoint[]>>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
