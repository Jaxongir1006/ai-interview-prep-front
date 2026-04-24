import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  Brain,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import AuthFormError from "../components/AuthFormError";
import {
  ApiError,
  confirmPasswordReset,
  requestPasswordReset,
} from "../lib/api";
import {
  getAuthFieldErrors,
  getAuthRequestErrorMessage,
  type AuthFieldErrors,
} from "../lib/auth-form-errors";

function getPasswordResetErrorMessage(code: string | undefined, error: unknown) {
  switch (code) {
    case "PASSWORD_RESET_TOKEN_INVALID":
      return "This password reset link is invalid or has expired. Request a new reset link.";
    case "VALIDATION_FAILED":
      return "Fix the highlighted fields, then try again.";
    default:
      return getAuthRequestErrorMessage(
        error,
        "Unable to reset your password right now.",
      );
  }
}

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token")?.trim() || "";
  const isConfirmMode = Boolean(token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTraceId, setErrorTraceId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const resetErrorState = () => {
    setErrorMessage("");
    setErrorTraceId("");
    setFieldErrors({});
  };

  const handleRequestSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetErrorState();
    setIsSubmitting(true);

    try {
      const result = await requestPasswordReset({
        email: email.trim().toLowerCase(),
      });

      setSuccessMessage(result.message);
      setSubmitted(true);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;

      setFieldErrors(getAuthFieldErrors(apiError?.fields));
      setErrorTraceId(apiError?.traceId || "");
      setErrorMessage(getPasswordResetErrorMessage(apiError?.code, error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetErrorState();

    if (password !== confirmPassword) {
      setFieldErrors({
        password: "Passwords do not match.",
      });
      setErrorMessage("Fix the highlighted fields, then try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await confirmPasswordReset({
        token,
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: result.message,
        },
      });
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;

      setFieldErrors(getAuthFieldErrors(apiError?.fields));
      setErrorTraceId(apiError?.traceId || "");
      setErrorMessage(getPasswordResetErrorMessage(apiError?.code, error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEmail = (value: string) => {
    setEmail(value);
    setFieldErrors((current) => ({ ...current, email: undefined }));
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    setFieldErrors((current) => ({ ...current, password: undefined }));
  };

  const updateConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    setFieldErrors((current) => ({ ...current, password: undefined }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-2xl">InterviewAI</span>
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Check your email</h2>
              <p className="text-muted-foreground mb-8">
                {successMessage || "If that email can receive password reset instructions, a reset link is on the way."}
              </p>
              <Link to="/login">
                <Button className="w-full" size="lg">
                  Back to Login
                </Button>
              </Link>
            </motion.div>
          ) : isConfirmMode ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Choose a new password</h1>
                <p className="text-muted-foreground">
                  Enter a new password for your account.
                </p>
              </div>

              <form onSubmit={handleConfirmSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => updatePassword(event.target.value)}
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
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(event) =>
                        updateConfirmPassword(event.target.value)
                      }
                      className="pl-10"
                      minLength={8}
                      maxLength={72}
                      aria-invalid={Boolean(fieldErrors.password)}
                      required
                    />
                  </div>
                  {fieldErrors.password ? (
                    <p id="password-error" className="text-sm text-destructive">
                      {fieldErrors.password}
                    </p>
                  ) : null}
                </div>

                {errorMessage ? (
                  <AuthFormError
                    message={errorMessage}
                    title="Password reset failed"
                    traceId={errorTraceId}
                  />
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting password
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
                <p className="text-muted-foreground">
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(event) => updateEmail(event.target.value)}
                      className="pl-10"
                      maxLength={255}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? "email-error" : undefined
                      }
                      required
                    />
                  </div>
                  {fieldErrors.email ? (
                    <p id="email-error" className="text-sm text-destructive">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                {errorMessage ? (
                  <AuthFormError
                    message={errorMessage}
                    title="Password reset failed"
                    traceId={errorTraceId}
                  />
                ) : null}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending reset link
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          )}
        </Card>

        {!submitted ? (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to login
            </Link>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
