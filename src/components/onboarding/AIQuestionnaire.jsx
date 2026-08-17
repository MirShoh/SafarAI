import { useState } from "react";
import { ArrowRight, Bot, Loader2 } from "lucide-react";
import { DISTRICTS, PLACES_CATALOG } from "../../data.js";
import { recommendPlaces } from "../../api.js";
import OnboardingShell from "./OnboardingShell.jsx";
import { backgroundFor } from "./backgrounds.js";

const QUESTIONS = [
  {
    key: "district",
    text: "Qaysi hudud yoki tumanga sayohat qilmoqchisiz?",
    multi: false,
    options: [...DISTRICTS.map((d) => [d, d]), ["any", "Farqi yo'q, hammasini ko'rsating"]],
  },
  {
    key: "interests",
    text: "Qanaqa joylar sizga ko'proq yoqadi?",
    multi: true,
    options: [
      ["mountain", "Tog'li hududlar"],
      ["history", "Ziyoratgohlar / tarixiy joylar"],
      ["water", "Suv havzalari"],
      ["food", "Milliy taomlar"],
      ["hotel", "Qulay mehmonxona"],
      ["gift", "Hunarmandchilik / sovg'alar"],
    ],
  },
  {
    key: "style",
    text: "Sayohat maqsadingiz nima?",
    multi: false,
    options: [
      ["rest", "Dam olish va tinchlik"],
      ["adventure", "Tabiat va sarguzasht"],
      ["culture", "Tarix va madaniyat"],
      ["family", "Oila bilan dam olish"],
    ],
  },
];

export default function AIQuestionnaire({ onFinish }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [pendingMulti, setPendingMulti] = useState([]);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const q = QUESTIONS[step];
  const done = step >= QUESTIONS.length;

  async function finish(finalAnswers) {
    setLoading(true); setError(null);
    const query = describeAnswers(finalAnswers);
    try {
      const data = await recommendPlaces(query, PLACES_CATALOG);
      onFinish({ answers: finalAnswers, reply: data.reply, placeIds: data.placeIds || [] });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function advance(next) {
    setAnswers(next);
    setPendingMulti([]);
    setFreeText("");
    if (step + 1 >= QUESTIONS.length) finish(next);
    else setStep(step + 1);
  }

  function answerSingle(value, label) {
    advance({ ...answers, [q.key]: { value, label } });
  }

  function toggleMulti(value) {
    setPendingMulti((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  }

  function confirmMulti() {
    const labels = pendingMulti.map((v) => q.options.find(([ov]) => ov === v)?.[1]).filter(Boolean);
    advance({ ...answers, [q.key]: { value: pendingMulti, label: labels.join(", ") } });
  }

  // Typing a free-form answer always overrides the chip picks for this
  // question — it doesn't matter whether the question is single- or
  // multi-select, the typed text becomes the answer either way.
  function submitFreeText() {
    const text = freeText.trim();
    if (!text) return;
    advance({ ...answers, [q.key]: { value: text, label: text } });
  }

  // Background changes with every question — moving from step to step
  // visibly swaps the photo (mountain -> water -> valley -> ...) instead of
  // staying static or falling back to a blank page.
  return (
    <OnboardingShell image={backgroundFor(2 + Math.min(step, QUESTIONS.length - 1))} maxWidth={560}>
      <div className="sa-card w-full p-6">
        <div className="font-display flex items-center gap-2 font-bold"><Bot size={18} color="#0E7C7B" /> SafarAI yordamchisi</div>

        <div className="mt-5 flex flex-col gap-4">
          {QUESTIONS.slice(0, step).map((prevQ) => (
            <div key={prevQ.key} className="flex flex-col gap-2">
              <ChatBubble from="ai">{prevQ.text}</ChatBubble>
              <ChatBubble from="user">{answers[prevQ.key]?.label}</ChatBubble>
            </div>
          ))}

          {!done && (
            <div className="sa-animate flex flex-col gap-3">
              <ChatBubble from="ai">{q.text}</ChatBubble>
              <div className="flex flex-wrap gap-2">
                {q.options.map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => (q.multi ? toggleMulti(value) : answerSingle(value, label))}
                    className={`sa-chip ${q.multi && pendingMulti.includes(value) ? "active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {q.multi && (
                <button className="sa-btn-primary self-start" onClick={confirmMulti} disabled={pendingMulti.length === 0}>
                  Davom etish
                </button>
              )}

              <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid #E4EAE8" }}>
                <span className="text-[12px] text-[#8CA39F] flex-shrink-0">yoki o'zingiz yozing:</span>
                <input
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitFreeText(); }}
                  placeholder="Masalan: Kitob yaqinidagi tinch tog' hovlisi..."
                  className="flex-1 border border-[#E4EAE8] rounded-full px-3.5 py-1.5 text-[13px] outline-none min-w-0"
                />
                <button onClick={submitFreeText} disabled={!freeText.trim()} aria-label="Yuborish"
                  className="rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ width: 32, height: 32, background: "#0E7C7B", color: "#fff", opacity: freeText.trim() ? 1 : 0.4 }}>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {done && loading && (
            <ChatBubble from="ai">
              <span className="flex items-center gap-2"><Loader2 size={15} className="sa-spin" /> Sizga mos joylarni qidiryapman...</span>
            </ChatBubble>
          )}
          {error && (
            <div className="p-3 rounded-xl text-[13.5px]" style={{ background: "#FBEAE5", color: "#C4472A" }}>{error}</div>
          )}
        </div>
      </div>
    </OnboardingShell>
  );
}

function describeAnswers(answers) {
  const parts = [];
  if (answers.district) parts.push(`Hudud: ${answers.district.label}`);
  if (answers.interests) parts.push(`Qiziqishlar: ${answers.interests.label}`);
  if (answers.style) parts.push(`Sayohat maqsadi: ${answers.style.label}`);
  return parts.join(". ");
}

function ChatBubble({ from, children }) {
  const isAi = from === "ai";
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"}`}>
      <div
        className="rounded-2xl px-4 py-2.5 text-[13.5px]"
        style={{
          maxWidth: "80%",
          background: isAi ? "#F5F7F5" : "#0E7C7B",
          color: isAi ? "#0B2B2B" : "#fff",
          borderTopLeftRadius: isAi ? 4 : undefined,
          borderTopRightRadius: isAi ? undefined : 4,
        }}
      >
        {children}
      </div>
    </div>
  );
}
