import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { T } from "./i18n.js";
import { PLACES, NOTIFICATIONS } from "./data.js";
import { useUser } from "./useUser.js";
import Onboarding from "./components/onboarding/Onboarding.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";
import TopNav from "./components/TopNav.jsx";
import Home from "./components/Home.jsx";
import MapView from "./components/MapView.jsx";
import DetailView from "./components/DetailView.jsx";
import TopRanking from "./components/TopRanking.jsx";
import Rewards from "./components/Rewards.jsx";
import Planner from "./components/Planner.jsx";
import BusinessDash from "./components/BusinessDash.jsx";
import GovDash from "./components/GovDash.jsx";
import DemoModal from "./components/DemoModal.jsx";
import FloatingAIChat from "./components/FloatingAIChat.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const { user, saveUser, resetUser } = useUser();
  const [lang, setLang] = useState("uz");
  const t = T[lang];
  // A returning business/gov user should land back on their own dashboard,
  // not the tourist home view — both need to seed from the persisted user,
  // not just from the one-time finishOnboarding() call at registration.
  const [view, setView] = useState(() => (user?.role === "business" ? "business" : user?.role === "gov" ? "gov" : "home"));
  const [role, setRole] = useState(() => user?.role || "tourist");
  const [selectedId, setSelectedId] = useState("miraki");
  const [mapFilter, setMapFilter] = useState("all");
  const [onlyTop, setOnlyTop] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notif, setNotif] = useState(true);

  useEffect(() => { setStatsAnimated(true); }, []);

  const place = PLACES.find((p) => p.id === selectedId) || PLACES[0];

  function go(v) {
    setView(v);
    setMenuOpen(false);
    window?.scrollTo?.({ top: 0, behavior: "smooth" });
  }
  function openPlace(id) {
    setSelectedId(id);
    go("detail");
  }

  function finishOnboarding(newUser, openPlaceId) {
    saveUser(newUser);
    setRole(newUser.role);
    if (openPlaceId) openPlace(openPlaceId);
    else go(newUser.role === "business" ? "business" : "home");
  }

  if (!user?.onboarded) {
    return <Onboarding onComplete={finishOnboarding} />;
  }

  return (
    <div className="app-shell" style={{ color: "#0B2B2B", position: "relative", zIndex: 1 }}>
      {/* GovDash paints its own deliberate dark theme — a light ambient photo
          would clash with it, so it's the one view left plain. */}
      {view !== "gov" && <AmbientBackground view={view} />}
      <TopNav t={t} lang={lang} setLang={setLang} view={view} go={go} role={role}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen} setDemoOpen={setDemoOpen} user={user} onLogout={resetUser} />

      {notif && (
        <div className="px-4 py-2 text-center text-sm flex items-center justify-center gap-2 text-white" style={{ background: "#0B2B2B" }}>
          <Sparkles size={14} />
          <span>{NOTIFICATIONS[role]}</span>
          <button onClick={() => setNotif(false)} className="ml-2.5 bg-none border-none cursor-pointer" style={{ color: "#9FE3D8" }}><X size={14} /></button>
        </div>
      )}

      {view === "home" && <Home t={t} lang={lang} go={go} openPlace={openPlace} statsAnimated={statsAnimated} setDemoOpen={setDemoOpen} />}
      {view === "map" && <MapView t={t} lang={lang} openPlace={openPlace} mapFilter={mapFilter} setMapFilter={setMapFilter} onlyTop={onlyTop} setOnlyTop={setOnlyTop} />}
      {view === "detail" && <DetailView t={t} lang={lang} place={place} openPlace={openPlace} />}
      {view === "top" && <TopRanking t={t} lang={lang} openPlace={openPlace} />}
      {view === "rewards" && <Rewards t={t} user={user} />}
      {view === "planner" && <Planner t={t} openPlace={openPlace} />}
      {view === "business" && <BusinessDash t={t} />}
      {view === "gov" && <GovDash t={t} />}

      <Footer t={t} />

      {demoOpen && (
        <DemoModal t={t} step={demoStep} setStep={setDemoStep}
          onClose={() => { setDemoOpen(false); setDemoStep(0); }} openPlace={openPlace} />
      )}

      <FloatingAIChat openPlace={openPlace} />
    </div>
  );
}
