// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    _localStorageFiles?: Record<string, {
      name: string;
      type: string;
      size: number;
      lastModified: number;
      data: string;
      path: string;
      uploadedAt: string;
    }>;
  }
}

export {}; // This file needs to be a module
