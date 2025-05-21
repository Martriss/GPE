// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN, FIREBASE_PROJECTID, FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGINGSENDERID, FIREBASE_APPID, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD } from "$env/static/private";
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

// réfléchir pour le faire dans un service lorsque l'authentification sera en place
export const auth = getAuth(firebaseApp);
signInWithEmailAndPassword(auth, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD)
  .then(userCredential => {
    // console.log("Utilisateur connecté :", userCredential.user);
    console.log("Utilisateur bien connecté");
  })
  .catch(error => {
    console.error("Erreur de connexion :", error);
  });
