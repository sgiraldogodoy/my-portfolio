import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import Section from "./Section";
import { profile } from "../data/content";
import { sendContact } from "../lib/api";
import { useBackendReady } from "../lib/backendStatus";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const ready = useBackendReady();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await sendContact(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <Section id="contact" title="Contact">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-lg text-white/75">
            Have a project in mind, or just want to say hi? Drop me a message and
            I'll get back to you.
          </p>
          <div className="mt-6 space-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-[var(--color-accent-2)] hover:underline"
            >
              <Mail size={18} /> {profile.email}
            </a>
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-2 text-[var(--color-accent-2)] hover:underline"
              >
                <Phone size={18} /> {profile.phone}
              </a>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
          />
          <textarea
            required
            rows={5}
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full resize-none rounded-xl border border-white/10 bg-[var(--color-surface)] px-4 py-3 outline-none focus:border-[var(--color-accent)]"
          />
          <button
            disabled={status === "sending"}
            className="flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Send size={18} />
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          {status === "sending" && !ready && (
            <p className="text-sm text-amber-300/80">
              Waking the server — this can take up to a minute on the first message.
            </p>
          )}
          {status === "sent" && (
            <p className="text-emerald-400">Thanks! I'll be in touch soon.</p>
          )}
          {status === "error" && <p className="text-red-400">{error}</p>}
        </form>
      </div>
    </Section>
  );
}
