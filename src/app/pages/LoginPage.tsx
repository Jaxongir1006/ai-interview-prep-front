import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Brain, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import AuthSocialButtons from "../components/AuthSocialButtons";
import AuthFormError from "../components/AuthFormError";
import { ApiError, completeOnboarding, loginUser } from "../lib/api";
import {
  getAuthFieldErrors,
  getAuthRequestErrorMessage,
  hasAuthFieldErrors,
  type AuthFieldErrors,
} from "../lib/auth-form-errors";
import {
  clearPendingOnboarding,
  getPendingOnboarding,
} from "../lib/onboarding";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorTraceId, setErrorTraceId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/app";
  const infoMessage =
    (location.state as { message?: string } | null)?.message || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setErrorCode("");
    setErrorTraceId("");
    setFieldErrors({});
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      await loginUser({
        email: normalizedEmail,
        password,
      });

      const pendingOnboarding = getPendingOnboarding();

      if (pendingOnboarding) {
        await completeOnboarding(pendingOnboarding);
        clearPendingOnboarding();
        navigate("/app", { replace: true });
        return;
      }

      navigate(fromPath, { replace: true });
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const code = apiError?.code;
      const nextFieldErrors = getAuthFieldErrors(apiError?.fields);

      setErrorCode(code || "");
      setErrorTraceId(apiError?.traceId || "");
      setFieldErrors(nextFieldErrors);
      setErrorMessage(
        getLoginErrorMessage(code, error, hasAuthFieldErrors(nextFieldErrors)),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialError = (message: string) => {
    setErrorCode("");
    setErrorTraceId("");
    setFieldErrors({});
    setErrorMessage(message);
  };

  const updateEmail = (value: string) => {
    setEmail(value);
    setFieldErrors((current) => ({ ...current, email: undefined }));
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    setFieldErrors((current) => ({ ...current, password: undefined }));
  };

  const verificationAction =
    errorCode === "EMAIL_NOT_VERIFIED"
      ? {
          label: "Resend verification email",
          to: `/verify-email?email=${encodeURIComponent(
            email.trim().toLowerCase(),
          )}`,
        }
      : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-2xl">InterviewAI</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to continue your interview preparation
            </p>
          </div>

          {infoMessage ? (
            <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
              {infoMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => updateEmail(e.target.value)}
                  className="pl-10"
                  maxLength={255}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  required
                />
              </div>
              {fieldErrors.email ? (
                <p id="email-error" className="text-sm text-destructive">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/password-reset"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => updatePassword(e.target.value)}
                  className="pl-10 pr-10"
                  minLength={8}
                  maxLength={72}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password ? (
                <p id="password-error" className="text-sm text-destructive">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {errorMessage ? (
              <AuthFormError
                action={verificationAction}
                message={errorMessage}
                title="Sign-in failed"
                traceId={errorTraceId}
              />
            ) : null}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <AuthSocialButtons
            disabled={isSubmitting}
            onError={handleSocialError}
            returnTo={fromPath}
          />

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function getLoginErrorMessage(
  code: string | undefined,
  error: unknown,
  hasFieldErrors: boolean,
) {
  switch (code) {
    case "INCORRECT_CREDENTIALS":
    case "INVALID_CREDENTIALS":
    case "INVALID_LOGIN_CREDENTIALS":
      return "Invalid email or password.";
    case "EMAIL_NOT_VERIFIED":
      return "Verify your email before signing in. You can request a fresh verification link.";
    case "VALIDATION_FAILED":
      if (hasFieldErrors) {
        return "Fix the highlighted fields, then try again.";
      }

      return "Check your email and password, then try again.";
    default:
      return getAuthRequestErrorMessage(error, "Unable to sign in right now.");
  }
}
