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

export interface AssetCreateData {
  name: string;
  category: string;
  expectedRoi: number;
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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
