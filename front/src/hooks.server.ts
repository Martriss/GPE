import { redirect, type Handle } from "@sveltejs/kit";

// Rajouter toutes les routes publiques ici. Normalement il ne devrait pas y en avoir beaucoup
const PUBLIC_ROUTES = ['/', '/signin', '/signup', '/decks'];

export const handle: Handle = async ({ event, resolve }) => {
  const path: string = event.url.pathname;

  if (PUBLIC_ROUTES.includes(path)) {
    return await resolve(event);

  }

  const userId = event.cookies.get('user_id');
  if (!userId) {
    const redirectUrl: string = `/signin?redirectTo=${encodeURIComponent(path)}`
    throw redirect(303, redirectUrl);
  }

  return await resolve(event);
}
