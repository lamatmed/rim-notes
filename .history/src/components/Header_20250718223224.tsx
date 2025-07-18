/* eslint-disable @next/next/no-async-client-component */
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
      className="bg-popover fixed z-50 flex w-full items-center justify-between px-4 py-3 shadow-md sm:px-8"
      style={{ boxShadow: shadow }}
    >
      {/* Sidebar (mobile) */}
      <div className="sm:hidden">
        <SidebarTrigger className="text-muted-foreground" />
      </div>

      {/* Logo + Titre */}
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/goatius.png"
          height={48}
          width={48}
          alt="logo"
          className="rounded-full"
          priority
        />
        <div className="leading-tight text-sm sm:text-base font-semibold">
          <span className="block">GOAT</span>
          <span className="text-muted-foreground">Notes</span>
        </div>
      </Link>

      {/* Actions à droite */}
      <div className="flex items-center gap-2 sm:gap-4">
        <DarkModeToggle />

        {user ? (
          <LogOutButton />
        ) : (
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/sign-up" className="text-sm">S'inscrire</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <Link href="/login" className="text-sm">Se connecter</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
