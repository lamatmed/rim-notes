/* eslint-disable prefer-const */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  const url = request.nextUrl;

  // Create a single instance of Supabase client
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          // Update request cookies for server-side access
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Update response cookies
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          // Update request cookies
          request.cookies.delete(name);
          // Update response cookies
          response.cookies.delete(name);
        },
      },
    }
  );

  // Handle magic link authentication
  const code = url.searchParams.get("code");
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Remove code parameter from URL
        url.searchParams.delete("code");
        return NextResponse.redirect(url);
      } else {
        console.error("Code exchange error:", error);
      }
    } catch (error) {
      console.error("Code exchange exception:", error);
    }
  }

  // Refresh session to ensure it's up-to-date
  await supabase.auth.getSession();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};