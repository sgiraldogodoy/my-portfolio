import { useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { classById, raceById, subraceById } from "./data/srd";
import { deriveStats } from "./derive";
import { emptyBuild, type CharacterBuild, type StoredCharacter } from "./types";
import { useCharacters } from "./useCharacters";
import CharacterWizard from "./CharacterWizard";
import CharacterSheet from "./CharacterSheet";

type View =
  | { mode: "list" }
  | { mode: "create" }
  | { mode: "edit"; character: StoredCharacter }
  | { mode: "sheet"; id: string };

export default function DndApp() {
  const { characters, loading, error, save, remove } = useCharacters();
  const [view, setView] = useState<View>({ mode: "list" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave(build: CharacterBuild) {
    setSaving(true);
    setSaveError(null);
    try {
      const id = view.mode === "edit" ? view.character.id : undefined;
      const saved = await save(build, id);
      setView({ mode: "sheet", id: saved.id });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save the character.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: StoredCharacter) {
    if (!window.confirm(`Delete ${c.build.name}? This cannot be undone.`)) return;
    await remove(c.id);
  }

  if (view.mode === "create" || view.mode === "edit") {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <h1 className="text-2xl font-bold">
          {view.mode === "edit" ? `Editing ${view.character.build.name}` : "New character"}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          D&D 5th edition (2014 rules) · walk through the steps in any order.
        </p>
        {saveError && (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {saveError}
          </p>
        )}
        <div className="mt-6">
          <CharacterWizard
            initial={view.mode === "edit" ? view.character.build : emptyBuild()}
            saving={saving}
            onSave={handleSave}
            onCancel={() => setView({ mode: "list" })}
          />
        </div>
      </main>
    );
  }

  if (view.mode === "sheet") {
    const character = characters.find((c) => c.id === view.id);
    return (
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView({ mode: "list" })}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:border-white/40"
          >
            <ArrowLeft size={16} /> All characters
          </button>
          {character && (
            <button
              onClick={() => setView({ mode: "edit", character })}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Pencil size={14} /> Edit
            </button>
          )}
        </div>
        <div className="mt-6">
          {character ? (
            <CharacterSheet build={character.build} />
          ) : (
            <p className="text-white/50">Character not found.</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">D&D Character Creator</h1>
          <p className="mt-1 text-sm text-white/50">
            Build 5th-edition characters step by step and keep them saved here.
          </p>
        </div>
        <button
          onClick={() => setView({ mode: "create" })}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={16} /> New character
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {loading && <p className="mt-6 text-sm text-white/50">Loading characters…</p>}

      {!loading && !error && characters.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center">
          <p className="text-white/60">No characters yet.</p>
          <p className="mt-1 text-sm text-white/40">
            Roll up your first adventurer — it takes about two minutes.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((c) => {
          const race = raceById(c.build.raceId);
          const subrace = subraceById(race, c.build.subraceId);
          const cls = classById(c.build.classId);
          const d = deriveStats(c.build);
          return (
            <div
              key={c.id}
              className="group relative rounded-2xl border border-white/10 bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/50"
            >
              <button
                onClick={() => setView({ mode: "sheet", id: c.id })}
                className="block w-full text-left"
              >
                <h2 className="font-semibold group-hover:text-[var(--color-accent)]">
                  {c.build.name}
                </h2>
                <p className="mt-0.5 text-sm text-white/50">
                  {subrace?.name ?? race?.name} {cls?.name} {c.build.level}
                </p>
                <div className="mt-3 flex gap-4 text-xs text-white/40">
                  <span>AC {d.ac}</span>
                  <span>HP {d.maxHp}</span>
                  <span>PP {d.passivePerception}</span>
                </div>
              </button>
              <button
                onClick={() => handleDelete(c)}
                title="Delete character"
                className="absolute right-3 top-3 rounded-lg p-2 text-white/30 opacity-0 transition hover:bg-red-500/15 hover:text-red-400 group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
