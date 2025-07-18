import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";
import { Menu } from "lucide-react";

async function Header() {
  const user = await getUser();

  return (
    <header
      className="bg-popover sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 shadow-md sm:h-20 sm:px-6"
      style={{
        boxShadow: shadow,
      }}
    >
      {/* Partie gauche - Logo et menu */}
      <div className="flex flex-1 items-center gap-2 sm:gap-4">
        <SidebarTrigger className="flex sm:hidden">
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        
        <Link 
          className="flex items-center gap-2 transition-transform hover:scale-[1.02]" 
          href="/"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12">
            <Image
              src="/goatius.png"
              fill
              alt="logo"
              className="rounded-full object-contain"
              priority
              sizes="(max-width: 640px) 40px, 48px"
            />
          </div>

          <h1 className="flex flex-col text-xl font-semibold leading-5 sm:text-2xl sm:leading-6">
            GOAT <span>Notes</span>
          </h1>
        </Link>
      </div>

      {/* Partie droite - Actions */}
      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
        <div className="hidden sm:block">
          {user ? (
            <LogOutButton />
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/sign-up">S'inscrire</Link>
              </Button>
              <Button asChild variant="outline" className="ml-2">
                <Link href="/login">Se connecter</Link>
              </Button>
            </>
          )}
        </div>

        <DarkModeToggle  />
        
        {/* Menu mobile pour actions */}
        {user ? (
          <div className="sm:hidden">
            <LogOutButton mobile />
          </div>
        ) : (
          <Button asChild variant="outline" size="icon" className="sm:hidden">
            <Link href="/login" aria-label="Se connecter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" x2="3" y1="12" y2="12"/>
              </svg>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;