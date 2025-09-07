// Mock types to match Firebase Storage API
type StorageReference = {
  fullPath: string;
  name: string;
  toString: () => string;
};

type UploadResult = {
  ref: StorageReference;
  metadata: {
    name: string;
    fullPath: string;
    size: number;
    contentType: string;
    timeCreated: string;
    updated: string;
    md5Hash: string;
    customMetadata: Record<string, string>;
  };
};

type ListResult = {
  items: StorageReference[];
  prefixes: StorageReference[];
  nextPageToken?: string;
};

type FullMetadata = {
  name: string;
  bucket: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  md5Hash: string;
  customMetadata: Record<string, string>;
  generation: string;
  metageneration: string;
  downloadTokens: string[];
};

import {
  uploadFile,
  getFileUrl,
  deleteFile,
  listFiles,
  getFileMetadata as getLocalFileMetadata
} from '../storageService';

// Mock Firebase Storage functions
const createStorageRef = (path: string): StorageReference => ({
  fullPath: path,
  name: path.split('/').pop() || '',
  toString: () => path
});

export const mockStorage = {
  ref: createStorageRef,
  
  uploadBytes: async (ref: StorageReference, data: Blob | Uint8Array | ArrayBuffer): Promise<UploadResult> => {
    const blob = data instanceof Blob ? data : new Blob([data as BlobPart]);
    const file = new File([blob], ref.name || 'file', { type: blob.type });
    await uploadFile(file, ref.fullPath);
    return {
      ref: createStorageRef(ref.fullPath),
      metadata: {
        name: file.name,
        fullPath: ref.fullPath,
        size: file.size,
        contentType: file.type || 'application/octet-stream',
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString(),
        md5Hash: '',
        customMetadata: {}
      }
    } as unknown as UploadResult;
  },
  
  getDownloadURL: async (ref: StorageReference): Promise<string> => {
    const files = listFiles(ref.fullPath);
    if (files.length === 0) {
      throw new Error('File not found');
    }
    const url = getFileUrl(files[0]);
    if (!url) {
      throw new Error('Failed to get file URL');
    }
    return url;
  },
  
  deleteObject: async (ref: StorageReference): Promise<void> => {
    const files = listFiles(ref.fullPath);
    if (files.length > 0) {
      deleteFile(files[0]);
    }
  },
  
  listAll: async (ref: StorageReference): Promise<ListResult> => {
    const files = listFiles(ref.fullPath);
    return {
      items: files.map(fileKey => ({
        fullPath: fileKey,
        name: fileKey.split('_').pop() || ''
      })) as StorageReference[],
      prefixes: [],
      nextPageToken: undefined
    };
  },
  
  getMetadata: async (ref: StorageReference): Promise<FullMetadata> => {
    const files = listFiles(ref.fullPath);
    if (files.length === 0) {
      throw new Error('File not found');
    }
    const metadata = getLocalFileMetadata(files[0]);
    if (!metadata) {
      throw new Error('Failed to get file metadata');
    }
    return {
      name: metadata.name,
      bucket: 'local-storage-bucket',
      fullPath: ref.fullPath,
      size: metadata.size,
      contentType: metadata.type || 'application/octet-stream',
      timeCreated: metadata.uploadedAt,
      updated: metadata.uploadedAt,
      md5Hash: '',
      customMetadata: {},
      generation: Date.now().toString(),
      metageneration: '1',
      downloadTokens: ['local-storage-token']
    };
  }
};

// Export mock functions that match Firebase Storage API
export const ref = mockStorage.ref;

export const uploadBytes = async (
  ref: StorageReference, 
  data: Blob | Uint8Array | ArrayBuffer
): Promise<UploadResult> => {
  const file = data instanceof Blob ? data : new Blob([data as BlobPart]);
  await uploadFile(file as File, ref.fullPath);
  return {
    ref: createStorageRef(ref.fullPath),
    metadata: {
      name: ref.name,
      fullPath: ref.fullPath,
      size: file.size,
      contentType: file.type || 'application/octet-stream',
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString(),
      md5Hash: '',
      customMetadata: {}
    }
  };
};

// Mock implementations
export const getDownloadURL = async (ref: StorageReference): Promise<string> => {
  const files = listFiles(ref.fullPath);
  if (files.length === 0) {
    throw new Error('File not found');
  }
  const url = getFileUrl(files[0]);
  if (!url) {
    throw new Error('Failed to get file URL');
  }
  return url;
};

export const deleteObject = async (ref: StorageReference): Promise<void> => {
  const files = listFiles(ref.fullPath);
  if (files.length > 0) {
    deleteFile(files[0]);
  }
};

export const listAll = async (ref: StorageReference): Promise<ListResult> => {
  const files = listFiles(ref.fullPath);
  return {
    items: files.map(fileKey => ({
      fullPath: fileKey,
      name: fileKey.split('_').pop() || ''
    })) as StorageReference[],
    prefixes: [],
    nextPageToken: undefined
  };
};

export const getMetadata = async (ref: StorageReference): Promise<FullMetadata> => {
  const files = listFiles(ref.fullPath);
  if (files.length === 0) {
    throw new Error('File not found');
  }
  const metadata = getLocalFileMetadata(files[0]);
  if (!metadata) {
    throw new Error('Failed to get file metadata');
  }
  return {
    name: metadata.name,
    bucket: 'local-storage-bucket',
    fullPath: ref.fullPath,
    size: metadata.size,
    contentType: metadata.type || 'application/octet-stream',
    timeCreated: metadata.uploadedAt,
    updated: metadata.uploadedAt,
    md5Hash: '',
    customMetadata: {},
    generation: Date.now().toString(),
    metageneration: '1',
    downloadTokens: ['local-storage-token']
  };
};

// Export a mock getStorage function
export const getStorage = () => ({
  ref: mockStorage.ref,
  uploadBytes: uploadBytes,
  getDownloadURL: getDownloadURL,
  deleteObject: deleteObject,
  listAll: listAll,
  getMetadata: getMetadata
});
