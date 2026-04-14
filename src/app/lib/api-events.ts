export const API_ERROR_EVENT = "interview-platform:api-error";
export const AUTH_EXPIRED_EVENT = "interview-platform:auth-expired";

export type ApiErrorEventDetail = {
  code: string;
  message: string;
  status?: number;
};

export function notifyApiError(detail: ApiErrorEventDetail) {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail }));
}

export function notifyAuthExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}
