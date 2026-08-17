import { useEffect, useState } from "react";
import { Search, Sparkles, Play, ArrowRight, Star, MapPin, Trophy } from "lucide-react";
import { PLACES, TOP_LIST, CATEGORIES, DISTRICTS } from "../data.js";
import { Badge, TrustGauge, AnimatedNumber, trustColor, trustTone } from "./ui.jsx";

const CATEGORY_IMAGES = {
  history: "/images/aksaray-shahrisabz.jpg",
  mountain: "/images/kitob-mountains.jpg",
  food: "/images/qashqadaryo-osh.jpg",
  water: "/images/hisorak-lake.jpg",
  home: "/images/kol-village.jpg",
  hotel: "/images/qashqadaryo-hotel.jpg",
  gift: "/images/shahrisabz-suzani.jpg",
};

export default function Home({ t, lang, go, openPlace, statsAnimated, setDemoOpen }) {
  const featured = PLACES.filter((p) => p.featured);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx((i) => (i + 1) % featured.length), 4600);
    return () => clearInterval(iv);
  }, [featured.length]);
  const [query, setQuery] = useState("");
  const current = featured[idx];

  return (
    <main>
      {/* ---------- Hero: full-bleed real photo, malaysia.travel-style overlay ---------- */}
      <section className="relative overflow-hidden text-white" style={{ minHeight: "min(640px, 100vh)" }}>
        <img
          src="/images/aksaray-shahrisabz.jpg"
          alt="Amir Temur tarixiy majmuasi, Shahrisabz"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,43,43,0.88) 0%, rgba(11,43,43,0.72) 45%, rgba(11,61,92,0.9) 100%)" }} />

        <div className="max-w-7xl mx-auto safe-x pt-14 pb-20 relative">
          <div className="sa-animate" style={{ maxWidth: 720 }}>
            <Badge tone="trust"><Sparkles size={13} /> AI Powered Tourism Trust Platform</Badge>
            <h1 className="font-display font-bold my-4" style={{ fontSize: "clamp(30px,5vw,52px)", lineHeight: 1.08 }}>{t.heroTitle}</h1>
            <p className="text-[17px] leading-relaxed max-w-[600px]" style={{ color: "#D7E6E3" }}>{t.heroDesc}</p>

            <div className="mt-8 flex flex-col md:flex-row gap-3 rounded-2xl p-2" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="flex items-center flex-1 gap-2 px-3">
                <Search size={18} color="#9FE3D8" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.searchPh}
                  className="bg-transparent border-none outline-none text-white w-full py-3 text-[15px] placeholder:text-[#B8CFCB]" />
              </div>
              <button className="sa-btn-primary" onClick={() => go("map")}>{t.findBtn}</button>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <button className="sa-btn-gold" onClick={() => go("planner")}><span className="flex items-center gap-1.5"><Sparkles size={15} />{t.aiPlanBtn}</span></button>
              <button className="sa-btn-secondary bg-transparent text-white" style={{ borderColor: "rgba(255,255,255,0.35)" }} onClick={() => setDemoOpen(true)}>
                <span className="flex items-center gap-1.5"><Play size={14} />{t.demo}</span>
              </button>
            </div>
          </div>

          {/* Signature stat: 4.8 vs Trust Score */}
          <div className="sa-animate mt-12 rounded-[20px] p-5 md:p-6" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", maxWidth: 520 }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[13px]" style={{ color: "#9FB8B4" }}>{t.heroQuestion}</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-mono font-bold text-[30px] flex items-center gap-1.5">4.8 <Star size={22} fill="#D6A61A" color="#D6A61A" /></span>
                  <ArrowRight size={16} color="#9FB8B4" />
                  <span className="font-mono font-bold text-[30px]" style={{ color: "#D6A61A" }}>63/100</span>
                </div>
              </div>
              <button className="sa-btn-secondary bg-white" onClick={() => openPlace("miraki")}>{t.detailsBtn}</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
            {[[1284, t.statLabels[0]], [18540, t.statLabels[1]], [3240, t.statLabels[2]], ["89%", t.statLabels[3]], [8420, t.statLabels[4]]].map(([val, label], i) => (
              <div key={i} className="sa-animate" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="font-mono font-bold text-[26px]" style={{ color: "#9FE3D8" }}>
                  {typeof val === "number" ? <AnimatedNumber value={val} animate={statsAnimated} /> : val}
                </div>
                <div className="text-[12.5px] mt-0.5" style={{ color: "#9FB8B4" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Discover carousel ---------- */}
      <section className="max-w-7xl mx-auto safe-x py-12">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "#0E7C7B" }}>{t.discoverEyebrow}</div>
            <h2 className="font-display font-bold text-[26px] mt-1">{t.categories}</h2>
          </div>
        </div>

        <div className="mt-6 relative sa-card overflow-hidden" style={{ minHeight: 300 }}>
          {current.image ? (
            <img src={current.image} alt={current.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(11,43,43,0.82) 0%, rgba(11,43,43,0.45) 55%, rgba(11,43,43,0.15) 100%)" }} />

          <div className="relative p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center text-white">
            <div>
              <Badge tone="gold">{CATEGORIES.find((c) => c.key === current.category)?.[lang] || current.catLabel[lang]}</Badge>
              <h3 className="font-display font-bold text-[28px] md:text-[32px] mt-3">{current.name}</h3>
              <div className="mt-1" style={{ color: "#C7D9D6" }}>{current.catLabel[lang]} · {current.district}</div>
              <div className="flex items-center gap-4 mt-5">
                <span className="flex items-center gap-1 font-mono font-bold"><Star size={16} fill="#D6A61A" color="#D6A61A" /> {current.rating}</span>
                <Badge tone={trustTone(current.trust)}>SafarAI: {current.trust}/100</Badge>
              </div>
              <button className="sa-btn-primary mt-6" onClick={() => openPlace(current.id)}>{t.detailsBtn}</button>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <TrustGauge score={current.trust} size={140} strokeWidth={13} />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1.5 pb-4 relative">
            {featured.map((_, i) => (
              <button key={i} aria-label={`slide ${i + 1}`} onClick={() => setIdx(i)}
                className="border-none transition-all"
                style={{ width: i === idx ? 22 : 7, height: 7, borderRadius: 99, background: i === idx ? "#0E7C7B" : "#D8E2DF" }} />
            ))}
          </div>
        </div>

        {/* Category tag cards — each backed by a real regional photo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {CATEGORIES.map((c) => {
            const img = CATEGORY_IMAGES[c.key];
            return (
              <button key={c.key} onClick={() => go("map")} className="relative overflow-hidden rounded-2xl text-left" style={{ height: 130 }}>
                {img ? (
                  <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }} />
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,43,43,0.05) 40%, rgba(11,43,43,0.82) 100%)" }} />
                <div className="absolute inset-0 p-3 flex flex-col justify-between text-white">
                  <c.icon size={18} />
                  <span className="text-[13px] font-semibold leading-tight">{c[lang]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- TOP-3 preview (full ranking lives one tap away, not in the nav) ---------- */}
      <section className="max-w-7xl mx-auto safe-x py-8">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <h2 className="font-display flex items-center gap-2 font-bold text-[26px]"><Trophy size={22} color="#D79B34" /> {t.topPlaces}</h2>
          <button onClick={() => go("top")} className="text-sm font-semibold flex items-center gap-1" style={{ color: "#0E7C7B" }}>
            {t.detailsBtn} <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          {TOP_LIST.slice(0, 3).map((p, i) => (
            <button key={p.id} onClick={() => openPlace(p.id)} className="sa-card p-4 text-left flex items-center gap-3">
              <span className="font-mono font-bold text-[#8CA39F]" style={{ width: 22 }}>{i + 1}</span>
              <TrustGauge score={p.trust} size={44} strokeWidth={5} showLabel={false} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="text-xs text-[#5B7370]">{p.district}</div>
              </div>
              <Badge tone="trust">{p.trust}</Badge>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Districts ---------- */}
      <section className="max-w-7xl mx-auto safe-x py-8">
        <h2 className="font-display font-bold text-[26px]">{t.whichRegion}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          {DISTRICTS.map((d) => (
            <button key={d} onClick={() => go("map")} className="sa-card text-left p-4">
              <MapPin size={16} color="#0E7C7B" />
              <div className="font-semibold mt-2">{d}</div>
            </button>
          ))}
        </div>
      </section>

      <FinalCTA t={t} setDemoOpen={setDemoOpen} />
    </main>
  );
}

function FinalCTA({ t, setDemoOpen }) {
  return (
    <section className="text-white py-20 mt-10" style={{ background: "#0B2B2B" }}>
      <div className="max-w-4xl mx-auto safe-x text-center">
        <h2 className="font-display font-bold" style={{ fontSize: "clamp(26px,4vw,40px)", lineHeight: 1.2 }}>
          {t.finalHeadline1}<br />{t.finalHeadline2}
        </h2>
        <div className="font-display font-bold text-[26px] mt-6" style={{ color: "#9FE3D8" }}>SafarAI</div>
        <div className="mt-1" style={{ color: "#9FB8B4" }}>{t.tagline}</div>
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button className="sa-btn-primary" onClick={() => setDemoOpen(true)}>{t.tryIt}</button>
          <button className="sa-btn-secondary bg-transparent text-white" style={{ borderColor: "rgba(255,255,255,0.3)" }} onClick={() => setDemoOpen(true)}>{t.startDemo}</button>
        </div>
      </div>
    </section>
  );
}
