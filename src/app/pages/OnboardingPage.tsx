import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Code,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { hasSession } from "../lib/auth";
import { ApiError, completeOnboarding, getOnboardingOptions } from "../lib/api";
import type {
  CompleteOnboardingRequest,
  OnboardingCatalogOption,
  OnboardingOptionsResponse,
  OnboardingTopicOption,
} from "../lib/api";
import {
  clearPendingOnboarding,
  getPendingOnboarding,
  savePendingOnboarding,
} from "../lib/onboarding";

function isTopicAvailableForRole(
  topic: OnboardingTopicOption,
  selectedRole: string,
) {
  return (
    topic.target_role_keys.length === 0 ||
    topic.target_role_keys.includes(selectedRole)
  );
}

function getCatalogDescription(option: OnboardingCatalogOption) {
  return option.description || "Available for your interview preparation.";
}

export default function OnboardingPage() {
  const pendingOnboarding = getPendingOnboarding();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(
    pendingOnboarding?.target_role || "",
  );
  const [selectedLevel, setSelectedLevel] = useState(
    pendingOnboarding?.experience_level || "",
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    pendingOnboarding?.preferred_topics || [],
  );
  const [options, setOptions] = useState<OnboardingOptionsResponse | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  const roles = options?.target_roles || [];
  const levels = options?.experience_levels || [];
  const topics = useMemo(() => {
    if (!options || !selectedRole) {
      return [];
    }

    return options.topics.filter((topic) =>
      isTopicAvailableForRole(topic, selectedRole),
    );
  }, [options, selectedRole]);

  const loadOptions = async () => {
    if (!hasSession()) {
      navigate("/login", {
        replace: true,
        state: {
          from: { pathname: "/onboarding" },
          message: "Sign in to personalize your interview preparation.",
        },
      });
      return;
    }

    setIsLoadingOptions(true);
    setErrorMessage("");

    try {
      const result = await getOnboardingOptions();
      setOptions(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load onboarding options.",
      );
    } finally {
      setIsLoadingOptions(false);
    }
  };

  useEffect(() => {
    void loadOptions();
  }, []);

  useEffect(() => {
    if (!selectedRole || !options) {
      return;
    }

    setSelectedTopics((currentTopics) =>
      currentTopics.filter((topicKey) =>
        options.topics.some(
          (topic) =>
            topic.key === topicKey &&
            isTopicAvailableForRole(topic, selectedRole),
        ),
      ),
    );
  }, [options, selectedRole]);

  const getPreferences = (): CompleteOnboardingRequest | null => {
    if (!selectedRole || !selectedLevel || selectedTopics.length === 0) {
      return null;
    }

    return {
      target_role: selectedRole,
      experience_level: selectedLevel,
      preferred_topics: selectedTopics,
    };
  };

  const handleNext = async () => {
    setErrorMessage("");

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    const preferences = getPreferences();

    if (!preferences) {
      setErrorMessage("Complete all onboarding steps before continuing.");
      return;
    }

    if (!hasSession()) {
      savePendingOnboarding(preferences);
      navigate("/login", {
        state: {
          from: { pathname: "/onboarding" },
          message: "Sign in to save your interview preferences.",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await completeOnboarding(preferences);
      clearPendingOnboarding();
      navigate("/app");
    } catch (error) {
      const code = error instanceof ApiError ? error.code : undefined;

      if (code === "EMAIL_NOT_VERIFIED") {
        setErrorMessage("Verify your email before completing onboarding.");
      } else if (code === "VALIDATION_FAILED") {
        setErrorMessage("Choose a supported role, level, and topic list.");
      } else {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to save your onboarding preferences.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const canProceed = () => {
    if (isLoadingOptions || !options) return false;
    if (step === 1) return selectedRole !== "";
    if (step === 2) return selectedLevel !== "";
    if (step === 3) return selectedTopics.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-2xl">InterviewAI</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Let's personalize your experience</h1>
          <p className="text-muted-foreground">
            Tell us about yourself so we can tailor interview questions to your
            needs
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <Card className="p-8 mb-6 min-h-[500px] flex flex-col">
          {isLoadingOptions ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading onboarding options
              </div>
            </div>
          ) : errorMessage && !options ? (
            <div className="flex flex-1 items-center justify-center text-center">
              <div className="max-w-md space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Onboarding options unavailable
                  </h2>
                  <p className="text-muted-foreground">{errorMessage}</p>
                </div>
                <Button onClick={loadOptions}>
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Select your target role</h2>
                    <p className="text-muted-foreground">
                      What position are you preparing for?
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <motion.button
                      key={role.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedRole(role.key);
                        setSelectedTopics([]);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        selectedRole === role.key
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-border hover:border-blue-500/50"
                      }`}
                    >
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {getCatalogDescription(role)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">What's your experience level?</h2>
                    <p className="text-muted-foreground">
                      This helps us adjust question difficulty
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                  {levels.map((level) => (
                    <motion.button
                      key={level.key}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedLevel(level.key)}
                      className={`w-full p-6 rounded-lg border-2 transition-all text-left flex items-center gap-4 ${
                        selectedLevel === level.key
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-border hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl mb-1">
                          {level.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {getCatalogDescription(level)}
                        </p>
                      </div>
                      {selectedLevel === level.key && (
                        <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Choose topics to focus on</h2>
                    <p className="text-muted-foreground">
                      Select areas you want to improve (choose at least one)
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {topics.map((topic) => {
                    const isSelected = selectedTopics.includes(topic.key);
                    return (
                      <motion.button
                        key={topic.key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTopic(topic.key)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-green-500 bg-green-500/10"
                            : "border-border hover:border-green-500/50"
                        }`}
                      >
                        <span className="font-medium text-sm">{topic.name}</span>
                        {topic.description ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {topic.description}
                          </p>
                        ) : null}
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto mt-2" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selectedTopics.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground mt-4"
                  >
                    {selectedTopics.length} topic{selectedTopics.length > 1 ? "s" : ""} selected
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          {errorMessage ? (
            <p className="text-sm text-destructive">{errorMessage}</p>
          ) : null}

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            size="lg"
          >
            {isSubmitting
              ? "Saving..."
              : step === totalSteps
                ? "Get Started"
                : "Continue"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
