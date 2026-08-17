import { useState } from "react";
import { TOP_LIST, CATEGORIES } from "../data.js";
import { TrustGauge, trustColor } from "./ui.jsx";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function TopRanking({ t, lang, openPlace }) {
  const [period, setPeriod] = useState("overall");
  const [cat, setCat] = useState("all");
  const list = TOP_LIST.filter((p) => cat === "all" || p.category === cat);

  return (
    <main className="max-w-5xl mx-auto safe-x py-10">
      <h1 className="font-display font-bold text-[28px]">🏆 {t.topPlaces}</h1>
      <p className="text-[#5B7370] text-sm mt-1.5 max-w-[640px]">
        Businesses cannot buy their organic TOP position — ranking depends only on Trust Score, verified reviews, service quality, freshness, complaint resolution and photo reality.
      </p>
      <div className="flex flex-wrap gap-2 mt-6">
        {[["today", t.today], ["week", t.week], ["month", t.month], ["overall", t.overall]].map(([k, l]) => (
          <button key={k} className={`sa-chip ${period === k ? "active" : ""}`} onClick={() => setPeriod(k)}>{l}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {[["all", t.filters]].concat(CATEGORIES.map((c) => [c.key, c[lang]])).map(([k, l]) => (
          <button key={k} className="sa-chip" style={{ background: cat === k ? "#E4F4F1" : "#fff", color: cat === k ? "#0E7C7B" : "#0B2B2B", borderColor: cat === k ? "#0E7C7B" : "#E4EAE8" }} onClick={() => setCat(k)}>{l}</button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {list.map((p, i) => (
          <button key={p.id} onClick={() => openPlace(p.id)} className="sa-card p-4 flex items-center gap-4 text-left">
            <div className="w-9 text-center font-bold text-[#8CA39F]" style={{ fontSize: i < 3 ? 22 : 15 }}>{MEDALS[i] || i + 1}</div>
            <TrustGauge score={p.trust} size={48} strokeWidth={6} showLabel={false} />
            <div className="flex-1">
              <div className="font-bold">{p.name}</div>
              <div className="text-[12.5px] text-[#5B7370]">{p.district} · {p.catLabel[lang]}</div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-lg" style={{ color: trustColor(p.trust) }}>{p.trust}</div>
              <div className="text-[11px] text-[#8CA39F]">/100</div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
