import { ApiError } from "./api";

export type AuthFieldName = "name" | "email" | "password";
export type AuthFieldErrors = Partial<Record<AuthFieldName, string>>;

const fieldAliases: Record<string, AuthFieldName> = {
  full_name: "name",
  name: "name",
  email: "email",
  password: "password",
};

export function getAuthFieldErrors(
  fields: Record<string, string> | undefined,
) {
  const fieldErrors: AuthFieldErrors = {};

  if (!fields) {
    return fieldErrors;
  }

  for (const [field, message] of Object.entries(fields)) {
    const normalizedField = fieldAliases[field];

    if (normalizedField && message) {
      fieldErrors[normalizedField] = message;
    }
  }

  return fieldErrors;
}

export function hasAuthFieldErrors(fieldErrors: AuthFieldErrors) {
  return Object.values(fieldErrors).some(Boolean);
}

export function getAuthRequestErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return "Unable to reach the server. Check your connection and try again later.";
  }

  if (error instanceof Error) {
    if (error.message.includes("VITE_API_URL")) {
      return "Authentication is not configured. Set VITE_API_URL and restart the app.";
    }

    return error.message;
  }

  return fallback;
}
