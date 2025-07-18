"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "signUp";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";

  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
      }

      if (!errorMessage) {
        router.replace(`/?toastType=${type}`);
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form action={handleSubmit} style={{ boxShadow: shadow }}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            placeholder="Entrez votre e-mail"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Se connecter"
          ) : (
            "S'inscrire"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Vous n'avez pas encore de compte ?"
            : "Vous avez déjà un compte ?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "S'inscrire" : "Se connecter"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
