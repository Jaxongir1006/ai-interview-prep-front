import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Brain, MailCheck, Clock, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email")?.trim();

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
            <div className="w-16 h-16 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-6">
              <MailCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h1 className="text-3xl font-bold mb-3">Verify your email</h1>
            <p className="text-muted-foreground mb-8">
              {email ? (
                <>
                  We sent a verification link to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                </>
              ) : (
                "We sent a verification link to your email address."
              )}{" "}
              Open the message and confirm your account before signing in.
            </p>
          </div>

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
                    Email verification protects your account and unlocks the
                    authenticated experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/login" className="block">
              <Button className="w-full" size="lg">
                Back to Login
              </Button>
            </Link>

            <Button variant="outline" type="button" className="w-full" disabled>
              Resend Verification Email
            </Button>
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
