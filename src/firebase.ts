// This file is now deprecated. Please use src/config/firebase.ts instead.
// Importing and re-exporting for backward compatibility.
import { 
  app, 
  auth, 
  db, 
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from './config/firebase';

export { 
  app, 
  auth, 
  db, 
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata 
};
