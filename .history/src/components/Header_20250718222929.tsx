import { shadow } from "@/styles/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";
import { SidebarTrigger } from "./ui/sidebar";
import { DoorOpen, LogIn } from "lucide-react"; // Ajout d'icônes

async function Header() {
  const user = await getUser();

  return (
    <header
      className="bg-popover sticky top-0 z-50 flex h-16 w-full items-center justify-between px-3 backdrop-blur-sm sm:px-6"
      style={{ boxShadow: shadow }}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger  />
        
        <Link 
          className="group flex items-center gap-2 transition-opacity hover:opacity-80" 
          href="/"
        >
          <div className="relative h-10 w-10">
            <Image
              src="/goatius.png"
              fill
              alt="GOAT Notes logo"
              className="rounded-full object-contain"
              sizes="40px"
              priority
            />
          </div>
          <h1 className="hidden flex-col pb-0.5 text-xl font-bold leading-tight sm:flex">
            GOAT <span className="text-primary">Notes</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <DarkModeToggle />
        
        {user ? (
          <>
            {/* Version mobile - icône seulement */}
           
              <LogOutButton/>
                <DoorOpen size={18} />
             
            </Button>
            
            {/* Version desktop - texte complet */}
            <div className="hidden sm:block">
              <LogOutButton />
            </div>
          </>
        ) : (
          <div className="flex gap-1.5 sm:gap-2">
            {/* Bouton S'inscrire - caché sur mobile */}
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="hidden sm:inline-flex"
            >
              <Link href="/sign-up">S'inscrire</Link>
            </Button>
            
            {/* Bouton Connexion - version mobile */}
            <Button 
              asChild 
              size="icon" 
              className="sm:hidden"
              aria-label="Se connecter"
            >
              <Link href="/login">
                <LogIn size={18} />
              </Link>
            </Button>
            
            {/* Bouton Connexion - version desktop */}
            <Button 
              asChild 
              size="sm" 
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;