// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'lumens-app-e66e3.firebaseapp.com',
  projectId: 'lumens-app-e66e3',
  storageBucket: 'lumens-app-e66e3.appspot.com',
  messagingSenderId: '800198728813',
  appId: '1:800198728813:web:5057a01bff58d9357ff364',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
