// Import the functions you need from the SDKs you need
import { deleteApp, getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from "firebase/auth";
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

/**
 * Pour connecter un utilisateur à firebase à l'aide un email et d'un mot de passe
 * @param email email de l'utilisateur
 * @param password password de l'utilisateur
 * @returns 
 */
export async function loginWithEmailAndPassword(email: string, password: string): Promise<boolean> {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return true;
  } catch (err) {
    throw new Error("Enabled to connect the user to firebase");
  }
}

/**
 * Pour se déconnecter de firebase
 * @returns Vrai si cela réussi. Jete une erreur si cela échoue
 */
export async function logout(): Promise<boolean> {
  try {
    await signOut(auth);

    return true;
  } catch (err) {
    throw new Error("Enabled to disconnect the user from firebase");
  }
}
// if (FIREBASE_AUTH_EMAIL && FIREBASE_AUTH_PASSWORD) {
//   signInWithEmailAndPassword(auth, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD)
//     .then(userCredential => {
//       // console.log("Utilisateur connecté :", userCredential.user);
//       console.log("Utilisateur bien connecté");
//     })
//     .catch(error => {
//       console.error("Erreur de connexion :", error);
//     });
// } else {
//   signInAnonymously(auth)
//     .then(() => {
//       console.log("Utilisateur anonyme connecté");
//     })
//     .catch(error => {
//       console.error("Erreur de connexion d'utilisateur anonyme :", error);
//     });
// }
