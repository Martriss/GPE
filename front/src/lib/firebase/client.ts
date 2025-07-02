// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { PUBLIC_FIREBASE_APIKEY, PUBLIC_FIREBASE_AUTHDOMAIN, PUBLIC_FIREBASE_PROJECTID, PUBLIC_FIREBASE_STORAGEBUCKET, PUBLIC_FIREBASE_MESSAGINGSENDERID, PUBLIC_FIREBASE_APPID } from "$env/static/public";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_APIKEY,
  authDomain: PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECTID,
  storageBucket: PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: PUBLIC_FIREBASE_APPID
};


// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

export const firestore = getFirestore(firebaseApp);

// L'auth à besoin de firebaseApp, de plus d'après les recherches (ChatGPT, stackoverflow et reddit) mettre l'authentification côté client est une meilleur idée.
export const auth = getAuth(firebaseApp);
