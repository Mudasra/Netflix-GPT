import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAV4-1hawg0pqiMrehA9dEsWQ6_fdVLfx4",
  authDomain: "netflix-gpt-7bed7.firebaseapp.com",
  projectId: "netflix-gpt-7bed7",
  storageBucket: "netflix-gpt-7bed7.firebasestorage.app",
  messagingSenderId: "254376319681",
  appId: "1:254376319681:web:d755ef170dd967b7399240",
  measurementId: "G-91H51GHV5W"
};

export const auth = getAuth(initializeApp(firebaseConfig));
