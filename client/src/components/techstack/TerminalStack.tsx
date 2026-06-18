import { useEffect, useRef, useState } from "react";
import { techStack } from "../../data/techStack";
import { profile } from "../../data/content";

type Line = { kind: "cmd" | "out"; text: string };

const commands = [
  "whoami",
  "stack --all",
  "stack --frontend",
  "stack --backend",
  "stack --ai",
  "stack --languages",
  "stack --tools",
  "help",
  "clear",
];

function run(input: string): Line[] | "clear" {
  const cmd = input.trim().toLowerCase();
  if (!cmd) return [];
  if (cmd === "clear") return "clear";
  if (cmd === "whoami")
    return [{ kind: "out", text: `${profile.name}, ${profile.role}` }];
  if (cmd === "help")
    return [{ kind: "out", text: `available commands: ${commands.join(", ")}` }];

  if (cmd.startsWith("stack")) {
    const flag = cmd.split(/\s+/)[1]?.replace(/^--/, "");
    const cats =
      !flag || flag === "all"
        ? techStack
        : techStack.filter((c) => c.key === flag);
    if (cats.length === 0)
      return [{ kind: "out", text: `unknown category "${flag}". try: help` }];
    return cats.map((c) => ({
      kind: "out",
      text: `${c.label.padEnd(16)} ${c.items.join("  ")}`,
    }));
  }
  return [{ kind: "out", text: `command not found: ${cmd} (try: help)` }];
}

export default function TerminalStack() {
  const [history, setHistory] = useState<Line[]>([
    { kind: "out", text: "Welcome. Type a command or tap one below. Try: stack --all" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  function exec(text: string) {
    const result = run(text);
    if (result === "clear") {
      setHistory([]);
      return;
    }
    setHistory((h) => [...h, { kind: "cmd", text }, ...result]);
  }

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-black/60 font-mono text-sm shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-red-400/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-xs text-white/40">santiago@portfolio: ~</span>
      </div>

      <div className="h-72 space-y-1 overflow-y-auto p-4">
        {history.map((l, i) => (
          <div key={i} className={l.kind === "cmd" ? "text-[var(--color-accent-2)]" : "text-white/80"}>
            {l.kind === "cmd" ? <span className="text-[var(--color-accent)]">$ </span> : null}
            <span className="whitespace-pre-wrap">{l.text}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/10 p-3">
        {commands.map((c) => (
          <button
            key={c}
            onClick={() => exec(c)}
            className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/70 transition hover:bg-[var(--color-accent)]/20 hover:text-white"
          >
            {c}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          exec(input);
          setInput("");
        }}
        className="flex items-center gap-2 border-t border-white/10 px-4 py-3"
      >
        <span className="text-[var(--color-accent)]">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type a command..."
          className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
