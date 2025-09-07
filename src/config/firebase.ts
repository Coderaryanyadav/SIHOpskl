import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdN0bYfnR-0B1DpU6v8AvLk0Ez2R2vRV0",
  authDomain: "sih-opskl-5ff32.firebaseapp.com",
  projectId: "sih-opskl-5ff32",
  messagingSenderId: "499617953813",
  appId: "1:499617953813:web:82c720e3b61746d463361c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

export default {
  app,
  auth,
  db
};
