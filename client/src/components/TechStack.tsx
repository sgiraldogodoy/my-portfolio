import Section from "./Section";
import GalaxyStack from "./techstack/GalaxyStack";

export default function TechStack() {
  return (
    <Section id="techstack" title="Tech Stack">
      <p className="mx-auto mb-10 max-w-2xl text-center text-white/60">
        The technologies I work with, grouped into orbits. Tap a category to zoom in
        and see the skills that circle it.
      </p>
      <GalaxyStack />
    </Section>
  );
}
