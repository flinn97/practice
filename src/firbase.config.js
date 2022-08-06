
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhedQt9NbIkgSsB11rxpOLb-nHK18DwGE",
  authDomain: "devopps-9ec3e.firebaseapp.com",
  projectId: "devopps-9ec3e",
  storageBucket: "devopps-9ec3e.appspot.com",
  messagingSenderId: "1036556952175",
  appId: "1:1036556952175:web:27c7323ca953dc4e2ea39a",
  measurementId: "G-4NZRW54SSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore(app);
const auth = getAuth(app);
export {db, storage, auth};