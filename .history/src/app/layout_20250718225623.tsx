import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import NoteProvider from "@/providers/NoteProvider";
import { createClient } from "@/auth/server";

async function AuthStateCleaner() {
  const supabase = createClient();
  const { data } = await (await supabase).auth.getUser();
  
  // If no session found, clear any potential stale state
  if (!data.user) {
    await (await supabase).auth.signOut();
  }
  
  return null;
}
export const metadata: Metadata = {
  title: "R Notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <SidebarProvider>
              <AppSidebar />

              <div className="flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
                  {children}
                </main>
              </div>
            </SidebarProvider>

            <Toaster />
          
          </NoteProvider>
             <AuthStateCleaner />
        </ThemeProvider>
      </body>
    </html>
  );
}
