// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_APIKEY } from "$env/static/private";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: FIREBASE_APIKEY,

  authDomain: "grimoire-infini.firebaseapp.com",

  projectId: "grimoire-infini",

  storageBucket: "grimoire-infini.firebasestorage.app",

  messagingSenderId: "1086816277051",

  appId: "1:1086816277051:web:8c05e290b236ebea88821e"

};


// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

export const firestore = getFirestore(firebaseApp);
