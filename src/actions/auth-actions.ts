"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInAction(provider?: string) {
  await signIn(provider);
}

export async function signOutAction() {
  await signOut();
}
