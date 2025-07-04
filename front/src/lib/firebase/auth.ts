import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, validatePassword, type UserCredential } from "@firebase/auth";
import { auth } from "./client";
import type { Cookies } from "@sveltejs/kit";

export const currentUser = auth.currentUser;

/**
 * Pour connecter un utilisateur à firebase à l'aide un email et d'un mot de passe. Jete une erreur si la connexion échoue
 * @param cookies les cookies du serveur. C'est utilisé afin de sauvegarder l'id de l'utilisateur qui vient de se connecté dans un cookie sécurisé
 * @param email email de l'utilisateur
 * @param password password de l'utilisateur
 */
export async function loginWithEmailAndPassword(cookies: Cookies, email: string, password: string): Promise<void> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);

    cookies.set('user_id', userCredential.user.uid, { path: '/' });
    console.log("User connected");
  } catch (err) {
    throw new Error("Enabled to connect the user to firebase");
  }
}

/**
 * Pour se déconnecter de firebase. Jete une erreur si la déconnexion échoue
 * @param cookies les cookies du serveur. C'est utilisé pour supprimer le cookie qui stocke l'id de l'utilisateur anciennement connecté
 */
export async function logout(cookies: Cookies): Promise<void> {
  try {
    await signOut(auth);
    cookies.delete('user_id', { path: '/' });
    console.log("User disconnected");
  } catch (err) {
    throw new Error("Enabled to disconnect the user from firebase");
  }
}

/**
 * Pour inscrire un utilisateur à firebase à l'aide d'une email et d'un mot de passe. L'inscription connecte automatique l'utilisateur. Jete une erreur si l'inscription échoue
 * @param cookies les cookies du serveur. C'est utilisé afin de sauvegarder l'id de l'utilisateur qui vient de se connecté dans un cookie sécurisé
 * @param email email de l'utilisateur
 * @param password password de l'utilisateur
 */
export async function registerWithEmailAndPassword(cookies: Cookies, email: string, password: string): Promise<void> {
  // Vérification du mot de passe
  const status = await validatePassword(auth, password);
  if (!status.isValid) {
    throw new Error("Password does not comply with security rules");
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

    cookies.set('user_id', userCredential.user.uid, { path: '/' });
    console.log("User register and connected");
  } catch (err) {
    throw new Error("Enabled to register the user to firebase");
  }
}
