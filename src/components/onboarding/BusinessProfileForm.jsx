import { useState } from "react";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { DISTRICTS } from "../../data.js";
import OnboardingShell from "./OnboardingShell.jsx";
import AuthMethodPicker from "./AuthMethodPicker.jsx";
import { backgroundFor } from "./backgrounds.js";

const BIZ_TYPES = [
  ["hotel", "Mehmonxona / Hostel"],
  ["food", "Restoran / Milliy taom"],
  ["mountain", "Dam olish maskani"],
  ["home", "Uy turizmi"],
  ["gift", "Hunarmandchilik / Sovg'a"],
];

export default function BusinessProfileForm({ onSubmit }) {
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("hotel");
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("phone");
  const [msAuthed, setMsAuthed] = useState(false);

  function handleMicrosoftAuth(profile) {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setMsAuthed(true);
  }

  const contactOk = method === "phone" ? phone.trim().length >= 7 : method === "email" ? email.includes("@") : msAuthed;
  const canSubmit = bizName.trim() && contactOk;

  return (
    <OnboardingShell image={backgroundFor(4)} maxWidth={480}>
      <div className="sa-card w-full p-7">
        <Building2 size={22} color="#D79B34" />
        <h1 className="font-display font-bold text-[22px] mt-3">Biznesingiz haqida</h1>
        <p className="text-sm text-[#5B7370] mt-1">Biznes kabinetingizni sozlash uchun bir necha savol.</p>

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit({ bizName, bizType, district, firstName, lastName, phone, email, method }); }}
        >
          <div>
            <label className="text-xs text-[#8CA39F]">Biznes nomi</label>
            <input value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="Masalan: Miraki Eco Resort"
              className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
          </div>

          <div>
            <label className="text-xs text-[#8CA39F]">Faoliyat turi</label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {BIZ_TYPES.map(([k, l]) => (
                <button key={k} type="button" onClick={() => setBizType(k)} className={`sa-chip ${bizType === k ? "active" : ""}`}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8CA39F]">Hudud</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1 bg-white">
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <AuthMethodPicker method={method} setMethod={setMethod} onMicrosoftAuth={handleMicrosoftAuth} />

          {method === "phone" && (
            <div>
              <label className="text-xs text-[#8CA39F]">Telefon raqam</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" type="tel"
                className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
            </div>
          )}
          {method === "email" && (
            <div>
              <label className="text-xs text-[#8CA39F]">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="biznes@email.com" type="email"
                className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
            </div>
          )}
          {method === "microsoft" && msAuthed && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-3 py-2.5" style={{ background: "#E4F4F1", color: "#0E7C7B" }}>
              <CheckCircle2 size={15} /> Microsoft hisobi ulandi: {email}
            </div>
          )}

          <button type="submit" className="sa-btn-gold mt-2 flex items-center justify-center gap-2" disabled={!canSubmit}>
            Kabinetga o'tish <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </OnboardingShell>
  );
}
