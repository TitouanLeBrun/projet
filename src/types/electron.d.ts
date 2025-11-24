// Types pour l'API Electron exposée au renderer process

export interface Goal {
  id: number;
  targetAmount: number;
  targetDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
