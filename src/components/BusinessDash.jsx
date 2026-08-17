import { ArrowRight, ArrowUpRight, Bot, CheckCircle2, Eye, TrendingUp, Trophy, Users } from "lucide-react";
import { PLACES } from "../data.js";
import { MiniBar, TrustGauge } from "./ui.jsx";

export default function BusinessDash({ t }) {
  const place = PLACES.find((p) => p.id === "miraki");
  const tasks = [
    "Tozalik ko'rsatkichini yaxshilang", "6 ta ochiq shikoyatga javob bering", "360° tasvirni yangilang",
    "Xizmat ma'lumotlarini yangilang", "Tasdiqlangan mijoz fikrlarini ko'paytiring",
  ];

  return (
    <main className="max-w-6xl mx-auto safe-x py-10">
      <h1 className="font-display font-bold text-[28px]">{t.businessDash}</h1>
      <div className="font-display font-semibold text-lg text-[#5B7370] mt-1">{place.name}</div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          ["Trust Score", "76 → 81", ArrowUpRight, "#2E9E5B"],
          ["Pozitsiya", "#12 → #9", TrendingUp, "#0E7C7B"],
          ["Ko'rishlar", "12 480", Eye, "#0B3D5C"],
          ["Bookings/leads", "438", Users, "#D79B34"],
        ].map(([label, val, Icon, color]) => (
          <div key={label} className="sa-card p-5">
            <Icon size={18} color={color} />
            <div className="font-mono font-bold text-[22px] mt-2">{val}</div>
            <div className="text-[12.5px] text-[#8CA39F]">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="sa-card p-6 lg:col-span-1 text-center">
          <TrustGauge score={81} size={130} strokeWidth={13} />
          <div className="text-[13px] text-[#5B7370] mt-2">{t.trustScore}</div>
        </div>

        <div className="sa-card p-6 lg:col-span-2">
          <div className="font-display flex items-center gap-2 font-bold"><Trophy size={17} color="#D79B34" /> ⭐ TOPga harakat</div>
          <div className="flex items-center gap-6 mt-3 flex-wrap">
            <div><div className="text-[11px] text-[#8CA39F]">Joriy pozitsiya</div><div className="font-mono font-bold text-xl">#12</div></div>
            <ArrowRight size={16} color="#D8E2DF" />
            <div><div className="text-[11px] text-[#8CA39F]">Maqsad</div><div className="font-mono font-bold text-xl" style={{ color: "#0E7C7B" }}>TOP 10</div></div>
          </div>
          <ul className="mt-3.5 flex flex-col gap-2">
            {tasks.map((tk) => (
              <li key={tk} className="flex items-center gap-2 text-[13.5px]">
                <CheckCircle2 size={14} color="#0E7C7B" /> {tk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="sa-card p-6">
          <div className="font-display font-bold mb-2.5">🔴 Eng ko'p shikoyatlar</div>
          {place.complaints.map((c) => <MiniBar key={c.l} label={c.l} value={100 - c.v} />)}
        </div>
        <div className="sa-card p-6">
          <div className="font-display font-bold mb-2.5">🟢 Eng katta yutuqlar</div>
          {place.achievements.map((a) => <MiniBar key={a.l} label={a.l} value={a.v} />)}
        </div>
      </div>

      <div className="sa-card p-6 mt-6">
        <div className="font-display flex items-center gap-2 font-bold"><Bot size={17} color="#0E7C7B" /> AI biznes maslahatchi</div>
        <ul className="mt-2.5 flex flex-col gap-2 text-[13.5px] text-[#3A504D]">
          <li>"Oxirgi 30 kun ichida tozalik bilan bog'liq shikoyatlar 14% oshgan."</li>
          <li>"Wi-Fi bo'yicha 18 ta salbiy sharh mavjud."</li>
          <li>"360° tasviringiz 8 oy oldin yuklangan."</li>
          <li>"Ushbu muammolar bartaraf etilsa, TOP-10 ga kirish imkoniyati oshadi."</li>
        </ul>
      </div>
    </main>
  );
}
