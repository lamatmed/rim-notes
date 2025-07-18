"use client";

import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ToastVariant = "success" | "destructive" | "default";

type ToastConfig = {
  title: string;
  description: string;
  variant: ToastVariant;
};

const TOAST_CONFIG: Record<string, ToastConfig> = {
  login: {
    title: "Connecté",
    description: "Vous vous êtes connecté avec succès",
    variant: "success",
  },
  signUp: {
    title: "Inscription réussie",
    description: "Vérifiez votre e-mail pour un lien de confirmation",
    variant: "success",
  },
  newNote: {
    title: "Nouvelle note",
    description: "Vous avez créé une nouvelle note avec succès",
    variant: "success",
  },
  logOut: {
    title: "Déconnecté",
    description: "Vous vous êtes déconnecté avec succès",
    variant: "success",
  },
};

type ToastType = keyof typeof TOAST_CONFIG;

function isToastType(value: string | null): value is ToastType {
  return value !== null && value in TOAST_CONFIG;
}

function HomeToast() {
  const toastType = useSearchParams().get("toastType");
  const { toast } = useToast();

  const removeUrlParam = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("toastType");
    const newUrl = `${window.location.pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  };

  useEffect(() => {
    if (isToastType(toastType)) {
      toast({
        ...TOAST_CONFIG[toastType],
      });

      removeUrlParam();
    }
  }, [toastType, toast]);

  return null;
}

export default HomeToast;
