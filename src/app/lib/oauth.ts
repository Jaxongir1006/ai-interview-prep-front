export type OAuthProvider = "github" | "google";

type OAuthStateRecord = {
  state: string;
  returnTo: string;
  nonce?: string;
  createdAt: number;
};

const STATE_TTL_MS = 10 * 60 * 1000;

function getStateKey(provider: OAuthProvider) {
  return `oauth.${provider}.state`;
}

function getRedirectOrigin() {
  return (
    import.meta.env.VITE_OAUTH_REDIRECT_ORIGIN?.replace(/\/$/, "") ||
    window.location.origin
  );
}

function createRandomValue() {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

function createState(provider: OAuthProvider, returnTo: string) {
  const record: OAuthStateRecord = {
    state: createRandomValue(),
    returnTo,
    nonce: provider === "google" ? createRandomValue() : undefined,
    createdAt: Date.now(),
  };

  sessionStorage.setItem(getStateKey(provider), JSON.stringify(record));

  return record;
}

export function readAndClearOAuthState(
  provider: OAuthProvider,
  receivedState: string | null,
) {
  const key = getStateKey(provider);
  const rawRecord = sessionStorage.getItem(key);

  sessionStorage.removeItem(key);

  if (!rawRecord || !receivedState) {
    throw new Error("OAuth session expired. Please try again.");
  }

  let record: OAuthStateRecord;

  try {
    record = JSON.parse(rawRecord) as OAuthStateRecord;
  } catch {
    throw new Error("OAuth session could not be verified. Please try again.");
  }

  if (record.state !== receivedState) {
    throw new Error("OAuth state mismatch. Please try again.");
  }

  if (Date.now() - record.createdAt > STATE_TTL_MS) {
    throw new Error("OAuth session expired. Please try again.");
  }

  return record;
}

export function startGithubOAuth(returnTo: string) {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

  if (!clientId) {
    throw new Error("Missing VITE_GITHUB_CLIENT_ID configuration.");
  }

  const state = createState("github", returnTo);
  const redirectUri = `${getRedirectOrigin()}/oauth/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state: state.state,
  });

  window.location.assign(`https://github.com/login/oauth/authorize?${params}`);
}

export function startGoogleOAuth(returnTo: string) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID configuration.");
  }

  const state = createState("google", returnTo);
  const redirectUri = `${getRedirectOrigin()}/oauth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "id_token",
    scope: "openid email profile",
    prompt: "select_account",
    state: state.state,
    nonce: state.nonce || "",
  });

  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
