import { ChevronLeft, ChevronRight, Loader2, Play, X, CheckCircle2 } from "lucide-react";
import { Badge, MiniBar, TrustGauge } from "./ui.jsx";

export default function DemoModal({ t, step, setStep, onClose, openPlace }) {
  const steps = [
    { body: () => (
      <div className="text-center">
        <div className="text-sm text-[#5B7370]">Tourist searches:</div>
        <div className="font-display font-bold text-2xl mt-1.5">Miraki Eco Resort</div>
        <div className="font-mono font-bold text-[40px] mt-2.5 flex items-center justify-center gap-2">4.8 ★</div>
        <div className="mt-3.5 italic text-[#5B7370]">"{t.heroQuestion}"</div>
      </div>
    )},
    { body: () => (
      <div className="text-center">
        <div className="text-sm text-[#5B7370]">AI analyzes 487 reviews...</div>
        <div className="flex justify-center mt-4"><Loader2 size={26} className="sa-spin" color="#0E7C7B" /></div>
        <div className="font-mono font-bold text-[30px] mt-3.5" style={{ color: "#C4472A" }}>102 suspicious reviews</div>
        <div className="text-[15px] text-[#5B7370]">= 21%</div>
      </div>
    )},
    { body: () => (
      <div className="text-center">
        <div className="text-sm text-[#5B7370]">AI compares advertising vs real photos</div>
        <div className="flex justify-center mt-4"><TrustGauge score={64} size={110} strokeWidth={11} /></div>
        <div className="mt-2 font-bold">Reality Match: 64%</div>
      </div>
    )},
    { body: () => (
      <div className="text-center">
        <CheckCircle2 size={30} color="#0E7C7B" className="mx-auto" />
        <div className="font-mono font-bold text-[34px] mt-2.5">348</div>
        <div className="text-sm text-[#5B7370]">{t.verifiedVisits}</div>
      </div>
    )},
    { body: () => (
      <div>
        <MiniBar label="Tozalik" value={100 - 34} />
        <MiniBar label="Xizmat" value={100 - 27} />
        <MiniBar label="Narx" value={100 - 18} />
      </div>
    )},
    { body: () => (
      <div className="text-center">
        <div className="flex items-center justify-center gap-6">
          <div><div className="text-xs text-[#8CA39F]">INTERNET</div><div className="font-mono font-bold text-[34px]">4.8 ★</div></div>
          <div className="text-[22px] text-[#D8E2DF]">VS</div>
          <div><div className="text-xs text-[#8CA39F]">SAFARAI</div><div className="font-mono font-bold text-[34px]" style={{ color: "#C4472A" }}>63/100 ⚠️</div></div>
        </div>
        <div className="mt-5 p-4 rounded-xl text-left text-[13.5px]" style={{ background: "#FBEAE5", color: "#7A2E1D" }}>
          "Maskan internetda 4.8 yulduzli yuqori reytingga ega. Biroq SafarAI tahliliga ko'ra, sharhlarning 21% qismi shubhali, reklama va real suratlarning mosligi 64% hamda tozalik bo'yicha salbiy fikrlar ortmoqda. Bron qilishdan oldin so'nggi tasdiqlangan sharhlar va real fotosuratlarni ko'rib chiqish tavsiya etiladi."
        </div>
        <button className="sa-btn-primary mt-5" onClick={() => { openPlace("miraki"); onClose(); }}>{t.detailsBtn}</button>
      </div>
    )},
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(11,43,43,0.55)" }} onClick={onClose}>
      <div className="sa-card sa-animate w-full p-7" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <Badge tone="deep"><Play size={11} /> {t.demoScenario}</Badge>
          <button onClick={onClose} className="bg-none border-none"><X size={18} /></button>
        </div>
        <div className="mt-4.5">{steps[step].body()}</div>
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-1">
            {steps.map((_, i) => <span key={i} className="rounded-full transition-all" style={{ width: i === step ? 18 : 6, height: 6, background: i === step ? "#0E7C7B" : "#E4EAE8" }} />)}
          </div>
          <div className="flex gap-2">
            {step > 0 && <button className="sa-btn-secondary" onClick={() => setStep(step - 1)}><ChevronLeft size={15} /></button>}
            {step < steps.length - 1 ? (
              <button className="sa-btn-primary flex items-center gap-1" onClick={() => setStep(step + 1)}>{t.next} <ChevronRight size={14} /></button>
            ) : (
              <button className="sa-btn-secondary" onClick={onClose}>{t.close}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
