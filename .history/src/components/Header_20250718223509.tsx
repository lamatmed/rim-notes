"use client";

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
      className="fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3 bg-popover/90 backdrop-blur shadow-md sm:px-8"
      style={{ boxShadow: shadow }}
    >
      {/* Sidebar mobile */}
      <div className="sm:hidden">
        <SidebarTrigger />
      </div>

      {/* Logo & Titre */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/goatius.png"
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
          priority
        />
        <div className="flex flex-col leading-tight text-sm sm:text-base font-semibold">
          <span>GOAT</span>
          <span className="text-muted-foreground">Notes</span>
        </div>
      </Link>

      {/* Actions (DarkMode + Auth) */}
      <div className="flex items-center gap-2 sm:gap-4">
        <DarkModeToggle />
        {user ? (
          <LogOutButton />
        ) : (
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/sign-up">S'inscrire</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
