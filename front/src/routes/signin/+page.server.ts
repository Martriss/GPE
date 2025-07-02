import { FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD } from "$env/static/private";
import { loginWithEmailAndPassword, logout } from "$lib/firebase/auth.js";
import type { Actions } from "./$types";

export const actions = {
  login: async ({ cookies }) => {
    await loginWithEmailAndPassword(cookies, FIREBASE_AUTH_EMAIL, FIREBASE_AUTH_PASSWORD);
  },
  logout: async ({ cookies }) => {
    await logout(cookies);
  }
} satisfies Actions;
