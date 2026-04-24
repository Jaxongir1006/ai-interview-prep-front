import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Brain, Mail, Lock, Eye, EyeOff, Loader2, User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import AuthSocialButtons from "../components/AuthSocialButtons";
import AuthFormError from "../components/AuthFormError";
import { ApiError, registerUser } from "../lib/api";
import {
  getAuthFieldErrors,
  getAuthRequestErrorMessage,
  hasAuthFieldErrors,
  type AuthFieldErrors,
} from "../lib/auth-form-errors";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [errorTraceId, setErrorTraceId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setErrorCode("");
    setErrorTraceId("");
    setFieldErrors({});
    setIsSubmitting(true);

    const email = formData.email.trim().toLowerCase();
    const fullName = formData.name.trim();

    try {
      const result = await registerUser({
        email,
        password: formData.password,
        full_name: fullName,
      });

      navigate(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      const code = apiError?.code;
      const nextFieldErrors = getAuthFieldErrors(apiError?.fields);

      setErrorCode(code || "");
      setErrorTraceId(apiError?.traceId || "");
      setFieldErrors(nextFieldErrors);
      setErrorMessage(
        getRegisterErrorMessage(
          code,
          error,
          hasAuthFieldErrors(nextFieldErrors),
        ),
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

  const updateFormValue = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));

    if (field === "name" || field === "email" || field === "password") {
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const verificationAction =
    errorCode === "EMAIL_ALREADY_EXISTS" || errorCode === "EMAIL_CONFLICT"
      ? {
          label: "Resend verification email",
          to: `/verify-email?email=${encodeURIComponent(
            formData.email.trim().toLowerCase(),
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
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Start your interview preparation journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Developer"
                  value={formData.name}
                  onChange={(e) => updateFormValue("name", e.target.value)}
                  className="pl-10"
                  maxLength={255}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  required
                />
              </div>
              {fieldErrors.name ? (
                <p id="name-error" className="text-sm text-destructive">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => updateFormValue("email", e.target.value)}
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormValue("password", e.target.value)}
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
                Must be at least 8 characters
              </p>
              {fieldErrors.password ? (
                <p id="password-error" className="text-sm text-destructive">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  updateFormValue("agreeToTerms", checked === true)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {errorMessage ? (
              <AuthFormError
                action={verificationAction}
                message={errorMessage}
                title="Account creation failed"
                traceId={errorTraceId}
              />
            ) : null}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!formData.agreeToTerms || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account
                </>
              ) : (
                "Create Account"
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
            disabled={!formData.agreeToTerms || isSubmitting}
            onError={handleSocialError}
            returnTo="/onboarding"
          />

          {/* Sign In Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign in
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

function getRegisterErrorMessage(
  code: string | undefined,
  error: unknown,
  hasFieldErrors: boolean,
) {
  switch (code) {
    case "EMAIL_CONFLICT":
    case "EMAIL_ALREADY_EXISTS":
      return "An account already exists for this email. If you have not verified it yet, request a fresh verification email.";
    case "VALIDATION_FAILED":
      if (hasFieldErrors) {
        return "Fix the highlighted fields, then try again.";
      }

      return "Check your name, email, and password, then try again.";
    default:
      return getAuthRequestErrorMessage(
        error,
        "Unable to create your account right now.",
      );
  }
}
