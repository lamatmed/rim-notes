"use client";

import { NoteProviderContext } from "@/providers/NoteProvider";
import { useContext } from "react";

function useNote() {
  const context = useContext(NoteProviderContext);

  if (!context) throw new Error("useNote doit être utilisé à l'intérieur d'un NoteProvider");

  return context;
}

export default useNote;
