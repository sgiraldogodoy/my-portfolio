import { profile } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-white/40">
      © {new Date().getFullYear()} {profile.name}. Built with React, Node, MongoDB
      &amp; AWS.
    </footer>
  );
}
