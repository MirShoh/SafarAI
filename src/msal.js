import { PublicClientApplication } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;

export const isMicrosoftConfigured = Boolean(clientId);

let pcaPromise = null;
function getMsal() {
  if (!pcaPromise) {
    const pca = new PublicClientApplication({
      auth: {
        clientId,
        authority: "https://login.microsoftonline.com/common",
        redirectUri: window.location.origin,
      },
      cache: { cacheLocation: "localStorage" },
    });
    pcaPromise = pca.initialize().then(() => pca);
  }
  return pcaPromise;
}

// Popup sign-in; returns basic profile pulled straight off the ID token
// claims (no extra Graph call needed for just a name + email).
export async function signInWithMicrosoft() {
  if (!isMicrosoftConfigured) {
    throw new Error("Microsoft hisobi ulanmagan — .env faylida VITE_MICROSOFT_CLIENT_ID yo'q.");
  }
  const pca = await getMsal();
  const result = await pca.loginPopup({ scopes: ["User.Read"] });
  const fullName = result.account?.name || "";
  const [firstName, ...rest] = fullName.split(" ").filter(Boolean);
  return {
    firstName: firstName || fullName || "Foydalanuvchi",
    lastName: rest.join(" "),
    email: result.account?.username || "",
  };
}
