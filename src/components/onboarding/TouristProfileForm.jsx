import { useState } from "react";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import OnboardingShell from "./OnboardingShell.jsx";
import AuthMethodPicker from "./AuthMethodPicker.jsx";
import { backgroundFor } from "./backgrounds.js";

export default function TouristProfileForm({ onSubmit }) {
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
  const canSubmit = firstName.trim() && lastName.trim() && contactOk;

  return (
    <OnboardingShell image={backgroundFor(1)}>
      <div className="sa-card w-full p-7">
        <MapPin size={22} color="#0E7C7B" />
        <h1 className="font-display font-bold text-[22px] mt-3">O'zingiz haqingizda</h1>
        <p className="text-sm text-[#5B7370] mt-1">Bu tavsiyalarni siz uchun moslashtirish va tasdiqlangan tashrifingizni bog'lash uchun kerak.</p>

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit({ firstName, lastName, phone, email, method }); }}
        >
          <div>
            <label className="text-xs text-[#8CA39F]">Ism</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Masalan: Humoyun"
              className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
          </div>
          <div>
            <label className="text-xs text-[#8CA39F]">Familiya</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Masalan: Qodirov"
              className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
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
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="siz@email.com" type="email"
                className="w-full border border-[#E4EAE8] rounded-[10px] p-2.5 mt-1" />
            </div>
          )}
          {method === "microsoft" && msAuthed && (
            <div className="flex items-center gap-2 text-sm rounded-xl px-3 py-2.5" style={{ background: "#E4F4F1", color: "#0E7C7B" }}>
              <CheckCircle2 size={15} /> Microsoft hisobi ulandi: {email}
            </div>
          )}

          <button type="submit" className="sa-btn-primary mt-2 flex items-center justify-center gap-2" disabled={!canSubmit}>
            Davom etish <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </OnboardingShell>
  );
}
