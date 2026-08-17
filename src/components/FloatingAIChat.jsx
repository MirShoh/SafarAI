import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { PLACES, PLACES_CATALOG } from "../data.js";
import { recommendPlaces } from "../api.js";
import { Badge, TrustGauge, trustTone } from "./ui.jsx";

const GREETING = "Salom! Men SafarAI yordamchisiman. Qanaqa joy qidiryapsiz? Masalan: \"tog'li joy, yonida suvi bo'lsin, Qarshiga yaqinroq\".";

export default function FloatingAIChat({ openPlace }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "ai", text: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.slice(-6).map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const data = await recommendPlaces(text, PLACES_CATALOG, history);
      const places = (data.placeIds || []).map((id) => PLACES.find((p) => p.id === id)).filter(Boolean);
      setMessages((prev) => [...prev, { role: "ai", text: data.reply, places }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: `Kechirasiz, javob bera olmadim: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div
          className="sa-animate fixed z-[2000] flex flex-col sa-card overflow-hidden"
          style={{
            right: "max(16px, env(safe-area-inset-right))",
            bottom: "calc(84px + env(safe-area-inset-bottom))",
            left: "max(16px, env(safe-area-inset-left))",
            width: "auto",
            maxWidth: 380,
            height: "min(70dvh, 560px)",
            marginLeft: "auto",
            boxShadow: "0 12px 40px rgba(11,43,43,0.22)",
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }}>
            <div className="flex items-center gap-2 font-display font-bold text-[14.5px]"><Sparkles size={15} /> SafarAI yordamchisi</div>
            <button onClick={() => setOpen(false)} className="bg-none border-none text-white"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto sa-scroll p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}>
                <div className="flex flex-col gap-2" style={{ maxWidth: "88%" }}>
                  <div
                    className="rounded-2xl px-3.5 py-2 text-[13px]"
                    style={{
                      background: m.role === "ai" ? "#F5F7F5" : "#0E7C7B",
                      color: m.role === "ai" ? "#0B2B2B" : "#fff",
                      borderTopLeftRadius: m.role === "ai" ? 4 : undefined,
                      borderTopRightRadius: m.role === "ai" ? undefined : 4,
                    }}
                  >
                    {m.text}
                  </div>
                  {m.places?.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { openPlace(p.id); setOpen(false); }}
                      className="sa-card flex items-center gap-2.5 p-2 text-left"
                    >
                      {p.image
                        ? <img src={p.image} alt={p.name} className="rounded-lg object-cover flex-shrink-0" style={{ width: 44, height: 44 }} />
                        : <div className="rounded-lg flex-shrink-0" style={{ width: 44, height: 44 }}><TrustGauge score={p.trust} size={44} strokeWidth={5} showLabel={false} /></div>}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs truncate">{p.name}</div>
                        <div className="text-[11px] text-[#8CA39F]">{p.district}</div>
                      </div>
                      <Badge tone={trustTone(p.trust)}>{p.trust}</Badge>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3.5 py-2 text-[13px] flex items-center gap-2" style={{ background: "#F5F7F5", color: "#5B7370" }}>
                  <Loader2 size={14} className="sa-spin" /> yozyapman...
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 p-3 border-t border-[#E4EAE8]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Nima qidiryapsiz?"
              className="flex-1 border border-[#E4EAE8] rounded-full px-3.5 py-2 text-[13.5px] outline-none"
            />
            <button onClick={send} disabled={loading || !input.trim()} aria-label="Yuborish"
              className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: "#0E7C7B", color: "#fff" }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="AI yordamchi"
        className="fixed z-[2000] rounded-full flex items-center justify-center text-white"
        style={{
          right: "max(16px, env(safe-area-inset-right))",
          bottom: "calc(16px + env(safe-area-inset-bottom))",
          width: 56, height: 56,
          background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)",
          boxShadow: "0 8px 24px rgba(11,43,43,0.35)",
        }}
      >
        {open ? <X size={22} /> : <Bot size={24} />}
      </button>
    </>
  );
}
