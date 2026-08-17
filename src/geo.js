// Haversine distance between two lat/lng points, in kilometers.
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Qashqadaryo region, roughly: Qarshi steppe in the west to the Kitob/Shahrisabz
// mountains in the northeast. Used to keep the map from panning off into
// neighbouring regions.
export const QASHQADARYO_CENTER = { lat: 38.98, lng: 66.15 };
export const QASHQADARYO_BOUNDS = [
  [37.7, 64.6],
  [39.6, 67.3],
];
