import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { AlertCircle, Brain, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { loginWithGithubOAuth, loginWithGoogleOAuth } from "../lib/api";
import {
  readAndClearOAuthState,
  type OAuthProvider,
} from "../lib/oauth";

function getProvider(paramsProvider: string | undefined): OAuthProvider | null {
  return paramsProvider === "github" || paramsProvider === "google"
    ? paramsProvider
    : null;
}

function getHashParams() {
  return new URLSearchParams(window.location.hash.replace(/^#/, ""));
}

function getDestination(returnTo: string, isNewUser: boolean) {
  return isNewUser ? "/onboarding" : returnTo || "/app";
}

export default function OAuthCallbackPage() {
  const { provider: providerParam } = useParams();
  const provider = getProvider(providerParam);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function completeOAuthLogin() {
      try {
        if (!provider) {
          throw new Error("Unsupported OAuth provider.");
        }

        const hashParams = getHashParams();
        const state = searchParams.get("state") || hashParams.get("state");
        const oauthState = readAndClearOAuthState(provider, state);

        if (provider === "github") {
          const code = searchParams.get("code");

          if (!code) {
            throw new Error("Missing GitHub authorization code.");
          }

          const session = await loginWithGithubOAuth({ code });
          navigate(getDestination(oauthState.returnTo, session.is_new_user), {
            replace: true,
          });
          return;
        }

        const idToken = hashParams.get("id_token");

        window.history.replaceState(
          null,
          document.title,
          `${window.location.pathname}${window.location.search}`,
        );

        if (!idToken) {
          throw new Error("Missing Google identity token.");
        }

        const session = await loginWithGoogleOAuth({ id_token: idToken });
        navigate(getDestination(oauthState.returnTo, session.is_new_user), {
          replace: true,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to complete OAuth login.",
        );
      }
    }

    void completeOAuthLogin();
  }, [navigate, provider, searchParams]);

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
                errorMessage ? "bg-destructive/15" : "bg-blue-500/15"
              }`}
            >
              {errorMessage ? (
                <AlertCircle className="w-8 h-8 text-destructive" />
              ) : (
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              )}
            </div>

            <h1 className="text-3xl font-bold mb-3">
              {errorMessage ? "Sign-in failed" : "Completing sign-in"}
            </h1>
            <p className="text-muted-foreground mb-8">
              {errorMessage ||
                "Hold on while we securely finish your OAuth login."}
            </p>

            {errorMessage ? (
              <Link to="/login">
                <Button className="w-full" size="lg">
                  Back to Login
                </Button>
              </Link>
            ) : null}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
