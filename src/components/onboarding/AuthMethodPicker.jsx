import { useState } from "react";
import { Loader2, Mail, Phone } from "lucide-react";
import { signInWithMicrosoft } from "../../msal.js";

function MicrosoftMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 23 23" aria-hidden="true">
      <rect width="10" height="10" x="1" y="1" fill="#F25022" />
      <rect width="10" height="10" x="12" y="1" fill="#7FBA00" />
      <rect width="10" height="10" x="1" y="12" fill="#00A4EF" />
      <rect width="10" height="10" x="12" y="12" fill="#FFB900" />
    </svg>
  );
}

// Registration method chips: phone / email / Microsoft account. Microsoft
// triggers a real MSAL popup sign-in on click and reports the resulting
// profile back up; if VITE_MICROSOFT_CLIENT_ID isn't set, the popup call
// itself fails with a clear message instead of the button silently doing
// nothing.
export default function AuthMethodPicker({ method, setMethod, onMicrosoftAuth }) {
  const [msLoading, setMsLoading] = useState(false);
  const [msError, setMsError] = useState(null);

  async function chooseMicrosoft() {
    setMethod("microsoft");
    setMsError(null);
    setMsLoading(true);
    try {
      const profile = await signInWithMicrosoft();
      onMicrosoftAuth(profile);
    } catch (err) {
      setMsError(err.message);
    } finally {
      setMsLoading(false);
    }
  }

  return (
    <div>
      <label className="text-xs text-[#8CA39F]">Ro'yxatdan o'tish usuli</label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        <button type="button" onClick={() => setMethod("phone")} className={`sa-chip flex items-center gap-1.5 ${method === "phone" ? "active" : ""}`}>
          <Phone size={13} /> Telefon raqami
        </button>
        <button type="button" onClick={() => setMethod("email")} className={`sa-chip flex items-center gap-1.5 ${method === "email" ? "active" : ""}`}>
          <Mail size={13} /> Email
        </button>
        <button type="button" onClick={chooseMicrosoft} disabled={msLoading} className={`sa-chip flex items-center gap-1.5 ${method === "microsoft" ? "active" : ""}`}>
          {msLoading ? <Loader2 size={13} className="sa-spin" /> : <MicrosoftMark />} Microsoft hisobi
        </button>
      </div>
      {msError && <div className="text-xs mt-2" style={{ color: "#C4472A" }}>{msError}</div>}
    </div>
  );
}
