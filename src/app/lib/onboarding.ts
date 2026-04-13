import type { CompleteOnboardingRequest } from "./api";

const PENDING_ONBOARDING_KEY = "onboarding.pending_preferences";

export type OnboardingPreferences = CompleteOnboardingRequest;

export function savePendingOnboarding(preferences: OnboardingPreferences) {
  localStorage.setItem(PENDING_ONBOARDING_KEY, JSON.stringify(preferences));
}

export function getPendingOnboarding() {
  const rawPreferences = localStorage.getItem(PENDING_ONBOARDING_KEY);

  if (!rawPreferences) {
    return null;
  }

  try {
    return JSON.parse(rawPreferences) as OnboardingPreferences;
  } catch {
    return null;
  }
}

export function clearPendingOnboarding() {
  localStorage.removeItem(PENDING_ONBOARDING_KEY);
}
