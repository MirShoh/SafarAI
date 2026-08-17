import { useCallback, useState } from "react";

const STORAGE_KEY = "safarai_user";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}
function persist(user) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable */ }
}

// Registration/onboarding state, kept in localStorage so a returning visitor
// skips straight past the role/profile/questionnaire flow.
export function useUser() {
  const [user, setUser] = useState(load);

  const saveUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      persist(next);
      return next;
    });
  }, []);

  const resetUser = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  return { user, saveUser, resetUser };
}
