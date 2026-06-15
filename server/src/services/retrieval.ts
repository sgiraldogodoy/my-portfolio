import { knowledge } from "../data/knowledge.js";

const STOP = new Set([
  "the", "a", "an", "and", "or", "is", "are", "was", "were", "to", "of", "in",
  "on", "for", "with", "do", "does", "did", "you", "your", "i", "me", "my",
  "what", "who", "how", "tell", "about", "can", "could", "would", "he", "she",
  "they", "it", "this", "that", "have", "has",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/**
 * Lightweight lexical retrieval (a simple RAG step): score each knowledge chunk
 * by keyword overlap with the query and return the top matches. This needs no
 * external embedding service to get started. To upgrade to semantic search,
 * swap this scoring for vector embeddings (e.g. Voyage AI) + cosine similarity.
 */
export function retrieve(query: string, k = 5): string[] {
  const q = new Set(tokenize(query));
  if (q.size === 0) return knowledge.slice(0, k);

  const scored = knowledge.map((chunk) => {
    const tokens = tokenize(chunk);
    let score = 0;
    for (const t of tokens) if (q.has(t)) score++;
    return { chunk, score };
  });

  const hits = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.chunk);

  // If nothing matched, fall back to a general slice so the model still has context.
  return hits.length ? hits : knowledge.slice(0, k);
}
