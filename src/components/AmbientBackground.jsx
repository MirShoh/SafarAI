import { useEffect, useState } from "react";
import { poolFor } from "../pageBackgrounds.js";

// Fixed full-viewport photo behind the whole app-shell. A soft light wash on
// top keeps the existing white sa-cards / dark ink text readable, so this
// reads as ambient scenery rather than a competing hero image. The pool
// cycles on a timer (keeps "flowing" while a user lingers on one function)
// and resets whenever the active view changes, so switching functions is an
// immediate, visible swap rather than a slow drift.
export default function AmbientBackground({ view }) {
  const pool = poolFor(view);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [view]);

  useEffect(() => {
    if (pool.length < 2) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % pool.length), 9000);
    return () => clearInterval(iv);
  }, [pool, view]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }} aria-hidden="true">
      <img
        key={`${view}-${idx}`}
        src={pool[idx]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover sa-animate"
        style={{ filter: "saturate(1.15) brightness(1.02)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(245,247,245,0.5) 0%, rgba(245,247,245,0.6) 45%, rgba(245,247,245,0.72) 100%)" }}
      />
    </div>
  );
}
