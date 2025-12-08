import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBnkDjxX18z5FuCxsmDPLBg_30OGg04wK4",
  authDomain: "launch-game-99b20.firebaseapp.com",
  projectId: "launch-game-99b20",
  storageBucket: "launch-game-99b20.firebasestorage.app",
  messagingSenderId: "962449052312",
  appId: "1:962449052312:web:3a6f916c4226e3ec1b76ed"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;