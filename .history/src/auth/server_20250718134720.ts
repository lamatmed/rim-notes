import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies,
      cookieOptions: {
        name: "sb-custom-session"
      }
    }
  );
  return client;
}

export async function getUser() {
  const { auth } = await createClient();

  const userObject = await auth.getUser();

  if (userObject.error && userObject.error.message !== "Auth session missing!") {
    console.error(userObject.error);
    return null;
  }

  return userObject.data.user;
}
