import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertCircle,
  Code,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function InterviewSessionPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [codeMode, setCodeMode] = useState(false);

  const questions = [
    {
      id: 1,
      topic: "Algorithms",
      difficulty: "Medium",
      question:
        "Explain the difference between quicksort and mergesort algorithms. When would you choose one over the other?",
      hints: [
        "Consider time and space complexity",
        "Think about stability of sorting",
        "Consider real-world use cases",
      ],
    },
    {
      id: 2,
      topic: "System Design",
      difficulty: "Hard",
      question:
        "How would you design a URL shortening service like bit.ly? Consider scalability, availability, and data consistency.",
      hints: [
        "Think about database design",
        "Consider hash functions",
        "Plan for high traffic",
      ],
    },
    {
      id: 3,
      topic: "Database Design",
      difficulty: "Medium",
      question:
        "What are database indexes and how do they improve query performance? What are the trade-offs?",
      hints: [
        "Think about data structures used",
        "Consider write vs read performance",
        "Remember storage implications",
      ],
    },
    {
      id: 4,
      topic: "API Design",
      difficulty: "Easy",
      question:
        "What are the key principles of RESTful API design? Provide examples of good and bad practices.",
      hints: [
        "Consider HTTP methods",
        "Think about resource naming",
        "Remember statelessness",
      ],
    },
    {
      id: 5,
      topic: "Security",
      difficulty: "Medium",
      question:
        "Explain SQL injection attacks and how to prevent them in a Python/Django application.",
      hints: [
        "Think about parameterized queries",
        "Consider ORM usage",
        "Remember input validation",
      ],
    },
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleEndInterview = () => {
    navigate("/app/results/session-123");
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion] || "";

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Interview Session</h2>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
              Python Backend
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowEndDialog(true)}
            >
              <Flag className="w-4 h-4 mr-2" />
              End Interview
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <Progress value={progress} className="h-2 flex-1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Question Card */}
            <Card className="p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-lg bg-accent text-sm font-medium">
                  {currentQ.topic}
                </span>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    currentQ.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : currentQ.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-6 leading-relaxed">
                {currentQ.question}
              </h3>

              {/* Hints */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">
                      Hints to consider:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {currentQ.hints.map((hint, index) => (
                        <li key={index} className="text-muted-foreground">
                          • {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Answer Section */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Your Answer</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCodeMode(!codeMode)}
                >
                  <Code className="w-4 h-4 mr-2" />
                  {codeMode ? "Text Mode" : "Code Mode"}
                </Button>
              </div>

              <Textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here... Be thorough and explain your reasoning."
                className={`min-h-[400px] ${
                  codeMode ? "font-mono text-sm" : ""
                }`}
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  {currentAnswer.length} characters
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentAnswer ? "Answer saved" : "No answer yet"}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-card border-t border-border px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  index === currentQuestion
                    ? "bg-primary text-primary-foreground"
                    : answers[index]
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-accent text-muted-foreground hover:bg-accent/80"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => setShowEndDialog(true)}>
              Submit Interview
            </Button>
          )}
        </div>
      </div>

      {/* End Interview Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview Session?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this interview? You've answered{" "}
              {Object.keys(answers).length} out of {totalQuestions} questions.
              Your progress will be saved and you'll receive detailed feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndInterview}>
              End & Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
