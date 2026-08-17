import { useState } from "react";
import { Sparkles } from "lucide-react";
import { TOP_LIST } from "../data.js";
import { Badge } from "./ui.jsx";

export default function Planner({ t, openPlace }) {
  const [district, setDistrict] = useState("Shahrisabz + Kitob");
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState(1500000);
  const [style, setStyle] = useState("nature");
  const [route, setRoute] = useState(null);
  const styles = [
    ["nature", "🏔 Tabiat"], ["history", "🏛 Tarix"], ["food", "🍲 Gastronomiya"],
    ["family", "👨‍👩‍👧 Oila"], ["adventure", "🧗 Adventure"], ["couple", "💑 Couple"],
  ];

  function generate() {
    setRoute([
      { day: "1-kun", items: [
        ["08:00", "Qarshidan jo'nash"], ["10:00", "Shahrisabz"], ["10:30", "Amir Temur tarixiy hududi"],
        ["13:00", "TOP milliy restoran"], ["15:30", "Kitob"], ["18:00", "Verified guest house"],
      ]},
      { day: "2-kun", items: [
        ["08:00", "Nonushta"], ["09:00", "Tog' sayohati"], ["12:00", "Miraki"], ["15:00", "Mahalliy hunarmandchilik"], ["18:00", "Qarshiga qaytish"],
      ]},
    ]);
  }

  const recs = TOP_LIST.slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto safe-x py-10">
      <h1 className="font-display flex items-center gap-2 font-bold text-[28px]"><Sparkles size={22} color="#D79B34" /> {t.aiPlanner}</h1>
      <div className="sa-card p-6 mt-6">
        <div className="font-display font-bold mb-3">{t.planQuestion}</div>
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-[#8CA39F]">Hudud</label>
            <input value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
          </div>
          <div>
            <label className="text-xs text-[#8CA39F]">Muddat (kun)</label>
            <input type="number" min={1} max={7} value={days} onChange={(e) => setDays(+e.target.value)} className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
          </div>
          <div>
            <label className="text-xs text-[#8CA39F]">Budget (so'm)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(+e.target.value)} className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
          </div>
          <div>
            <label className="text-xs text-[#8CA39F]">Odamlar soni</label>
            <input type="number" defaultValue={2} className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {styles.map(([k, l]) => (
            <button key={k} className={`sa-chip ${style === k ? "active" : ""}`} onClick={() => setStyle(k)}>{l}</button>
          ))}
        </div>
        <button className="sa-btn-gold mt-5 flex items-center gap-2" onClick={generate}><Sparkles size={15} /> {t.generateRoute}</button>
      </div>

      {route && (
        <div className="sa-animate grid md:grid-cols-2 gap-5 mt-6">
          {route.map((d) => (
            <div key={d.day} className="sa-card p-5">
              <div className="font-display font-bold mb-2.5">{d.day}</div>
              <div className="flex flex-col gap-3">
                {d.items.map(([time, label], i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="font-mono text-xs text-[#8CA39F]" style={{ width: 44 }}>{time}</div>
                    <div className="rounded-full mt-1.5" style={{ width: 8, height: 8, background: "#0E7C7B" }} />
                    <div className="text-[13.5px]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <div className="font-display font-bold text-lg mb-1">Siz uchun tavsiya</div>
        <p className="text-[13px] text-[#5B7370]">"Siz tog'li va sokin joylarni tanladingiz."</p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {recs.map((p) => (
            <button key={p.id} onClick={() => openPlace(p.id)} className="sa-card p-4 text-left">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm">{p.name}</div>
                <Badge tone="trust">{p.trust}</Badge>
              </div>
              <div className="text-xs text-[#5B7370] mt-1.5">Tabiat reytingi yuqori, sharhlar tasdiqlangan va narx budjetga mos.</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
