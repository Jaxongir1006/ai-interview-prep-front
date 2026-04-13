import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ApiError, resendVerificationEmail, verifyEmail } from "../lib/api";

type VerificationStatus = "idle" | "verifying" | "verified" | "failed";

function getVerificationErrorMessage(code: string | undefined, error: unknown) {
  switch (code) {
    case "EMAIL_VERIFICATION_TOKEN_INVALID":
      return "This verification link is invalid or has already been used.";
    case "EMAIL_VERIFICATION_TOKEN_EXPIRED":
      return "This verification link has expired. Request a fresh verification email.";
    case "EMAIL_VERIFICATION_EMAIL_MISMATCH":
      return "This verification link no longer matches your account email.";
    default:
      return error instanceof Error
        ? error.message
        : "Unable to verify your email right now.";
  }
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token")?.trim() || "";
  const emailFromUrl = searchParams.get("email")?.trim().toLowerCase() || "";
  const hasAttemptedVerification = useRef(false);

  const [email, setEmail] = useState(emailFromUrl);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [status, setStatus] = useState<VerificationStatus>(
    token ? "verifying" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token || hasAttemptedVerification.current) {
      return;
    }

    hasAttemptedVerification.current = true;
    setStatus("verifying");
    setErrorMessage("");

    verifyEmail({ token })
      .then((result) => {
        setVerifiedEmail(result.email);
        setEmail(result.email);
        setStatus("verified");
        navigate(result.onboarding_required ? "/onboarding" : "/app", {
          replace: true,
        });
      })
      .catch((error) => {
        const code = error instanceof ApiError ? error.code : undefined;
        setErrorMessage(getVerificationErrorMessage(code, error));
        setStatus("failed");

        if (code?.startsWith("EMAIL_VERIFICATION_")) {
          navigate(
            emailFromUrl
              ? `/verify-email?email=${encodeURIComponent(emailFromUrl)}`
              : "/verify-email",
            { replace: true },
          );
        }
      });
  }, [emailFromUrl, navigate, token]);

  const handleResend = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setResendStatus("failed");
      setResendMessage("Enter the email address you used to register.");
      return;
    }

    setResendStatus("sending");
    setResendMessage("");

    try {
      await resendVerificationEmail({ email: normalizedEmail });
      setResendStatus("sent");
      setResendMessage(
        "If that email can be verified, a fresh verification link is on the way.",
      );
    } catch (error) {
      setResendStatus("failed");
      setResendMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend the verification email right now.",
      );
    }
  };

  const isVerifying = status === "verifying";
  const isVerified = status === "verified";
  const isFailed = status === "failed";

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

          <div className="text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isVerified
                  ? "bg-green-500/20"
                  : isFailed
                    ? "bg-destructive/15"
                    : "bg-blue-500/15"
              }`}
            >
              {isVerifying ? (
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              ) : isVerified ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : isFailed ? (
                <AlertCircle className="w-8 h-8 text-destructive" />
              ) : (
                <MailCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-3">
              {isVerifying
                ? "Verifying your email"
                : isVerified
                  ? "Email verified"
                  : isFailed
                    ? "Verification failed"
                    : "Verify your email"}
            </h1>

            <p className="text-muted-foreground mb-8">
              {isVerifying
                ? "Hold on while we confirm your verification link."
                : isVerified
                  ? `Your account${verifiedEmail ? ` for ${verifiedEmail}` : ""} is ready.`
                  : isFailed
                    ? errorMessage
                    : email
                      ? `We sent a verification link to ${email}. Open the message and confirm your account before signing in.`
                      : "Open the verification link from your email to confirm your account before signing in."}
            </p>
          </div>

          {!isVerified ? (
            <>
              <div className="space-y-4 mb-8">
                <div className="rounded-xl border border-border bg-accent/40 p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">It can take a minute or two</p>
                      <p className="text-sm text-muted-foreground">
                        If you do not see the email soon, check your spam or
                        promotions folder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-accent/40 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Why this step matters</p>
                      <p className="text-sm text-muted-foreground">
                        Email verification protects your account and unlocks
                        the authenticated experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleResend} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="verification-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="verification-email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="pl-10"
                      maxLength={255}
                      required
                    />
                  </div>
                </div>

                {resendMessage ? (
                  <p
                    className={`text-sm ${
                      resendStatus === "sent"
                        ? "text-green-600 dark:text-green-400"
                        : "text-destructive"
                    }`}
                  >
                    {resendMessage}
                  </p>
                ) : null}

                <Button
                  variant="outline"
                  type="submit"
                  className="w-full"
                  disabled={resendStatus === "sending" || isVerifying}
                >
                  {resendStatus === "sending" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Resend Verification Email
                </Button>
              </form>
            </>
          ) : null}

          <div className="space-y-3">
            {isVerified ? (
              <Link
                to="/onboarding"
                state={{
                  message: "Choose your interview focus before signing in.",
                }}
                className="block"
              >
                <Button className="w-full" size="lg">
                  Personalize Interview Prep
                </Button>
              </Link>
            ) : null}
            <Link to="/login" className="block">
              <Button
                className="w-full"
                size="lg"
                disabled={isVerifying}
                variant={isVerified ? "outline" : "default"}
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </Card>

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
