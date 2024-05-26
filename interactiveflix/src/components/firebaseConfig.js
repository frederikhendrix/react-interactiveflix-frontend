import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAp0vl-gC-v5LxjBkmRShF161Qfq33p14s",
  authDomain: "interactiveflix.firebaseapp.com",
  projectId: "interactiveflix",
  storageBucket: "interactiveflix.appspot.com",
  messagingSenderId: "764296893791",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
