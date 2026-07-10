import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { classById, raceById, backgroundById } from "./data/srd";
import { buildProblems, deriveStats, fmt } from "./derive";
import type { CharacterBuild } from "./types";
import CharacterSheet from "./CharacterSheet";
import ClassStep from "./steps/ClassStep";
import RaceStep from "./steps/RaceStep";
import AbilitiesStep from "./steps/AbilitiesStep";
import BackgroundStep from "./steps/BackgroundStep";
import DetailsStep from "./steps/DetailsStep";

const STEPS = ["Class", "Race", "Abilities", "Background", "Details", "Review"] as const;

export default function CharacterWizard({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: CharacterBuild;
  saving: boolean;
  onSave: (build: CharacterBuild) => void;
  onCancel: () => void;
}) {
  const [build, setBuild] = useState<CharacterBuild>(initial);
  const [step, setStep] = useState(0);

  const patch = (p: Partial<CharacterBuild>) => setBuild((prev) => ({ ...prev, ...p }));

  const problems = useMemo(() => buildProblems(build), [build]);
  const derived = useMemo(() => deriveStats(build), [build]);
  const cls = classById(build.classId);
  const race = raceById(build.raceId);
  const bg = backgroundById(build.backgroundId);

  const isReview = step === STEPS.length - 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div>
        {/* Step tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                i === step
                  ? "bg-[var(--color-accent)] font-semibold text-white"
                  : "text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
          <button
            type="button"
            onClick={onCancel}
            title="Discard and go back"
            className="ml-auto rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4">
          {step === 0 && <ClassStep build={build} patch={patch} />}
          {step === 1 && <RaceStep build={build} patch={patch} />}
          {step === 2 && <AbilitiesStep build={build} patch={patch} />}
          {step === 3 && <BackgroundStep build={build} patch={patch} />}
          {step === 4 && <DetailsStep build={build} patch={patch} />}
          {isReview && (
            <div className="space-y-4">
              {problems.length > 0 && (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200/90">
                  <p className="font-semibold">Almost there — finish these first:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {problems.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              <CharacterSheet build={build} />
            </div>
          )}
        </div>

        {/* Prev / next / save */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={16} /> Back
          </button>
          {isReview ? (
            <button
              type="button"
              disabled={problems.length > 0 || saving}
              onClick={() => onSave(build)}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={16} /> {saving ? "Saving…" : "Save character"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Live summary */}
      <aside className="lg:sticky lg:top-20 h-fit rounded-2xl border border-white/10 bg-[var(--color-surface)] p-4">
        <h3 className="text-sm font-semibold">{build.name.trim() || "New character"}</h3>
        <p className="mt-0.5 text-xs text-white/50">
          {[race?.name, cls?.name && `${cls.name} ${build.level}`, bg?.name]
            .filter(Boolean)
            .join(" · ") || "Nothing chosen yet"}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-xs">
          <div className="rounded-lg bg-[var(--color-bg)] p-2">
            <div className="font-bold">{derived.ac}</div>
            <div className="text-white/40">AC</div>
          </div>
          <div className="rounded-lg bg-[var(--color-bg)] p-2">
            <div className="font-bold">{derived.maxHp}</div>
            <div className="text-white/40">HP</div>
          </div>
          <div className="rounded-lg bg-[var(--color-bg)] p-2">
            <div className="font-bold">{fmt(derived.initiative)}</div>
            <div className="text-white/40">Init</div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-6 gap-1 text-center text-[10px]">
          {(["str", "dex", "con", "int", "wis", "cha"] as const).map((k) => (
            <div key={k} className="rounded bg-[var(--color-bg)] py-1">
              <div className="font-semibold text-white/80">{derived.abilities[k]}</div>
              <div className="uppercase text-white/35">{k}</div>
            </div>
          ))}
        </div>

        {problems.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-white/40">
            {problems.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs text-emerald-400/80">✓ Ready to save</p>
        )}
      </aside>
    </div>
  );
}
