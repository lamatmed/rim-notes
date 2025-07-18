import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";

async function Header() {
  const user = await getUser();

  return (
    <header
      className="bg-popover sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 backdrop-blur-sm transition-all sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger className="flex md:hidden" />
        
        <Link 
          className="group flex items-center gap-3 transition-opacity hover:opacity-80" 
          href="/"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12">
            <Image
              src="/goatius.png"
              fill
              alt="GOAT Notes logo"
              className="rounded-full object-contain"
              sizes="(max-width: 640px) 40px, 48px"
              priority
            />
          </div>

          <h1 className="hidden flex-col pb-0.5 text-xl font-bold leading-tight sm:flex md:text-2xl">
            GOAT <span className="text-primary">Notes</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <DarkModeToggle  />
        
        {user ? (
          <LogOutButton variant="ghost" />
        ) : (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-up">S'inscrire</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;