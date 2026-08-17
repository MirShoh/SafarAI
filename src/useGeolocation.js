import { useCallback, useState } from "react";

// Opt-in only: locate() must be called from a user gesture (a button click).
// Desktop browsers without real GPS resolve navigator.geolocation from IP/Wi-Fi
// positioning databases, which can jump between cities on every request — so
// this never runs automatically on mount and never retries silently. One
// click = one attempt = one deterministic result (or a clear error).
export function useGeolocation() {
  const [status, setStatus] = useState("idle"); // idle | locating | success | error
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Bu brauzer geolokatsiyani qo'llab-quvvatlamaydi.");
      return;
    }
    if (!window.isSecureContext) {
      setStatus("error");
      setError("Geolokatsiya faqat HTTPS yoki localhost ustida ishlaydi.");
      return;
    }
    setStatus("locating");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setStatus("success");
      },
      (err) => {
        setStatus("error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Joylashuvga ruxsat berilmadi."
            : "Joylashuvni aniqlab bo'lmadi. Mobil qurilmada GPS yoqilgan holda urinib ko'ring."
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  return { status, coords, error, locate };
}
