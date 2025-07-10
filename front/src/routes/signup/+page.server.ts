import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { registerWithEmailAndPassword } from "$lib/firebase/auth";
import { validatePassword } from "firebase/auth";
import { auth } from "$lib/firebase/client.js";

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

    const status = await validatePassword(auth, password);
    if (!status.isValid) {
      return fail(400, { email, isInvalidPwd: true })
    }

    try {
      await registerWithEmailAndPassword(cookies, email, password);
    } catch (err) {
      const singleError: Error = err as Error;
      if (singleError.message === 'Problem with email')
        return fail(400, { email, isInvalidEmail: true });

      error(500, 'something went wrong');
    }

    redirect(303, url.searchParams.get('redirectTo') || '/');
  }
} satisfies Actions;
