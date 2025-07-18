"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/actions/users";

function LogOutButton() {
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);

    const { errorMessage } = await logOutAction();

    if (!errorMessage) {
      router.push(`/?toastType=logOut`);
    } else {
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogOut}
      disabled={loading}
      className="w-24"
    >
       {loading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        <>
          <LogOut className="w-4 h-4 text-red-700" />
         
        </>
      )}
    </Button>
  );
}

export default LogOutButton;
