import { useRef, useState } from "react";
import {
  MapPin, Star, ArrowRight, CheckCircle2, AlertTriangle, Gauge, Bot, Camera,
  ShieldCheck, QrCode, LocateFixed, Loader2, ScanLine, BadgeCheck, Eye, Upload,
  ThumbsUp, ThumbsDown,
} from "lucide-react";
import { TOP_LIST, REVIEWS, SAMPLE_REVIEWS_TO_TEST } from "../data.js";
import { Badge, MiniBar, TrustGauge, trustColor, trustTone } from "./ui.jsx";
import { analyzePhotos, analyzeReview } from "../api.js";

const VOTE_STORAGE_KEY = "safarai_review_votes";

function loadReviewVotes() {
  try { return JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveReviewVotes(votes) {
  try { localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes)); } catch { /* storage unavailable */ }
}

export default function DetailView({ t, lang, place, openPlace }) {
  const [tab, setTab] = useState("trust");
  const alternatives = TOP_LIST.filter((p) => p.id !== place.id && p.trust > place.trust).slice(0, 2);
  const tabs = [
    ["trust", t.trustScore, Gauge],
    ["reviews", t.aiDetector, Bot],
    ["photo", t.photoCheck, Camera],
    ["verify", t.geoReview, ShieldCheck],
    ["qr", "QR", QrCode],
  ];

  return (
    <main className="max-w-7xl mx-auto safe-x py-10">
      {place.image && (
        <div className="sa-card overflow-hidden mb-6" style={{ height: 220 }}>
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Badge tone="deep">{place.catLabel[lang]}</Badge>
          <h1 className="font-display font-bold text-[32px] mt-2.5">{place.name}</h1>
          <div className="flex items-center gap-1.5 mt-1 text-[#5B7370]"><MapPin size={14} /> Qashqadaryo, {place.district}</div>

          <div className="flex items-center gap-6 mt-5">
            <div>
              <div className="text-xs text-[#8CA39F]">{t.internetRating}</div>
              <div className="flex items-center gap-1 font-mono font-bold text-[22px]"><Star size={18} fill="#D6A61A" color="#D6A61A" />{place.rating} / 5</div>
            </div>
            <ArrowRight size={20} color="#D8E2DF" />
            <div>
              <div className="text-xs text-[#8CA39F]">{t.trustScore}</div>
              <div className="font-mono font-bold text-[22px]" style={{ color: trustColor(place.trust) }}>{place.trust} / 100</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl px-3.5 py-2.5" style={{ background: trustColor(place.trust) + "18" }}>
            {place.trust >= 80 ? <CheckCircle2 size={18} color={trustColor(place.trust)} /> : <AlertTriangle size={18} color={trustColor(place.trust)} />}
            <span className="text-[13.5px] font-medium">{t.good}</span>
          </div>

          <div className="flex gap-2 overflow-x-auto sa-scroll mt-8 mb-4">
            {tabs.map(([k, label, Icon]) => (
              <button key={k} className={`sa-chip flex items-center gap-1.5 ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {tab === "trust" && <TrustTab t={t} place={place} />}
          {tab === "reviews" && <ReviewsTab t={t} place={place} />}
          {tab === "photo" && <PhotoTab t={t} />}
          {tab === "verify" && <GeoReviewFlow t={t} />}
          {tab === "qr" && <QrFlow t={t} place={place} />}

          <Panorama t={t} />
        </div>

        <aside className="flex flex-col gap-6">
          <div className="sa-card p-6 text-center">
            <div className="flex justify-center"><TrustGauge score={place.trust} size={150} strokeWidth={14} /></div>
            <div className="text-[13px] text-[#5B7370] mt-2">{t.trustScore}</div>
            <div className="grid grid-cols-2 gap-3 mt-5 text-left">
              <div><div className="font-mono font-bold">{place.verifiedVisits}</div><div className="text-[11px] text-[#8CA39F]">{t.verifiedVisits}</div></div>
              <div><div className="font-mono font-bold">{place.realPhotos}</div><div className="text-[11px] text-[#8CA39F]">{t.realPhotos}</div></div>
              <div><div className="font-mono font-bold">{place.reviews}</div><div className="text-[11px] text-[#8CA39F]">{t.reviews}</div></div>
              <div><div className="font-mono font-bold" style={{ color: "#C4472A" }}>{place.suspicious}</div><div className="text-[11px] text-[#8CA39F]">{t.suspiciousDetected}</div></div>
            </div>
          </div>

          {alternatives.length > 0 && (
            <div className="sa-card p-6">
              <div className="font-display font-bold mb-2.5">{t.alternatives}</div>
              {alternatives.map((a) => (
                <button key={a.id} onClick={() => openPlace(a.id)} className="flex items-center gap-3 mb-3 w-full bg-none border-none text-left">
                  <TrustGauge score={a.trust} size={40} strokeWidth={5} showLabel={false} />
                  <div className="flex-1">
                    <div className="font-semibold text-[13px]">{a.name}</div>
                    <div className="flex items-center gap-1 text-xs text-[#5B7370]"><Star size={11} fill="#D6A61A" color="#D6A61A" />{a.rating}</div>
                  </div>
                  <Badge tone="trust">{a.trust}</Badge>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

function TrustTab({ t, place }) {
  const b = place.breakdown;
  const weights = [
    { key: "reviewAuth", label: t.reviewAuth, w: 30 },
    { key: "photoMatch", label: t.photoMatch, w: 25 },
    { key: "freshness", label: t.freshness, w: 15 },
    { key: "verifiedVisits", label: t.verifiedVisits, w: 15 },
    { key: "complaints", label: t.complaintsScore, w: 15 },
  ];
  return (
    <div className="sa-card p-6">
      <div className="font-display font-bold mb-3.5">{t.breakdown}</div>
      {weights.map((w) => <MiniBar key={w.key} label={w.label} value={b[w.key]} />)}

      <div className="border-t border-[#E4EAE8] mt-4 pt-4">
        <div className="font-display font-bold mb-2.5 text-[15px]">{t.howCalc}</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {weights.map((w) => (
            <div key={w.key} className="p-3 text-center rounded-xl" style={{ background: "#F5F7F5" }}>
              <div className="font-mono font-bold text-lg" style={{ color: "#0E7C7B" }}>{w.w}%</div>
              <div className="text-[11px] text-[#5B7370] mt-0.5">{w.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ t, place }) {
  const list = REVIEWS[place.id] || [];
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [votes, setVotes] = useState(loadReviewVotes);

  function toggleVote(reviewKey, type) {
    setVotes((prev) => {
      const next = { ...prev };
      if (next[reviewKey] === type) delete next[reviewKey];
      else next[reviewKey] = type;
      saveReviewVotes(next);
      return next;
    });
  }

  async function analyze(sample) {
    const val = sample ?? text;
    if (!val.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const data = await analyzeReview(val);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="sa-card p-6">
        <div className="font-display flex items-center gap-2 font-bold"><Bot size={18} color="#0E7C7B" /> {t.aiDetector}</div>
        <textarea value={text} onChange={(e) => { setText(e.target.value); setResult(null); }} placeholder={t.reviewTextPh}
          className="w-full mt-3 border border-[#E4EAE8] rounded-xl p-3 text-sm resize-y" style={{ minHeight: 90, fontFamily: "inherit" }} />
        <div className="flex flex-wrap gap-2 mt-3">
          {SAMPLE_REVIEWS_TO_TEST.map((s, i) => (
            <button key={i} className="sa-chip font-medium text-xs" onClick={() => { setText(s); analyze(s); }}>
              {s.length > 38 ? s.slice(0, 38) + "…" : s}
            </button>
          ))}
        </div>
        <button className="sa-btn-primary mt-3" onClick={() => analyze()} disabled={loading || !text.trim()}>{t.checkWithAi}</button>

        {loading && (
          <div className="flex items-center gap-2 mt-4 text-sm text-[#5B7370]">
            <Loader2 size={16} className="sa-spin" /> {t.aiProcessing}
          </div>
        )}
        {error && !loading && (
          <div className="sa-animate mt-4 p-4 rounded-xl text-[13.5px]" style={{ background: "#FBEAE5", color: "#C4472A" }}>{error}</div>
        )}
        {result && !loading && !error && (
          <div className="sa-animate mt-4 p-4 rounded-xl" style={{ background: result.suspicious ? "#FBEAE5" : "#E4F4F1" }}>
            <div className="flex items-center gap-2 font-bold" style={{ color: result.suspicious ? "#C4472A" : "#0E7C7B" }}>
              {result.suspicious ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              {result.suspicious ? t.suspiciousReview : t.reliableReview}
            </div>
            <div className="font-mono font-bold text-[22px] mt-1">{result.score}% {result.suspicious ? "soxta/manipulyativ ehtimoli" : "haqiqiy"}</div>
            {result.reasons.length > 0 && (
              <ul className="mt-2 pl-4 text-[13px] text-[#5B7370]">
                {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {list.map((r, i) => {
          const reviewKey = `${place.id}:${i}`;
          const vote = votes[reviewKey];
          const likeCount = (r.likes || 0) + (vote === "like" ? 1 : 0);
          const dislikeCount = (r.dislikes || 0) + (vote === "dislike" ? 1 : 0);
          return (
            <div key={i} className="sa-card p-5">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <div className="font-bold">{r.name}</div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={13} fill={s < r.rating ? "#D6A61A" : "none"} color="#D6A61A" />)}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {r.verified && <Badge tone="trust"><CheckCircle2 size={11} /> Verified Visitor</Badge>}
                  {r.geo && <Badge tone="deep"><MapPin size={11} /> Geo Verified</Badge>}
                  {r.photos > 0 && <Badge tone="gold"><Camera size={11} /> {r.photos}</Badge>}
                </div>
              </div>
              <p className="mt-2.5 text-sm text-[#3A504D]">{r.text}</p>
              <div className="mt-3 flex items-center gap-2">
                {r.suspicious ? <AlertTriangle size={14} color="#C4472A" /> : <Bot size={14} color="#0E7C7B" />}
                <span className="text-[12.5px] font-semibold" style={{ color: r.suspicious ? "#C4472A" : "#0E7C7B" }}>
                  AI: {r.aiScore}% {r.suspicious ? "shubhali" : "ishonchli sharh"}
                </span>
              </div>
              {r.reasons && (
                <ul className="mt-1.5 pl-4 text-[12.5px] text-[#8CA39F]">
                  {r.reasons.map((x, k) => <li key={k}>{x}</li>)}
                </ul>
              )}

              <div className="mt-3.5 pt-3 border-t border-[#E4EAE8] flex items-center gap-2">
                <span className="text-[12px] text-[#8CA39F] mr-1">Bu sharh sizga foydali bo'ldimi?</span>
                <button
                  onClick={() => toggleVote(reviewKey, "like")}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors"
                  style={vote === "like"
                    ? { background: "#E4F4F1", color: "#0E7C7B" }
                    : { background: "#F5F7F5", color: "#5B7370" }}
                >
                  <ThumbsUp size={12.5} fill={vote === "like" ? "#0E7C7B" : "none"} /> {likeCount}
                </button>
                <button
                  onClick={() => toggleVote(reviewKey, "dislike")}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors"
                  style={vote === "dislike"
                    ? { background: "#FBEAE5", color: "#C4472A" }
                    : { background: "#F5F7F5", color: "#5B7370" }}
                >
                  <ThumbsDown size={12.5} fill={vote === "dislike" ? "#C4472A" : "none"} /> {dislikeCount}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImageDrop({ label, image, onImage }) {
  const ref = useRef(null);
  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result);
    reader.readAsDataURL(f);
  }
  return (
    <div>
      <div className="text-[13px] font-semibold mb-1.5">{label}</div>
      <div onClick={() => ref.current?.click()}
        className="rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ height: 180, borderColor: "#D8E2DF", background: image ? `center/cover no-repeat url(${image})` : "#F5F7F5" }}>
        {!image && <div className="text-center" style={{ color: "#8CA39F" }}><Upload size={22} /><div className="text-xs mt-1.5">Upload</div></div>}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={onFile} className="hidden" />
    </div>
  );
}

function PhotoTab({ t }) {
  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function compare() {
    if (!left || !right) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const data = await analyzePhotos(left, right);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sa-card p-6">
      <div className="font-display flex items-center gap-2 font-bold"><Camera size={18} color="#0E7C7B" /> {t.photoCheck}</div>
      <p className="text-[13px] text-[#5B7370] mt-1">{t.photoCheckSub}</p>
      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <ImageDrop label={t.adPhoto} image={left} onImage={setLeft} />
        <ImageDrop label={t.realPhoto} image={right} onImage={setRight} />
      </div>
      <button className="sa-btn-primary mt-5" onClick={compare} disabled={loading || !left || !right}>{t.compareAi}</button>

      {loading && <div className="flex items-center gap-2 mt-4 text-[#5B7370]"><Loader2 size={16} className="sa-spin" /> {t.comparing}</div>}

      {error && !loading && (
        <div className="sa-animate mt-5 p-4 rounded-xl text-[13.5px]" style={{ background: "#FBEAE5", color: "#C4472A" }}>{error}</div>
      )}

      {result && !loading && !error && (
        <div className="sa-animate mt-5 grid md:grid-cols-3 gap-5 items-center">
          <div className="md:col-span-1 flex justify-center"><TrustGauge score={result.realityMatchPercent} size={110} strokeWidth={11} /></div>
          <div className="md:col-span-2">
            <div className="text-xs text-[#8CA39F]">{t.realityMatch}</div>
            <div className="mt-2 text-[13.5px] text-[#3A504D]" style={{ lineHeight: 1.8 }}>
              {(result.matches || []).map((m, i) => (
                <div key={`m${i}`} className="flex items-center gap-2"><CheckCircle2 size={14} color="#2E9E5B" /> {m}</div>
              ))}
              {(result.discrepancies || []).map((d, i) => (
                <div key={`d${i}`} className="flex items-center gap-2"><AlertTriangle size={14} color="#D6A61A" /> {d}</div>
              ))}
            </div>
            {result.verdict && <div className="mt-2.5 text-[13px] italic text-[#5B7370]">"{result.verdict}"</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function GeoReviewFlow({ t }) {
  const [captcha, setCaptcha] = useState(false);
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);

  function verify() {
    setChecking(true);
    setTimeout(() => { setChecking(false); setVerified(true); }, 1600);
  }

  return (
    <div className="sa-card p-6">
      <div className="font-display flex items-center gap-2 font-bold"><LocateFixed size={18} color="#0E7C7B" /> {t.geoReview}</div>

      <div className="mt-5">
        <div className="text-xs font-bold text-[#8CA39F] uppercase">{t.step1}</div>
        <label className="flex items-center gap-3 mt-2 p-3 border border-[#E4EAE8] rounded-xl cursor-pointer">
          <input type="checkbox" checked={captcha} onChange={(e) => setCaptcha(e.target.checked)} className="w-[18px] h-[18px]" />
          <span className="text-sm">{t.notRobot}</span>
          {captcha && <Badge tone="trust"><CheckCircle2 size={11} /> {t.captchaOk}</Badge>}
        </label>
      </div>

      <div className="mt-5" style={{ opacity: captcha ? 1 : 0.4, pointerEvents: captcha ? "auto" : "none" }}>
        <div className="text-xs font-bold text-[#8CA39F] uppercase">{t.step2}</div>
        {!verified ? (
          <button className="sa-btn-secondary mt-2 flex items-center gap-2" onClick={verify} disabled={checking}>
            {checking ? <Loader2 size={15} className="sa-spin" /> : <LocateFixed size={15} />} {checking ? t.checking : t.checkLocation}
          </button>
        ) : (
          <div className="sa-animate mt-2 p-3 flex items-center gap-2 rounded-xl font-semibold text-sm" style={{ background: "#E4F4F1", color: "#0E7C7B" }}>
            <CheckCircle2 size={16} /> {t.inArea}
          </div>
        )}
      </div>

      {verified && (
        <div className="sa-animate mt-5">
          <Badge tone="trust"><ShieldCheck size={12} /> {t.verifiedVisit}</Badge>
          <button className="sa-btn-primary mt-3 block">{t.writeReview}</button>
        </div>
      )}
    </div>
  );
}

function QrFlow({ t, place }) {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  function scan() { setScanning(true); setTimeout(() => { setScanning(false); setDone(true); }, 1500); }
  const now = new Date();
  return (
    <div className="sa-card p-6">
      <div className="font-display flex items-center gap-2 font-bold"><QrCode size={18} color="#0E7C7B" /> {t.qrTitle}</div>
      <div className="grid md:grid-cols-2 gap-6 mt-5 items-center">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl flex items-center justify-center relative overflow-hidden" style={{ width: 150, height: 150, background: "#0B2B2B" }}>
            <QrCode size={100} color="#fff" strokeWidth={1.2} />
            {scanning && <div className="sa-pulse absolute left-0 right-0" style={{ height: 3, background: "#9FE3D8", top: "50%", boxShadow: "0 0 12px #9FE3D8" }} />}
          </div>
          {!done ? (
            <button className="sa-btn-primary mt-4 flex items-center gap-2" onClick={scan} disabled={scanning}>
              {scanning ? <Loader2 size={15} className="sa-spin" /> : <ScanLine size={15} />} {scanning ? t.scanning : t.scanQr}
            </button>
          ) : (
            <div className="sa-animate mt-4 text-center">
              <div className="flex items-center gap-2 font-bold" style={{ color: "#2E9E5B" }}><CheckCircle2 size={18} /> {t.visitConfirmed}</div>
            </div>
          )}
        </div>
        <div>
          {done ? (
            <div className="sa-animate sa-card p-4" style={{ background: "#F5F7F5" }}>
              <div className="font-bold">{place.name}</div>
              <div className="font-mono text-[13px] text-[#5B7370] mt-1">
                {now.toLocaleDateString("uz-UZ")} · {now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="mt-2"><Badge tone="trust"><BadgeCheck size={12} /> {t.verifiedVisitor}</Badge></div>
              <p className="text-[13px] text-[#5B7370] mt-2.5">{t.qrExplain}</p>
            </div>
          ) : (
            <p className="text-sm text-[#5B7370]">{t.qrExplain}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Panorama({ t }) {
  const [rot, setRot] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  function pointerMove(clientX) {
    if (dragging.current) {
      setRot((r) => r + (clientX - lastX.current) * 0.5);
      lastX.current = clientX;
    }
  }

  return (
    <div className="sa-card p-6 mt-6">
      <div className="flex items-center justify-between">
        <div className="font-display flex items-center gap-2 font-bold"><Eye size={17} color="#0E7C7B" /> {t.view360}</div>
        <Badge tone="trust"><ShieldCheck size={11} /> {t.verified360}</Badge>
      </div>
      <div
        onMouseDown={(e) => { dragging.current = true; lastX.current = e.clientX; }}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onMouseMove={(e) => pointerMove(e.clientX)}
        onTouchStart={(e) => { dragging.current = true; lastX.current = e.touches[0].clientX; }}
        onTouchEnd={() => (dragging.current = false)}
        onTouchMove={(e) => pointerMove(e.touches[0].clientX)}
        className="rounded-2xl mt-3.5 relative overflow-hidden"
        style={{
          height: 200, cursor: "grab", touchAction: "none",
          background: "linear-gradient(90deg,#B9D6C7,#DCEAE6,#9FE3D8,#B9D6C7,#DCEAE6,#9FE3D8)",
          backgroundSize: "220% 100%", backgroundPosition: `${rot}px 0`,
        }}>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold" style={{ color: "#0B3D5C99" }}>
          ⟷ drag to look around ⟷
        </div>
      </div>
      <div className="text-xs text-[#8CA39F] mt-2">Tasvir olingan sana: 12.08.2026</div>
    </div>
  );
}
