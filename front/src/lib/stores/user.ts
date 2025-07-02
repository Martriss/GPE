import { auth } from "$lib/firebase/client";
import { onAuthStateChanged, type User } from "@firebase/auth";
import { readable, type Readable } from "svelte/store";

export const currentUser: Readable<User | null> = readable<User | null>(null, (set) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    // console.log(user);
    set(user);
  })

  return () => unsubscribe();
});
