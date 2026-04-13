import {
  clearSession,
  getAccessToken,
  type LoginResponse,
  saveSession,
} from "./auth";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

type ApiErrorPayload = {
  code?: string;
  message?: string;
  error?: string;
  details?: string;
};

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function parseJson<T>(text: string): T | null {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export type RegisterRequest = {
  email: string;
  password: string;
  full_name: string;
};

export type RegisterResponse = {
  email: string;
  verification_required: true;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type OAuthLoginResponse = LoginResponse & {
  is_new_user: boolean;
};

export type GithubOAuthLoginRequest = {
  code: string;
};

export type GoogleOAuthLoginRequest = {
  id_token: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type VerifyEmailResponse = {
  user_id: string;
  email: string;
  is_verified: true;
  onboarding_required: boolean;
} & LoginResponse;

export type CompleteOnboardingRequest = {
  target_role: "python" | "golang" | "javascript";
  experience_level: "junior" | "mid" | "senior";
  preferred_topics: Array<"Algorithms" | "System Design" | "Database Design">;
};

export type CompleteOnboardingResponse = {
  profile: {
    id: number;
    user_id: string;
    full_name: string;
    target_role: string;
    experience_level: string;
    preferred_topics: string[];
    onboarding_completed: true;
    onboarding_completed_at: string;
  };
};

export type ResendVerificationEmailRequest = {
  email: string;
};

async function request<TResponse>(
  path: string,
  init: RequestInit,
): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("Missing VITE_API_URL configuration.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = parseJson<TResponse | ApiErrorPayload>(text);

  if (!response.ok) {
    const code = (data as ApiErrorPayload | null)?.code;
    const errorMessage =
      (data as ApiErrorPayload | null)?.message ||
      (data as ApiErrorPayload | null)?.error ||
      (data as ApiErrorPayload | null)?.details ||
      code ||
      `Request failed with status ${response.status}`;

    throw new ApiError(errorMessage, response.status, code);
  }

  return data as TResponse;
}

async function authenticatedRequest<TResponse>(
  path: string,
  init: RequestInit,
): Promise<TResponse> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Missing authenticated session.");
  }

  return request<TResponse>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers ?? {}),
    },
  });
}

export async function registerUser(payload: RegisterRequest) {
  return request<RegisterResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginRequest) {
  const session = await request<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  clearSession();
  saveSession(session);

  return session;
}

export async function loginWithGithubOAuth(payload: GithubOAuthLoginRequest) {
  const session = await request<OAuthLoginResponse>(
    "/api/v1/auth/github-oauth-login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  clearSession();
  saveSession(session);

  return session;
}

export async function loginWithGoogleOAuth(payload: GoogleOAuthLoginRequest) {
  const session = await request<OAuthLoginResponse>(
    "/api/v1/auth/google-oauth-login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  clearSession();
  saveSession(session);

  return session;
}

export async function verifyEmail(payload: VerifyEmailRequest) {
  const session = await request<VerifyEmailResponse>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  clearSession();
  saveSession(session);

  return session;
}

export async function resendVerificationEmail(
  payload: ResendVerificationEmailRequest,
) {
  await request<unknown>("/api/v1/auth/resend-verification-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function completeOnboarding(payload: CompleteOnboardingRequest) {
  return authenticatedRequest<CompleteOnboardingResponse>(
    "/api/v1/me/complete-onboarding",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
