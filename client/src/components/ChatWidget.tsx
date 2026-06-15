import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { sendChat, type ChatMessage } from "../lib/api";
import { profile } from "../data/content";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${profile.name.split(" ")[0]}'s AI assistant. Ask me anything about their experience, skills, or projects.`,
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      // Only send the real conversation turns (skip the canned greeting).
      const { reply } = await sendChat(next.slice(1));
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry — I couldn't reach the server. Please try again later.",
        },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() =>
        endRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30 transition hover:scale-105"
      >
        {open ? <X /> : <Bot />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-surface)] shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <Bot size={18} className="text-[var(--color-accent)]" />
              <span className="font-semibold">Ask about {profile.name.split(" ")[0]}</span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "user" ? "text-right" : "text-left"}
                >
                  <span
                    className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 ${
                      m.role === "user"
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-white/5 text-white/85"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              {busy && <div className="text-white/40">Thinking…</div>}
              <div ref={endRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a question…"
                className="flex-1 rounded-full border border-white/10 bg-[var(--color-bg)] px-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
              />
              <button
                onClick={send}
                disabled={busy}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-white disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
