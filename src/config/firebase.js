import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBW-T4-5DrAxWbnrQXPotYTplw3Y4IUaic",
  authDomain: "tn-studymate-a4ffc.firebaseapp.com",
  projectId: "tn-studymate-a4ffc",
  storageBucket: "tn-studymate-a4ffc.firebasestorage.app",
  messagingSenderId: "937161387999",
  appId: "1:937161387999:web:3f583c977fb41b16e41e6a",
  measurementId: "G-LZ2XFH253Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
