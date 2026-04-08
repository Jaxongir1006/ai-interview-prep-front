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
