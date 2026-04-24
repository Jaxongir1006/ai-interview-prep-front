import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  hasValidAccessToken,
  hasValidRefreshToken,
  type LoginResponse,
  saveSession,
} from "./auth";
import { notifyApiError, notifyAuthExpired } from "./api-events";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
let refreshSessionPromise: Promise<string> | null = null;

type ApiErrorPayload = {
  trace_id?: string;
  code?: string;
  message?: string;
  error?:
    | string
    | {
        code?: string;
        message?: string;
        cause?: string;
        fields?: Record<string, string>;
        details?: Record<string, unknown>;
      };
  fields?: Record<string, string>;
  details?: string;
};

export class ApiError extends Error {
  code?: string;
  fields?: Record<string, string>;
  status: number;
  traceId?: string;

  constructor(
    message: string,
    status: number,
    code?: string,
    options: { fields?: Record<string, string>; traceId?: string } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = options.fields;
    this.traceId = options.traceId;
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
  target_role: string;
  experience_level: string;
  preferred_topics: string[];
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

export type RequestPasswordResetRequest = {
  email: string;
};

export type ConfirmPasswordResetRequest = {
  token: string;
  password: string;
};

export type PasswordResetResponse = {
  message: string;
};

export type CurrentUserResponse = {
  user: {
    id: string;
    username: string | null;
    email: string | null;
    phone_number: string | null;
    is_verified: boolean;
    is_active: boolean;
    last_login_at: string | null;
    last_active_at: string | null;
    created_at: string;
    updated_at: string;
    oauth_providers: string[];
  };
  profile: {
    id: number;
    user_id: string;
    full_name: string | null;
    bio: string | null;
    location: string | null;
    target_role: string;
    experience_level: string;
    interview_goal_per_week: number;
    preferred_topics: string[];
    onboarding_completed: boolean;
    onboarding_completed_at: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  progress_summary: {
    current_streak: number;
    longest_streak: number;
    total_interviews_taken: number;
    total_time_spent_seconds: number;
    average_score: number;
    last_interview_at: string | null;
  } | null;
  avatar: {
    file_id: string;
    original_filename: string;
    mime_type: string;
    size_bytes: number;
    download_url: string;
  } | null;
};

export type ChangeMyPasswordRequest = {
  current_password: string;
  new_password: string;
};

export type AuthSession = {
  id: number;
  user_id: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
  ip_address: string;
  user_agent: string;
  last_used_at: string;
  created_at: string;
  updated_at: string;
};

export type GetMySessionsResponse = {
  content: AuthSession[];
};

export type DeleteMySessionRequest = {
  session_id: number;
};

export type OnboardingCatalogOption = {
  key: string;
  name: string;
  description: string | null;
  display_order: number;
};

export type OnboardingTopicOption = OnboardingCatalogOption & {
  category: string | null;
  target_role_keys: string[];
};

export type OnboardingOptionsResponse = {
  target_roles: OnboardingCatalogOption[];
  experience_levels: OnboardingCatalogOption[];
  topics: OnboardingTopicOption[];
};

export type DashboardRange = "7d" | "30d" | "90d" | "all";

export type DashboardTopicRef = {
  id: string;
  name: string;
};

export type DashboardOverviewResponse = {
  user: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    target_role: DashboardTopicRef | null;
    experience_level: DashboardTopicRef | null;
  };
  stats: {
    total_interviews: {
      value: number;
      delta_percent: number;
      delta_direction: "up" | "down" | "flat" | "new";
    };
    average_score: {
      value: number | null;
      delta_percent: number;
      delta_direction: "up" | "down" | "flat" | "new";
    };
    current_streak_days: {
      value: number;
      is_record: boolean;
    };
    total_practice_seconds: {
      value: number;
      delta_percent: number;
      delta_direction: "up" | "down" | "flat" | "new";
    };
  };
  performance: {
    range: DashboardRange;
    summary: {
      average_score: number | null;
      score_delta_percent: number;
      interviews_completed: number;
      practice_seconds: number;
    };
    points: Array<{
      date: string;
      label: string;
      average_score: number | null;
      interviews_completed: number;
      practice_seconds: number;
    }>;
  };
  topics: {
    items: Array<{
      id: string;
      name: string;
      score: number | null;
      questions_answered: number;
      correctness_rate: number | null;
      average_time_seconds: number | null;
      trend: "up" | "down" | "flat" | "new";
      level: "strong" | "stable" | "needs_practice";
    }>;
    weak: Array<{
      id: string;
      name: string;
      score: number | null;
      questions_answered: number;
      reason: string;
      recommended_action: string;
    }>;
    strong: Array<{
      id: string;
      name: string;
      score: number | null;
      questions_answered: number;
      reason: string;
    }>;
  };
  recent_activity: {
    items: Array<{
      session_id: string;
      title: string;
      status: "in_progress" | "completed" | "abandoned" | "scoring";
      score: number | null;
      started_at: string;
      completed_at: string | null;
      duration_seconds: number;
      question_count: number;
      answered_count: number;
      topics: DashboardTopicRef[];
    }>;
    next_cursor: string | null;
  };
  recommendations: {
    recommended_topics: Array<{
      id: string;
      name: string;
      priority: "low" | "medium" | "high";
      reason: string;
    }>;
    next_interview: {
      target_role: DashboardTopicRef | null;
      experience_level: DashboardTopicRef | null;
      topics: DashboardTopicRef[];
      difficulty: "easy" | "medium" | "hard" | "mixed";
      question_count: number;
      estimated_duration_seconds: number;
    };
  };
};

type RefreshTokenRequest = {
  refresh_token: string;
};

function isAuthError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return false;
  }

  return error.status === 401 || error.code === "UNAUTHORIZED";
}

function shouldNotifyGlobalError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return true;
  }

  if (error.status === 403 || error.status >= 500) {
    return true;
  }

  return false;
}

function getErrorObject(payload: ApiErrorPayload | null) {
  if (!payload || !payload.error || typeof payload.error === "string") {
    return null;
  }

  return payload.error;
}

function extractApiError(
  payload: ApiErrorPayload | null,
  status: number,
) {
  const errorObject = getErrorObject(payload);
  const code = errorObject?.code || payload?.code;
  const message =
    errorObject?.message ||
    payload?.message ||
    (typeof payload?.error === "string" ? payload.error : undefined) ||
    code ||
    `Request failed with status ${status}`;
  const fields = errorObject?.fields || payload?.fields;

  return {
    code,
    message,
    fields,
    traceId: payload?.trace_id,
  };
}

function getGlobalErrorMessage(error: ApiError) {
  if (error.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error.status >= 500) {
    return "Something went wrong on the server. Try again later.";
  }

  return error.message;
}

async function request<TResponse>(
  path: string,
  init: RequestInit,
  options: { suppressGlobalError?: boolean } = {},
): Promise<TResponse> {
  if (!API_URL) {
    throw new Error("Missing VITE_API_URL configuration.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch (error) {
    if (!options.suppressGlobalError) {
      notifyApiError({
        code: "NETWORK_ERROR",
        message: "Unable to reach the server. Check your connection and try again.",
      });
    }

    throw error;
  }

  const text = await response.text();
  const data = parseJson<TResponse | ApiErrorPayload>(text);

  if (!response.ok) {
    const errorData = extractApiError(data as ApiErrorPayload | null, response.status);
    const apiError = new ApiError(errorData.message, response.status, errorData.code, {
      fields: errorData.fields,
      traceId: errorData.traceId,
    });

    if (!options.suppressGlobalError && shouldNotifyGlobalError(apiError)) {
      notifyApiError({
        code: apiError.code || "API_ERROR",
        message: getGlobalErrorMessage(apiError),
        status: apiError.status,
      });
    }

    throw apiError;
  }

  return data as TResponse;
}

async function runRefreshSession() {
  const refreshToken = getRefreshToken();

  if (!refreshToken || !hasValidRefreshToken()) {
    clearSession();
    notifyAuthExpired();
    throw new ApiError(
      "Your session has expired. Sign in again.",
      401,
      "UNAUTHORIZED",
    );
  }

  try {
    const session = await request<LoginResponse>(
      "/api/v1/auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({
          refresh_token: refreshToken,
        } satisfies RefreshTokenRequest),
      },
      { suppressGlobalError: true },
    );

    saveSession(session);

    return session.access_token;
  } catch (error) {
    if (isAuthError(error)) {
      clearSession();
      notifyAuthExpired();
    }

    throw error;
  }
}

async function refreshSession() {
  refreshSessionPromise ??= runRefreshSession().finally(() => {
    refreshSessionPromise = null;
  });

  return refreshSessionPromise;
}

async function authenticatedRequest<TResponse>(
  path: string,
  init: RequestInit,
): Promise<TResponse> {
  let accessToken = getAccessToken();

  if (!accessToken || !hasValidAccessToken()) {
    accessToken = await refreshSession();
  }

  try {
    return await request<TResponse>(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init.headers ?? {}),
      },
    });
  } catch (error) {
    if (!isAuthError(error)) {
      throw error;
    }

    const refreshedAccessToken = await refreshSession();

    try {
      return await request<TResponse>(path, {
        ...init,
        headers: {
          Authorization: `Bearer ${refreshedAccessToken}`,
          ...(init.headers ?? {}),
        },
      });
    } catch (retryError) {
      if (isAuthError(retryError)) {
        clearSession();
        notifyAuthExpired();
      }

      throw retryError;
    }
  }
}

export async function registerUser(payload: RegisterRequest) {
  return request<RegisterResponse>(
    "/api/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { suppressGlobalError: true },
  );
}

export async function loginUser(payload: LoginRequest) {
  const session = await request<LoginResponse>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { suppressGlobalError: true },
  );

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
    { suppressGlobalError: true },
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
    { suppressGlobalError: true },
  );

  clearSession();
  saveSession(session);

  return session;
}

export async function verifyEmail(payload: VerifyEmailRequest) {
  const session = await request<VerifyEmailResponse>(
    "/api/v1/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { suppressGlobalError: true },
  );

  clearSession();
  saveSession(session);

  return session;
}

export async function resendVerificationEmail(
  payload: ResendVerificationEmailRequest,
) {
  await request<unknown>(
    "/api/v1/auth/resend-verification-email",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { suppressGlobalError: true },
  );
}

export async function requestPasswordReset(
  payload: RequestPasswordResetRequest,
) {
  return request<PasswordResetResponse>(
    "/api/v1/auth/request-password-reset",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { suppressGlobalError: true },
  );
}

export async function confirmPasswordReset(
  payload: ConfirmPasswordResetRequest,
) {
  return request<PasswordResetResponse>(
    "/api/v1/auth/confirm-password-reset",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { suppressGlobalError: true },
  );
}

export async function logoutUser() {
  await authenticatedRequest<unknown>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  return authenticatedRequest<CurrentUserResponse>("/api/v1/auth/get-me", {
    method: "GET",
  });
}

export async function changeMyPassword(payload: ChangeMyPasswordRequest) {
  await authenticatedRequest<unknown>("/api/v1/auth/change-my-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMySessions() {
  return authenticatedRequest<GetMySessionsResponse>(
    "/api/v1/auth/get-my-sessions",
    {
      method: "GET",
    },
  );
}

export async function deleteMySession(payload: DeleteMySessionRequest) {
  await authenticatedRequest<unknown>("/api/v1/auth/delete-my-session", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOnboardingOptions() {
  return authenticatedRequest<OnboardingOptionsResponse>(
    "/api/v1/interview/get-onboarding-options",
    {
      method: "GET",
    },
  );
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

export async function getDashboardOverview(range: DashboardRange = "7d") {
  return authenticatedRequest<DashboardOverviewResponse>(
    `/api/v1/dashboard/overview?range=${encodeURIComponent(range)}`,
    {
      method: "GET",
    },
  );
}
