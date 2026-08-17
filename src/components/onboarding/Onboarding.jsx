import { useState } from "react";
import RoleSelect from "./RoleSelect.jsx";
import TouristProfileForm from "./TouristProfileForm.jsx";
import BusinessProfileForm from "./BusinessProfileForm.jsx";
import AIQuestionnaire from "./AIQuestionnaire.jsx";
import Recommendations from "./Recommendations.jsx";

// Orchestrates the registration flow: role -> profile -> (tourist only) AI
// questionnaire -> recommendations. Businesses skip straight to their
// dashboard once profiled, since the AI trip-questionnaire is tourist-only.
export default function Onboarding({ onComplete }) {
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recs, setRecs] = useState(null);

  if (!role) {
    return <RoleSelect onSelect={setRole} />;
  }

  if (!profile) {
    if (role === "business") {
      return <BusinessProfileForm onSubmit={(p) => { setProfile(p); onComplete({ role, profile: p, onboarded: true }); }} />;
    }
    return <TouristProfileForm onSubmit={setProfile} />;
  }

  if (role === "tourist" && !recs) {
    return <AIQuestionnaire onFinish={setRecs} />;
  }

  if (role === "tourist" && recs) {
    return (
      <Recommendations
        reply={recs.reply}
        placeIds={recs.placeIds}
        onOpenPlace={(placeId) => onComplete({ role, profile, preferences: recs.answers, onboarded: true }, placeId)}
        onSkip={() => onComplete({ role, profile, preferences: recs.answers, onboarded: true })}
      />
    );
  }

  return null;
}
