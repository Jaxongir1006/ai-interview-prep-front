const ACCESS_TOKEN_KEY = "auth.access_token";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "auth.access_token_expires_at";
const REFRESH_TOKEN_KEY = "auth.refresh_token";
const REFRESH_TOKEN_EXPIRES_AT_KEY = "auth.refresh_token_expires_at";

export type LoginResponse = {
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
};

export function saveSession(session: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
  localStorage.setItem(
    ACCESS_TOKEN_EXPIRES_AT_KEY,
    session.access_token_expires_at,
  );
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
  localStorage.setItem(
    REFRESH_TOKEN_EXPIRES_AT_KEY,
    session.refresh_token_expires_at,
  );
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function isFutureTimestamp(value: string | null) {
  if (!value) {
    return false;
  }

  const expiresAtMs = Date.parse(value);

  if (Number.isNaN(expiresAtMs)) {
    return false;
  }

  return expiresAtMs > Date.now();
}

export function hasValidAccessToken() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return false;
  }

  return isFutureTimestamp(localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY));
}

export function hasValidRefreshToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  return isFutureTimestamp(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
}

export function hasSession() {
  return hasValidAccessToken() || hasValidRefreshToken();
}
