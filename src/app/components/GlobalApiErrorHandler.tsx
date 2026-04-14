import { useEffect } from "react";
import { toast } from "sonner";
import {
  API_ERROR_EVENT,
  AUTH_EXPIRED_EVENT,
  type ApiErrorEventDetail,
} from "../lib/api-events";

function isApiErrorEvent(event: Event): event is CustomEvent<ApiErrorEventDetail> {
  return "detail" in event;
}

function isPublicAuthPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-email" ||
    pathname === "/password-reset" ||
    pathname.startsWith("/oauth/")
  );
}

export default function GlobalApiErrorHandler() {
  useEffect(() => {
    const handleApiError = (event: Event) => {
      if (!isApiErrorEvent(event)) {
        return;
      }

      toast.error(event.detail.message);
    };

    const handleAuthExpired = () => {
      toast.error("Your session expired. Sign in again to continue.");

      if (!isPublicAuthPath(window.location.pathname)) {
        window.setTimeout(() => {
          window.location.assign("/login");
        }, 600);
      }
    };

    window.addEventListener(API_ERROR_EVENT, handleApiError);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(API_ERROR_EVENT, handleApiError);
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  return null;
}
