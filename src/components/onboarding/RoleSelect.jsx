import { Building2, Compass, MapPin } from "lucide-react";
import OnboardingShell from "./OnboardingShell.jsx";
import { backgroundFor } from "./backgrounds.js";

export default function RoleSelect({ onSelect }) {
  return (
    <OnboardingShell image={backgroundFor(0)} maxWidth={640}>
      <div className="w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center rounded-[10px]" style={{ width: 34, height: 34, background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }}>
            <Compass size={18} color="#fff" />
          </div>
          <span className="font-display font-bold text-xl text-white">SafarAI</span>
        </div>

        <h1 className="font-display font-bold text-white" style={{ fontSize: "clamp(24px,4vw,32px)" }}>Xush kelibsiz! Siz kimsiz?</h1>
        <p className="mt-2" style={{ color: "#9FB8B4" }}>Sizga to'g'ri tajribani ko'rsatishimiz uchun avval shuni bilishimiz kerak.</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => onSelect("tourist")}
            className="text-left rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <MapPin size={26} color="#9FE3D8" />
            <div className="font-display font-bold text-white text-lg mt-3">Turist / Sayohatchi</div>
            <div className="text-sm mt-1.5" style={{ color: "#9FB8B4" }}>Qashqadaryoda ishonchli joylarni topmoqchiman.</div>
          </button>

          <button
            onClick={() => onSelect("business")}
            className="text-left rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <Building2 size={26} color="#D6A61A" />
            <div className="font-display font-bold text-white text-lg mt-3">Biznesmen</div>
            <div className="text-sm mt-1.5" style={{ color: "#9FB8B4" }}>Mehmonxona, restoran yoki turistik xizmatim bor.</div>
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
