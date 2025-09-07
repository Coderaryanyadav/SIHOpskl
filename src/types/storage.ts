export interface FileData {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data: string;
  path: string;
  uploadedAt: string;
  lastAccessed?: string;
  _vercel?: {
    environment: string;
    region: string;
    deployment: string;
  };
}

declare global {
  interface Window {
    _localStorageFiles?: Record<string, FileData>;
  }
}
