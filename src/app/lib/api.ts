import { clearSession, type LoginResponse, saveSession } from "./auth";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

type ApiErrorPayload = {
  code?: string;
  message?: string;
  error?: string;
  details?: string;
};

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
  user: {
    id: string;
    email: string;
    phone_number: string | null;
    is_verified: boolean;
    is_active: boolean;
    last_login_at: string | null;
    last_active_at: string | null;
    created_at: string;
    updated_at: string;
  };
  profile: {
    id: number;
    user_id: string;
    full_name: string;
    bio: string | null;
    location: string | null;
    target_role: string | null;
    experience_level: string | null;
    interview_goal_per_week: number;
    preferred_topics: string[];
    created_at: string;
    updated_at: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type VerifyEmailResponse = {
  user_id: string;
  email: string;
  is_verified: true;
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
    const errorMessage =
      (data as ApiErrorPayload | null)?.message ||
      (data as ApiErrorPayload | null)?.error ||
      (data as ApiErrorPayload | null)?.details ||
      (data as ApiErrorPayload | null)?.code ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data as TResponse;
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

export async function verifyEmail(payload: VerifyEmailRequest) {
  return request<VerifyEmailResponse>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerificationEmail(
  payload: ResendVerificationEmailRequest,
) {
  await request<unknown>("/api/v1/auth/resend-verification-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
