import { Bot, ArrowRight, Star } from "lucide-react";
import { PLACES } from "../../data.js";
import { Badge, TrustGauge, trustTone } from "../ui.jsx";
import { backgroundFor } from "./backgrounds.js";

export default function Recommendations({ reply, placeIds, onOpenPlace, onSkip }) {
  const places = placeIds.map((id) => PLACES.find((p) => p.id === id)).filter(Boolean);
  const heroImage = places[0]?.image || backgroundFor(0);

  return (
    <div className="min-h-[100dvh]" style={{ background: "#F5F7F5" }}>
      <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,43,43,0.85) 0%, rgba(11,61,92,0.82) 100%)" }} />
        <div className="relative safe-x py-12 mx-auto" style={{ maxWidth: 720 }}>
          <div className="font-display flex items-center gap-2 font-bold text-white"><Bot size={18} color="#9FE3D8" /> SafarAI tavsiyasi</div>
          <p className="mt-2 text-[15px]" style={{ color: "#D7E6E3" }}>{reply || "Sizga mos joylarni tanladik."}</p>
        </div>
      </div>

      <div className="safe-x py-8 mx-auto" style={{ maxWidth: 720 }}>
        <div className="grid sm:grid-cols-2 gap-4">
          {places.map((p) => (
            <button key={p.id} onClick={() => onOpenPlace(p.id)} className="sa-card text-left overflow-hidden">
              {p.image && <img src={p.image} alt={p.name} className="w-full object-cover" style={{ height: 120 }} />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm">{p.name}</div>
                  <TrustGauge score={p.trust} size={36} strokeWidth={5} showLabel={false} />
                </div>
                <div className="text-xs text-[#5B7370] mt-1">{p.district} · {p.catLabel.uz}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs font-mono font-bold"><Star size={12} fill="#D6A61A" color="#D6A61A" /> {p.rating}</span>
                  <Badge tone={trustTone(p.trust)}>{p.trust}/100</Badge>
                </div>
              </div>
            </button>
          ))}
          {places.length === 0 && (
            <div className="sa-card p-5 text-sm text-[#5B7370] sm:col-span-2">Hozircha aniq mos joy topilmadi — bosh sahifadan xarita orqali qidirib ko'ring.</div>
          )}
        </div>

        <button className="sa-btn-secondary mt-6 flex items-center gap-2 mx-auto" onClick={onSkip}>
          Bosh sahifaga o'tish <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
