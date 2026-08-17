import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { trustColor } from "./ui.jsx";
import { QASHQADARYO_CENTER, QASHQADARYO_BOUNDS } from "../geo.js";

const CATEGORY_EMOJI = {
  mountain: "⛰️", water: "💧", history: "🏛️", food: "🍲", home: "🏡", hotel: "🏨", gift: "🎁",
};

function placeIcon(place, isActive) {
  const color = trustColor(place.trust);
  const size = isActive ? 40 : 34;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
        background:${color};transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(11,43,43,0.35);
        border:2px solid #fff;
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="transform:rotate(45deg);font-size:${size * 0.46}px;line-height:1;">${CATEGORY_EMOJI[place.category] || "📍"}</span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function userIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:22px;height:22px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:#0E7C7B;opacity:0.35;animation:sa-pulse 1.6s ease infinite;"></div>
        <div style="position:absolute;left:6px;top:6px;width:10px;height:10px;border-radius:50%;background:#0E7C7B;border:2px solid #fff;box-shadow:0 0 0 2px #0E7C7B55;"></div>
      </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// Imperative Leaflet wrapper: the map instance is created once and lives in
// mapRef for the component's lifetime. React state changes only ever update
// markers/view via effects — L.map(...) is never re-run on re-render, so
// pan/zoom state and tile cache survive filter changes untouched.
export default function LeafletMap({ places, activeId, onSelect, userCoords }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const userMarkerRef = useRef(null);

  // init once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [QASHQADARYO_CENTER.lat, QASHQADARYO_CENTER.lng],
      zoom: 9,
      minZoom: 8,
      maxBounds: QASHQADARYO_BOUNDS,
      maxBoundsViscosity: 0.6,
      scrollWheelZoom: true,
      zoomControl: false,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    mapRef.current = map;

    // Leaflet caches the container size at first paint; if the panel's real
    // size settles after that (flex layout, fonts loading, tab switch), tiles
    // render misaligned until told to re-measure.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      // Marker objects belong to this map instance and die with it — drop the
      // refs too, or a remount (StrictMode, or leaving/returning to the Map
      // tab) would find "existing" stale markers and skip re-adding them.
      markersRef.current.clear();
      userMarkerRef.current = null;
    };
  }, []);

  // sync markers when the filtered place list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const [id, marker] of markersRef.current) {
      if (!places.find((p) => p.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    places.forEach((place) => {
      const existing = markersRef.current.get(place.id);
      if (existing) {
        existing.setIcon(placeIcon(place, place.id === activeId));
        return;
      }
      const marker = L.marker([place.lat, place.lng], { icon: placeIcon(place, place.id === activeId) })
        .addTo(map)
        .on("click", () => onSelect(place.id));
      markersRef.current.set(place.id, marker);
    });
  }, [places, activeId, onSelect]);

  // user location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userCoords) {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon(), zIndexOffset: 1000 }).addTo(map);
      map.panTo([userCoords.lat, userCoords.lng]);
    }
  }, [userCoords]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
