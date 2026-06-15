import Section from "./Section";
import { about } from "../data/content";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-white/75">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  );
}
