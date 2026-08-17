export function getTelegram() {
  return typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
}

export function isTelegramMiniApp() {
  return Boolean(getTelegram()?.initData);
}

function setViewportVar(tg) {
  const h = tg?.viewportStableHeight || tg?.viewportHeight || window.innerHeight;
  document.documentElement.style.setProperty("--tg-vh", `${h}px`);
}

// Wires the app into the Telegram Mini App container: expands to full height,
// keeps a live --tg-vh var in sync (Telegram's viewport resizes as sheets/keyboard open),
// and matches the native chrome to the app's own dark-teal brand color instead of Telegram's default.
export function initTelegram() {
  const tg = getTelegram();
  if (!tg) {
    document.documentElement.style.setProperty("--tg-vh", `${window.innerHeight}px`);
    return;
  }

  tg.ready();
  tg.expand();
  try { tg.disableVerticalSwipes?.(); } catch { /* older client */ }
  try {
    tg.setHeaderColor?.("#0B2B2B");
    tg.setBackgroundColor?.("#F5F7F5");
  } catch { /* older client */ }

  setViewportVar(tg);
  tg.onEvent?.("viewportChanged", () => setViewportVar(tg));
  window.addEventListener("resize", () => setViewportVar(tg));
}
