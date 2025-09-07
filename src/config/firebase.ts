import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll, 
  getMetadata 
} from '../services/firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdN0bYfnR-0B1DpU6v8AvLk0Ez2R2vRV0",
  authDomain: "sih-opskl-5ff32.firebaseapp.com",
  projectId: "sih-opskl-5ff32",
  storageBucket: "sih-opskl-5ff32.appspot.com",
  messagingSenderId: "499617953813",
  appId: "1:499617953813:web:82c720e3b61746d463361c",
  measurementId: "G-S7P8FR8DSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

// Export everything
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

export default {
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
