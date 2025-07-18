import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies(); // Pas besoin d'attendre cookies()

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll(); // Lecture uniquement
        },
        // Désactive l'écriture ici car non supportée dans `cookies()` de Next 13/14 App Router
        setAll() {
          // Pas de setAll car ça causera une erreur dans un contexte Server Component
        },
      },
    }
  );

  return client;
}

export async function getUser() {
  const supabase = createClient(); // pas besoin de `await`

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase Auth Error:", error.message);
    return null;
  }

  return data.user;
}
