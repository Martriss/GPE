// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN, FIREBASE_PROJECTID, FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGINGSENDERID, FIREBASE_APPID } from "$env/static/private";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: FIREBASE_APIKEY,

  authDomain: FIREBASE_AUTHDOMAIN,

  projectId: FIREBASE_PROJECTID,

  storageBucket: FIREBASE_STORAGEBUCKET,

  messagingSenderId: FIREBASE_MESSAGINGSENDERID,

  appId: FIREBASE_APPID

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
