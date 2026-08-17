import { Compass } from "lucide-react";

export default function Footer({ t }) {
  return (
    <footer className="max-w-7xl mx-auto safe-x py-10 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid #E4EAE8" }}>
      <div className="flex items-center gap-2">
        <Compass size={16} color="#0E7C7B" /> <span className="font-display font-bold">SafarAI</span>
        <span className="text-[13px]" style={{ color: "#8CA39F" }}>· Umummilliy AI Xakaton 2026, Qashqadaryo</span>
      </div>
      <div className="text-[13px]" style={{ color: "#8CA39F" }}>{t.tagline}</div>
    </footer>
  );
}
