import { auth } from "$lib/firebase/client";
import { onAuthStateChanged, type User } from "@firebase/auth";
import { readonly, writable, type Writable } from "svelte/store";

const userStore: Writable<User | null> = writable<User | null>(null);
onAuthStateChanged(auth, (user) => {
  userStore.set(user);
});

export const currentUserStore = readonly(userStore);

// Ce fichier ne sera peut être pas utiliser.
// Les stores ne sont pas persistant, le moindre rafraichissement de page et tu perds le store
