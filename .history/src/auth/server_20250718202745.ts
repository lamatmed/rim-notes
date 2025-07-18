// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (await cookieStore).getAll();
        },
        // Supprime setAll si tu es dans un composant read-only
        // sinon Next.js va planter ou ignorer
        setAll() {},
      },
    },
  );

  return client;
}

export async function getUser() {
  const client = createClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    console.error(error);
    return null;
  }

  return user;
}
