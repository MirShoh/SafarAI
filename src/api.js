const BACKEND_DOWN_MESSAGE =
  "Backend server ishlamayapti. Terminalda \"npm run dev:all\" buyrug'ini ishga tushiring " +
  "(shunda frontend va backend birga ishga tushadi) va server/.env faylida OPENAI_API_KEY borligini tekshiring.";

async function postJson(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(BACKEND_DOWN_MESSAGE);
  }

  // Vite's dev proxy responds with a plain-text/HTML 500 (not JSON) when the
  // backend process isn't running at all — surface that as an actionable
  // message instead of a bare "(500)" once JSON parsing silently fails below.
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    if (!isJson) throw new Error(BACKEND_DOWN_MESSAGE);
    throw new Error(data.detail || data.error || `So'rov muvaffaqiyatsiz (${res.status})`);
  }
  return data;
}

export function analyzeReview(text) {
  return postJson("/api/analyze-review", { text });
}

export function analyzePhotos(adImage, realImage) {
  return postJson("/api/analyze-photos", { adImage, realImage });
}

export function recommendPlaces(query, catalog, history) {
  return postJson("/api/recommend", { query, catalog, history });
}
