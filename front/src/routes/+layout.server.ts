import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const isConnected: boolean = !!cookies.get('user_id');

  return {
    isConnected
  }
}
