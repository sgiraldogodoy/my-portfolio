import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  createDndCharacter,
  deleteDndCharacter,
  getDndCharacters,
  updateDndCharacter,
} from "../../lib/api";
import type { CharacterBuild, StoredCharacter } from "./types";

/** Loads the user's saved characters and exposes CRUD that keeps state in sync. */
export function useCharacters() {
  const [characters, setCharacters] = useState<StoredCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDndCharacters<CharacterBuild>()
      .then(({ characters }) => {
        if (!cancelled) setCharacters(characters);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load characters.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback(async (build: CharacterBuild, id?: string) => {
    if (id) {
      const { character } = await updateDndCharacter(id, build);
      setCharacters((prev) => {
        const next = prev.map((c) => (c.id === id ? character : c));
        return next.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      return character;
    }
    const { character } = await createDndCharacter(build);
    setCharacters((prev) => [character, ...prev]);
    return character;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteDndCharacter(id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { characters, loading, error, save, remove };
}
