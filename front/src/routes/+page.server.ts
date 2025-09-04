import { logout } from "$lib/firebase/auth";
import type { Actions } from "./$types";

export const actions = {
  logout: async ({ cookies }) => {
    await logout(cookies);
  }
} satisfies Actions;
