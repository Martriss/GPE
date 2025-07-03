import { signInWithEmailAndPassword, signOut, type UserCredential } from "@firebase/auth";
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
