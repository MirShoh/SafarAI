import { Building2, Gift, Home as HomeIcon, MapPin, Wallet } from "lucide-react";
import { Badge } from "./ui.jsx";

export default function Rewards({ t, user }) {
  const earn = [
    ["Verified Visit", 20], ["Foydali matnli sharh", 10], ["Real rasm", 20], ["Batafsil foto-sharh", 30], ["Yangi maskan ma'lumoti", 15],
  ];
  const redeem = [
    { icon: Building2, l: "Mehmonxonaga 10% chegirma" }, { icon: MapPin, l: "Transport uchun 15% cashback" },
    { icon: HomeIcon, l: "Uy turizmiga chegirma" }, { icon: Gift, l: "Milliy sovg'a uchun kupon" },
  ];
  const badges = ["🏔 Mountain Explorer", "📷 Real Photo Contributor", "✅ Trusted Reviewer", "🏛 Heritage Explorer"];
  const firstName = user?.profile?.firstName || "Humoyun";
  const lastName = user?.profile?.lastName || "";

  return (
    <main className="max-w-5xl mx-auto safe-x py-10">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="sa-card p-6 md:col-span-1 text-center">
          <div className="rounded-full mx-auto flex items-center justify-center text-white font-bold text-[26px]" style={{ width: 72, height: 72, background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }}>{firstName[0]}</div>
          <div className="font-display font-bold text-xl mt-2.5">{firstName} {lastName}</div>
          <Badge tone="deep">Explorer</Badge>
          <div className="grid grid-cols-2 gap-3 mt-5 text-left">
            <div><div className="font-mono font-bold">12</div><div className="text-[11px] text-[#8CA39F]">{t.verifiedVisits}</div></div>
            <div><div className="font-mono font-bold">18</div><div className="text-[11px] text-[#8CA39F]">{t.reviews}</div></div>
            <div><div className="font-mono font-bold">46</div><div className="text-[11px] text-[#8CA39F]">{t.realPhotos}</div></div>
            <div><div className="font-mono font-bold">284</div><div className="text-[11px] text-[#8CA39F]">helpful votes</div></div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
            {badges.map((b) => <Badge key={b} tone="gold">{b}</Badge>)}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="sa-card p-6 text-white" style={{ background: "linear-gradient(135deg,#0B2B2B,#0B3D5C)" }}>
            <div className="flex items-center gap-2" style={{ color: "#9FB8B4" }}><Wallet size={16} /> {t.yourBalance}</div>
            <div className="font-mono font-bold text-[36px] mt-1">480 <span className="text-base" style={{ color: "#9FE3D8" }}>SafarPoint</span></div>
            <button className="sa-btn-gold mt-4">{t.usePoints}</button>
          </div>

          <div className="sa-card p-6">
            <div className="font-display font-bold mb-2.5">{t.rewards}</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {earn.map(([l, v]) => (
                <div key={l} className="flex items-center justify-between p-2.5 rounded-[10px]" style={{ background: "#F5F7F5" }}>
                  <span className="text-[13px]">{l}</span>
                  <span className="font-mono font-bold text-[13px]" style={{ color: "#0E7C7B" }}>+{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sa-card p-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {redeem.map((r) => (
                <div key={r.l} className="flex items-center gap-3 p-3 border border-[#E4EAE8] rounded-xl">
                  <r.icon size={18} color="#D79B34" /><span className="text-[13px]">{r.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
