// Maximum file size: 5MB (Vercel Serverless Function limit is 4.5MB for free tier)
import type { FileData } from '../types/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface FileMetadata {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  path: string;
  uploadedAt: string;
  lastAccessed?: string;
}

/**
 * Uploads a file to local storage with Vercel-optimized approach
 * @param file - The file to upload
 * @param path - The path to store the file in
 * @returns Promise that resolves with the file key
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file size (Vercel free tier has limits)
    if (file.size > MAX_FILE_SIZE) {
      return reject(new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit for free tier`));
    }

    const reader = new FileReader();
    
    reader.onloadend = () => {
      try {
        const base64Data = reader.result as string;
        // Create a unique key with timestamp and sanitized filename
        const fileKey = `file_${Date.now()}_${file.name.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()}`;
        
        const fileData: FileData = {
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          lastModified: file.lastModified,
          data: base64Data.split(',')[1], // Remove data URL prefix
          path: path || '/uploads', // Default to /uploads directory
          uploadedAt: new Date().toISOString(),
          _vercel: {
            environment: process.env.NODE_ENV || 'development',
            region: process.env.VERCEL_REGION || 'local',
            deployment: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
          }
        };
        
        // In-memory cache for better performance
        if (typeof window !== 'undefined') {
          try {
            window._localStorageFiles = window._localStorageFiles || {};
            window._localStorageFiles[fileKey] = fileData;
          } catch (e) {
            console.warn('Failed to cache file in memory:', e);
          }
        }
        
        // Store in localStorage with error handling
        try {
          localStorage.setItem(fileKey, JSON.stringify(fileData));
          trackStorageUsage();
          resolve(fileKey);
        } catch (e) {
          console.error('LocalStorage error:', e);
          // If localStorage is full, try to clear old files
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            clearOldFiles()
              .then(() => {
                // Retry after cleanup
                localStorage.setItem(fileKey, JSON.stringify(fileData));
                resolve(fileKey);
              })
              .catch(cleanupError => {
                console.error('Failed to clear space:', cleanupError);
                reject(new Error('Storage is full and could not be cleared'));
              });
          } else {
            reject(e);
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read file'));
    };
    
    // Start reading the file
    reader.readAsDataURL(file);
  });
};

/**
 * Tracks storage usage and logs it to the console
 * Vercel has storage limits, so we should monitor usage
 */
const trackStorageUsage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    let totalSize = 0;
    const fileCount = Object.keys(localStorage).filter(key => key.startsWith('file_')).length;
    
    // Calculate total size of all files
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('file_')) {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      }
    }
    
    const totalSizeMB = totalSize / (1024 * 1024);
    const maxSizeMB = 5; // 5MB limit
    const usagePercent = (totalSizeMB / maxSizeMB) * 100;
    
    console.log(`📊 Storage Usage: ${totalSizeMB.toFixed(2)}MB (${usagePercent.toFixed(1)}% of ${maxSizeMB}MB limit)`);
    console.log(`📂 Files stored: ${fileCount}`);
    
    // Show warning if approaching limit
    if (usagePercent > 80) {
      console.warn('⚠️  Warning: Storage usage is approaching the limit. Consider cleaning up old files.');
    }
  } catch (error) {
    console.error('Error tracking storage usage:', error);
  }
};

/**
 * Clears old files to free up space
 * Implements LRU (Least Recently Used) cache eviction
 */
const clearOldFiles = async (targetSizeMB = 2): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    const targetSize = targetSizeMB * 1024 * 1024; // Convert MB to bytes
    let totalSize = 0;
    const files: Array<{ key: string; lastAccessed: number; size: number }> = [];
    
    // First pass: collect all files and their metadata
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('file_')) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const data = JSON.parse(item) as FileData;
            const size = new Blob([item]).size;
            files.push({
              key,
              lastAccessed: new Date(data.lastAccessed || data.uploadedAt).getTime(),
              size
            });
            totalSize += size;
          } catch (e) {
            console.warn(`Error processing file ${key}:`, e);
          }
        }
      }
    }
    
    // If we're under the target size, no need to delete anything
    if (totalSize <= targetSize) return;
    
    // Sort files by last accessed time (oldest first)
    files.sort((a, b) => a.lastAccessed - b.lastAccessed);
    
    // Delete files until we're under the target size
    for (const file of files) {
      if (totalSize <= targetSize) break;
      
      localStorage.removeItem(file.key);
      
      // Also remove from in-memory cache if it exists
      if (window._localStorageFiles?.[file.key]) {
        delete window._localStorageFiles[file.key];
      }
      
      totalSize -= file.size;
      console.log(`🗑️  Deleted old file: ${file.key} (${(file.size / 1024).toFixed(2)}KB)`);
    }
    
    console.log(`✅ Storage cleaned up. New size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
  } catch (error) {
    console.error('Error clearing old files:', error);
    throw error; // Re-throw to allow handling in the calling function
  }
};

/**
 * Deletes a file from both in-memory cache and localStorage
 * @param fileKey - The key of the file to delete
 * @returns boolean indicating success
 */
export const deleteFile = (fileKey: string): boolean => {
  if (!fileKey) return false;
  
  try {
    // Remove from in-memory cache
    if (typeof window !== 'undefined' && window._localStorageFiles?.[fileKey]) {
      delete window._localStorageFiles[fileKey];
    }
    
    // Remove from localStorage
    if (localStorage.getItem(fileKey)) {
      localStorage.removeItem(fileKey);
      trackStorageUsage();
      console.log(`🗑️  Deleted file: ${fileKey}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Lists all files in storage, optionally filtered by path
 * @param path - Optional path to filter files by
 * @returns Array of file keys
 */
export const listFiles = (path?: string): string[] => {
  const files: Set<string> = new Set();
  
  try {
    // Check in-memory cache first for better performance
    if (typeof window !== 'undefined' && window._localStorageFiles) {
      for (const key in window._localStorageFiles) {
        if (path) {
          const fileData = window._localStorageFiles[key];
          if (fileData.path === path) {
            files.add(key);
          }
        } else {
          files.add(key);
        }
      }
    }
    
    // Fall back to localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Skip non-file keys or already processed keys
      if (!key?.startsWith('file_') || files.has(key)) continue;
      
      if (path) {
        const fileData = localStorage.getItem(key);
        if (fileData) {
          try {
            const { path: filePath } = JSON.parse(fileData) as FileData;
            if (filePath === path) {
              files.add(key);
            }
          } catch (error) {
            console.error(`Error parsing file data for ${key}:`, error);
            // If we can't parse the file, consider it corrupted and clean it up
            localStorage.removeItem(key);
          }
        }
      } else {
        files.add(key);
      }
    }
    
    return Array.from(files);
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

/**
 * Gets a file URL from storage
 * First checks in-memory cache, then falls back to localStorage
 */
export const getFileUrl = (fileKey: string): string | null => {
  if (!fileKey) return null;
  
  try {
    // First check in-memory cache for better performance
    if (typeof window !== 'undefined' && window._localStorageFiles?.[fileKey]) {
      const fileData = window._localStorageFiles[fileKey];
      return `data:${fileData.type};base64,${fileData.data}`;
    }
    
    // Fall back to localStorage
    const fileData = localStorage.getItem(fileKey);
    if (!fileData) return null;
    
    try {
      const { data, type } = JSON.parse(fileData) as FileData;
      
      // Update last accessed time
      try {
        const file = JSON.parse(fileData) as FileData;
        file.lastAccessed = new Date().toISOString();
        localStorage.setItem(fileKey, JSON.stringify(file));
      } catch (e) {
        console.warn('Could not update last accessed time:', e);
      }
      
      return `data:${type};base64,${data}`;
    } catch (error) {
      console.error('Error parsing file data:', error);
      return null;
    }
  } catch (error) {
    console.error('Error accessing storage:', error);
    return null;
  }
};

/**
 * Gets file metadata from storage
 * First checks in-memory cache, then falls back to localStorage
 */
export const getFileMetadata = (fileKey: string): FileMetadata | null => {
  if (!fileKey) return null;
  
  try {
    // First check in-memory cache
    if (typeof window !== 'undefined' && window._localStorageFiles?.[fileKey]) {
      const { name, type, size, lastModified, path, uploadedAt, lastAccessed } = window._localStorageFiles[fileKey];
      return { name, type, size, lastModified, path, uploadedAt, lastAccessed };
    }
    
    // Fall back to localStorage
    const fileData = localStorage.getItem(fileKey);
    if (!fileData) return null;
    
    try {
      const { name, type, size, lastModified, path, uploadedAt, lastAccessed } = JSON.parse(fileData) as FileData;
      return { name, type, size, lastModified, path, uploadedAt, lastAccessed };
    } catch (error) {
      console.error('Error parsing file metadata:', error);
      return null;
    }
  } catch (error) {
    console.error('Error accessing storage:', error);
    return null;
  }
};

// Initialize in-memory cache on module load
if (typeof window !== 'undefined') {
  window._localStorageFiles = window._localStorageFiles || {};
}
