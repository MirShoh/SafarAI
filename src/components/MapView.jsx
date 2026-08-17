import { useCallback, useMemo, useState } from "react";
import { X, CheckCircle2, Camera, LocateFixed, Loader2 } from "lucide-react";
import { PLACES, CATEGORIES } from "../data.js";
import { MAP_R, COUNTRY_VIEWBOX } from "../mapPaths.js";
import { haversineKm } from "../geo.js";
import { useGeolocation } from "../useGeolocation.js";
import { Badge, TrustGauge, trustColor, trustTone } from "./ui.jsx";
import LeafletMap from "./LeafletMap.jsx";

export default function MapView({ t, lang, openPlace, mapFilter, setMapFilter, onlyTop, setOnlyTop }) {
  const [active, setActive] = useState(null);
  const { status: geoStatus, coords: userCoords, error: geoError, locate } = useGeolocation();

  const filters = [
    ["all", t.filters],
    ...CATEGORIES.map((c) => [c.key, c[lang]]),
  ];

  const places = useMemo(() => {
    const filtered = PLACES.filter((p) => (mapFilter === "all" || p.category === mapFilter) && (!onlyTop || p.trust >= 80));
    if (!userCoords) return filtered;
    return [...filtered]
      .map((p) => ({ ...p, distanceKm: haversineKm(userCoords.lat, userCoords.lng, p.lat, p.lng) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [mapFilter, onlyTop, userCoords]);

  const activePlace = useMemo(() => places.find((p) => p.id === active), [places, active]);
  const onSelect = useCallback((id) => setActive((cur) => (cur === id ? null : id)), []);

  return (
    <main className="max-w-7xl mx-auto safe-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display font-bold text-[28px]">{t.mapTitle}</h1>
          <p className="text-[#5B7370] text-sm">{t.mapSub}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="sa-chip flex items-center gap-1.5" onClick={locate} disabled={geoStatus === "locating"}>
            {geoStatus === "locating" ? <Loader2 size={14} className="sa-spin" /> : <LocateFixed size={14} />}
            {geoStatus === "locating" ? t.checking : "Joylashuvimni aniqlash"}
          </button>
          <label className="flex items-center gap-2 sa-chip">
            <input type="checkbox" checked={onlyTop} onChange={(e) => setOnlyTop(e.target.checked)} /> {t.onlyTop}
          </label>
        </div>
      </div>

      {geoStatus === "error" && (
        <div className="text-xs mb-3 px-3 py-2 rounded-xl" style={{ background: "#FBEAE5", color: "#C4472A" }}>{geoError}</div>
      )}
      {geoStatus === "success" && userCoords && (
        <div className="text-xs mb-3 px-3 py-2 rounded-xl flex items-center gap-1.5" style={{ background: "#E4F4F1", color: "#0E7C7B" }}>
          <CheckCircle2 size={13} /> Joylashuvingiz aniqlandi — ro'yxat yaqinlik bo'yicha saralandi (±{Math.round(userCoords.accuracy)} m aniqlik).
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto sa-scroll pb-3 mb-2">
        {filters.map(([k, label]) => (
          <button key={k} className={`sa-chip ${mapFilter === k ? "active" : ""}`} onClick={() => setMapFilter(k)}>{label}</button>
        ))}
      </div>
      <div className="text-xs text-[#8CA39F] mb-3 font-medium">{places.length} {t.resultsCount}</div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 sa-card relative overflow-hidden" style={{ height: 460 }}>
          <LeafletMap places={places} activeId={active} onSelect={onSelect} userCoords={userCoords} />

          {/* Locator inset: where Qashqadaryo sits within Uzbekistan */}
          <div className="sa-card absolute left-3 top-3 p-2" style={{ width: 118, zIndex: 1000 }}>
            <svg viewBox={COUNTRY_VIEWBOX} width="100%" height={68}>
              {MAP_R.map((r) => (
                <path key={r.id} d={r.d} fill={r.id === "qashqa" ? "#0E7C7B" : "#DCE6E3"} stroke="#fff" strokeWidth={1.2} />
              ))}
            </svg>
            <div className="text-[9.5px] text-center mt-1 leading-tight" style={{ color: "#5B7370" }}>{t.mapLocatorLabel}</div>
          </div>

          {activePlace && (
            <div className="sa-card sa-animate absolute left-4 right-4 bottom-4 p-4" style={{ maxWidth: 320, zIndex: 1000 }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-[15px]">{activePlace.name}</div>
                  <div className="flex items-center gap-1 mt-1 text-[13px]">★ {activePlace.rating}</div>
                </div>
                <button onClick={() => setActive(null)} className="bg-none border-none"><X size={16} /></button>
              </div>
              <div className="mt-2"><Badge tone={trustTone(activePlace.trust)}>{t.trustScore}: {activePlace.trust}/100</Badge></div>
              <div className="text-[12.5px] text-[#5B7370] mt-2">
                <div className="flex items-center gap-1"><CheckCircle2 size={12} /> {activePlace.verifiedVisits} {t.verifiedVisits}</div>
                <div className="flex items-center gap-1 mt-1"><Camera size={12} /> {activePlace.realPhotos} {t.realPhotos}</div>
                {activePlace.distanceKm != null && (
                  <div className="flex items-center gap-1 mt-1"><LocateFixed size={12} /> {activePlace.distanceKm.toFixed(1)} km sizdan</div>
                )}
              </div>
              <button className="sa-btn-primary mt-3 w-full" style={{ padding: 9 }} onClick={() => openPlace(activePlace.id)}>{t.detailsBtn}</button>
            </div>
          )}

          <div className="sa-card absolute top-3 right-3 p-2.5 text-[11px]" style={{ zIndex: 1000 }}>
            <div className="flex items-center gap-1.5"><span className="rounded-full" style={{ width: 8, height: 8, background: "#2E9E5B" }} /> 80–100</div>
            <div className="flex items-center gap-1.5 mt-1"><span className="rounded-full" style={{ width: 8, height: 8, background: "#D6A61A" }} /> 60–79</div>
            <div className="flex items-center gap-1.5 mt-1"><span className="rounded-full" style={{ width: 8, height: 8, background: "#C4472A" }} /> 0–59</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto sa-scroll" style={{ maxHeight: 460 }}>
          {places.map((p) => (
            <button key={p.id} onClick={() => openPlace(p.id)} className="sa-card p-4 text-left flex items-center gap-3">
              <TrustGauge score={p.trust} size={52} strokeWidth={6} showLabel={false} />
              <div className="flex-1">
                <div className="font-bold text-sm">{p.name}</div>
                <div className="text-xs text-[#5B7370]">
                  {p.district}{p.distanceKm != null ? ` · ${p.distanceKm.toFixed(1)} km` : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold" style={{ color: trustColor(p.trust) }}>{p.trust}</div>
                <div className="text-[11px] text-[#8CA39F]">Trust</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
