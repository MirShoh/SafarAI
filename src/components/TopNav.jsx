import { Compass, LogOut, Menu, Play, X } from "lucide-react";

// t.nav is a fixed-order array from i18n: [home, map, top, planner, rewards, business, gov].
// Only a role-relevant subset is ever shown in the persistent nav — TOP and
// the trip planner stay reachable from Home instead, so the bar itself never
// grows past what a given visitor actually needs.
function navKeysFor(role) {
  if (role === "business") return ["home", "business"];
  if (role === "gov") return ["home", "gov"];
  return ["home", "map", "rewards"];
}

export default function TopNav({ t, lang, setLang, view, go, role, menuOpen, setMenuOpen, setDemoOpen, user, onLogout }) {
  const navOrder = ["home", "map", "top", "planner", "rewards", "business", "gov"];
  const labelOf = (key) => t.nav[navOrder.indexOf(key)];
  const navKeys = navKeysFor(role);
  const displayName = user?.profile?.firstName || user?.profile?.bizName;
  // The role badge is informational only now — it reflects the account the
  // user actually registered as, and is never clickable, so there is no way
  // to hop from a tourist/business login into the Administrator (gov) view.
  const roleLabel = role === "business" ? t.role_business : role === "gov" ? t.role_gov : t.role_tourist;

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#E4EAE8]"
      style={{ background: "rgba(245,247,245,0.85)", backdropFilter: "blur(10px)" }}
    >
      <div className="max-w-7xl mx-auto safe-x flex items-center justify-between" style={{ height: 64 }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => go("home")}>
          <div className="flex items-center justify-center rounded-[10px]" style={{ width: 34, height: 34, background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }}>
            <Compass size={18} color="#fff" />
          </div>
          <span className="font-display font-bold text-xl">SafarAI</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navKeys.map((k) => (
            <button key={k} onClick={() => go(k)}
              className="bg-none border-none cursor-pointer text-sm font-semibold px-3 py-2 rounded-lg"
              style={{ color: view === k ? "#0E7C7B" : "#3A504D" }}>
              {labelOf(k)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 rounded-full border border-[#D8E2DF] p-[3px]">
            {["uz", "ru", "en"].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className="rounded-full text-xs font-bold border-none cursor-pointer"
                style={{ background: lang === l ? "#0B2B2B" : "transparent", color: lang === l ? "#fff" : "#3A504D", padding: "5px 10px" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="hidden md:block sa-btn-secondary" onClick={() => setDemoOpen(true)}>
            <span className="flex items-center gap-1.5"><Play size={14} /> {t.demo}</span>
          </button>
          {displayName && (
            <div className="hidden md:flex items-center gap-2 pl-1">
              <div className="flex items-center justify-center rounded-full text-white font-bold text-xs flex-shrink-0"
                style={{ width: 28, height: 28, background: "linear-gradient(135deg,#0E7C7B,#0B3D5C)" }}>
                {displayName[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-[#3A504D] max-w-[120px] truncate">{displayName}</span>
              <button aria-label="Chiqish" title="Chiqish" onClick={onLogout}
                className="bg-none border-none p-2 rounded-lg" style={{ color: "#8CA39F" }}>
                <LogOut size={17} />
              </button>
            </div>
          )}
          <button aria-label="Menu" className="lg:hidden bg-none border-none p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden safe-x pb-4 flex flex-col gap-1">
          {navKeys.map((k) => (
            <button key={k} onClick={() => go(k)} className="text-left bg-none border-none py-2.5 px-1.5 text-[15px] font-semibold"
              style={{ color: view === k ? "#0E7C7B" : "#3A504D" }}>
              {labelOf(k)}
            </button>
          ))}
          <div className="flex gap-2 mt-2">
            {["uz", "ru", "en"].map((l) => (
              <button key={l} onClick={() => setLang(l)} className="sa-chip" style={{ background: lang === l ? "#0B2B2B" : "#fff", color: lang === l ? "#fff" : "#0B2B2B" }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="sa-chip" style={{ background: "#E4F4F1", color: "#0E7C7B" }}>{roleLabel}</span>
          </div>
          <button className="sa-btn-primary mt-2" onClick={() => setDemoOpen(true)}>{t.demo}</button>
          {displayName && (
            <button onClick={onLogout} className="flex items-center gap-2 mt-3 py-2 px-1.5 text-[15px] font-semibold bg-none border-none text-left" style={{ color: "#C4472A" }}>
              <LogOut size={16} /> Chiqish ({displayName})
            </button>
          )}
        </div>
      )}

      <div className="hidden md:flex justify-end safe-x pb-2 gap-2">
        <span className="sa-chip text-[11px]" style={{ padding: "4px 10px", background: "#E4F4F1", color: "#0E7C7B", borderColor: "#0E7C7B" }}>
          {roleLabel}
        </span>
      </div>
    </header>
  );
}
