/* eslint-disable prefer-const */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  const url = request.nextUrl;

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.delete(name);
          response = NextResponse.next({
            request: { headers: request.headers },
          });
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
        // Remove code parameter from URL after successful exchange
        url.searchParams.delete("code");
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Code exchange error:", error);
    }
  }

  // Refresh session if needed
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};