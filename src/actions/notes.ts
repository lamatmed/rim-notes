"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import openai from "@/openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Vous devez être connecté pour créer une note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Vous devez être connecté pour modifier une note");

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Vous devez être connecté pour supprimer une note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("Vous devez être connecté pour poser des questions à l'IA");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "Vous n'avez pas encore de notes.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
      Texte : ${note.text}
      Créé le : ${note.createdAt}
      Dernière modification : ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content: `
          Tu es un assistant utile qui répond aux questions sur les notes d'un utilisateur.
          Considère que toutes les questions concernent les notes de l'utilisateur.
          Tes réponses doivent être concises et non trop longues.
          Tes réponses DOIVENT être formatées en HTML propre et valide, avec une structure correcte.
          Utilise les balises <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> à <h6>, et <br> si besoin.
          N'englobe PAS toute la réponse dans une seule balise <p> sauf si c'est un seul paragraphe.
          Évite les styles en ligne, le JavaScript ou les attributs personnalisés.

          Rendu comme ceci en JSX :
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

          Voici les notes de l'utilisateur :
          ${formattedNotes}
          `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: "user", content: newQuestions[i] });
    if (responses.length > i) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return completion.choices[0].message.content || "Un problème est survenu";
};
