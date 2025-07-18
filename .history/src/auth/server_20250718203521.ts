'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies(); // pas besoin de `await`

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          // Next.js ne permet pas de setter depuis `next/headers`, ignore ici
          // Si tu veux setter des cookies côté serveur, fais-le dans un route handler
        },
        remove(name, options) {
          // idem, tu peux ignorer
        },
      },
    }
  );
};

export async function getUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('[Supabase getUser error]', error);
    return null;
  }

  return data.user;
}
