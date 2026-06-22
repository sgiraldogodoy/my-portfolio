import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, RotateCcw, Send, X } from "lucide-react";
import { sendChat, type ChatMessage } from "../lib/api";
import { profile } from "../data/content";
import { useBackendReady } from "../lib/backendStatus";

const FIRST = profile.name.split(" ")[0];
const greeting = (): ChatMessage => ({
  role: "assistant",
  content: `Hi! I'm ${FIRST}'s AI assistant. Ask me anything about their experience, skills, or projects.`,
});

export default function ChatWidget() {
  const ready = useBackendReady();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greeting()]);

  // Proactive nudge bubble: only when the assistant is working (backend ready)
  // and the visitor hasn't opened or dismissed it yet.
  const [nudge, setNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !open && !nudgeDismissed) {
      const t = setTimeout(() => setNudge(true), 1500);
      return () => clearTimeout(t);
    }
    setNudge(false);
  }, [ready, open, nudgeDismissed]);

  function openChat() {
    setOpen(true);
    setNudge(false);
    setNudgeDismissed(true);
  }

  function resetChat() {
    setMessages([greeting()]);
    setInput("");
    setBusy(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      // Skip the canned greeting; send only the real conversation turns.
      const { reply } = await sendChat(next.slice(1));
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the server. Please try again later.",
        },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() =>
        endRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  }

  const hasConversation = messages.length > 1;

  return (
    <>
      {/* Proactive nudge */}
      <AnimatePresence>
        {nudge && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 max-w-[15rem] rounded-2xl rounded-br-sm border border-white/10 bg-[var(--color-surface)] p-3 pr-8 text-sm text-white/85 shadow-xl"
          >
            <button
              onClick={openChat}
              className="block text-left"
              aria-label="Open the AI assistant"
            >
              👋 Curious about {FIRST}? Ask me anything!
            </button>
            <button
              onClick={() => {
                setNudge(false);
                setNudgeDismissed(true);
              }}
              aria-label="Dismiss"
              className="absolute right-2 top-2 text-white/40 transition hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => (open ? setOpen(false) : openChat())}
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
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
              <span className="flex items-center gap-2 font-semibold">
                <Bot size={18} className="text-[var(--color-accent)]" />
                Ask about {FIRST}
              </span>
              {hasConversation && (
                <button
                  onClick={resetChat}
                  aria-label="Start a new conversation"
                  title="New conversation"
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw size={13} /> New
                </button>
              )}
            </div>

            {!ready && (
              <div className="border-b border-white/10 bg-amber-400/10 px-4 py-2 text-xs text-amber-300">
                Warming up the assistant… the first reply may take a moment.
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
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
