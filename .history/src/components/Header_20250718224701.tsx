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
      className="bg-popover sticky top-0 z-50 flex h-16 w-full items-center justify-between px-4 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <div className="flex flex-1 items-center gap-4">
        <SidebarTrigger />
        
        <Link 
          href="/" 
          className="flex items-center gap-2 focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          aria-label="Accueil"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12">
            <Image
              src="/goatius.png"
              fill
              sizes="(max-width: 640px) 40px, 48px"
              alt="Logo GOAT Notes"
              className="rounded-full object-contain"
              priority
            />
          </div>
          
          <h1 className="hidden sm:flex flex-col text-base font-semibold leading-tight">
            <span className="text-primary">GOAT</span>
            <span className="text-foreground">Notes</span>
          </h1>
        </Link>
      </div>

      <div className="flex flex-1 justify-end items-center gap-3">
        <div className="hidden md:block">
          {user ? (
            <LogOutButton />
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/sign-up">S'inscrire</Link>
              </Button>
              <Button asChild className="ml-2">
                <Link href="/login"><login></login></Link>
              </Button>
            </>
          )}
        </div>
        
        <DarkModeToggle aria-label="Basculer le mode sombre" />
        
        {/* Version mobile pour les actions utilisateur */}
        <div className="md:hidden">
          {user ? (
            <LogOutButton  />
          ) : (
            <Button asChild size="icon" variant="ghost">
              <Link href="/login" aria-label="Se connecter">
                <UserIcon />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// Composant d'icône temporaire pour la connexion mobile
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default Header;