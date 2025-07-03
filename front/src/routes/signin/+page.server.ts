import { loginWithEmailAndPassword, logout } from "$lib/firebase/auth.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email) {
      return fail(400, { email, isMissing: true });
    }
    if (!password) {
      // Le mot de passe est une information sensible, éviter de le renvoyer, ça ne sert pas à grand chose surtout si on ne s'en sert pas derrière
      return fail(400, { email, isMissing: true });
    }

    try {
      await loginWithEmailAndPassword(cookies, email, password);
    } catch {
      return fail(400, { email, isIncorrect: true })
    }

    redirect(303, url.searchParams.get('redirectTo') || '/');
  }
} satisfies Actions;
