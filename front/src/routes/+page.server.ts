import { logout } from "$lib/firebase/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { playableRulesets } = await parent();

  return {
    rulesets: playableRulesets
    // rulesets: [{ uuid: 'zhPZBo2kuOXpxdXMuXwk', name: "Magic The Gathering" }, { uuid: '123231o2kuOXpxdXMuXwk', name: "Magic The Gathering - 1" }] // mock pour le développement afin d'éviter le nombre de lecture
  }
};

export const actions = {
  logout: async ({ cookies }) => {
    await logout(cookies);
  }
} satisfies Actions;
