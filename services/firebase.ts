// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY as string,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN as string,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID as string,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET as string,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID as string,
  appId: process.env.EXPO_PUBLIC_APP_ID as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
