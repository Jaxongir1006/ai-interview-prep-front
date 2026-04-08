import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Share2,
  RotateCw,
  Home,
  Lightbulb,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ResultsPage() {
  const overallScore = 87;
  const totalQuestions = 5;
  const answeredQuestions = 5;

  const topicScores = [
    { topic: "Algorithms", score: 85, feedback: "Strong understanding" },
    { topic: "System Design", score: 78, feedback: "Good, needs practice" },
    { topic: "Databases", score: 90, feedback: "Excellent!" },
    { topic: "API Design", score: 92, feedback: "Outstanding" },
    { topic: "Security", score: 82, feedback: "Solid knowledge" },
  ];

  const radarData = topicScores.map((item) => ({
    subject: item.topic,
    score: item.score,
    fullMark: 100,
  }));

  const strengths = [
    "Clear and concise explanations",
    "Good understanding of algorithmic complexity",
    "Excellent API design knowledge",
    "Strong security awareness",
  ];

  const weaknesses = [
    "Could improve on distributed systems concepts",
    "Need more detail in system design discussions",
    "Consider edge cases more thoroughly",
  ];

  const missingConcepts = [
    {
      concept: "CAP Theorem",
      topic: "System Design",
      description: "Understanding trade-offs in distributed systems",
    },
    {
      concept: "Database Sharding",
      topic: "Databases",
      description: "Horizontal partitioning strategies",
    },
  ];

  const questionResults = [
    {
      id: 1,
      question: "Quicksort vs Mergesort",
      topic: "Algorithms",
      score: 85,
      feedback:
        "Good explanation of time complexity. Consider mentioning stability and in-place sorting characteristics.",
    },
    {
      id: 2,
      question: "URL Shortening Service Design",
      topic: "System Design",
      score: 78,
      feedback:
        "Solid approach to hash functions. Could elaborate more on database choice and caching strategy.",
    },
    {
      id: 3,
      question: "Database Indexes",
      topic: "Databases",
      score: 90,
      feedback:
        "Excellent coverage of B-tree indexes and trade-offs. Great examples provided.",
    },
    {
      id: 4,
      question: "RESTful API Design",
      topic: "API Design",
      score: 92,
      feedback:
        "Outstanding understanding of REST principles. Good examples of good and bad practices.",
    },
    {
      id: 5,
      question: "SQL Injection Prevention",
      topic: "Security",
      score: 82,
      feedback:
        "Good coverage of parameterized queries. Mention prepared statements and ORM best practices.",
    },
  ];

  const recommendations = [
    {
      title: "Practice System Design",
      description: "Focus on distributed systems and scalability patterns",
      icon: TrendingUp,
    },
    {
      title: "Study CAP Theorem",
      description: "Deepen understanding of consistency, availability, and partition tolerance",
      icon: Lightbulb,
    },
    {
      title: "Review Database Scaling",
      description: "Learn about sharding, replication, and partitioning strategies",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6">
          <span className="text-4xl font-bold">{overallScore}</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
        <p className="text-xl text-muted-foreground">
          Great job! Here's your detailed performance report.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-4"
      >
        <Link to="/app">
          <Button variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link to="/app/interview">
          <Button>
            <RotateCw className="w-4 h-4 mr-2" />
            Start New Interview
          </Button>
        </Link>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{overallScore}%</h3>
            <p className="text-muted-foreground">Overall Score</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {answeredQuestions}/{totalQuestions}
            </h3>
            <p className="text-muted-foreground">Questions Answered</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold mb-1">+12%</h3>
            <p className="text-muted-foreground">vs. Last Interview</p>
          </Card>
        </motion.div>
      </div>

      {/* Topic Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">
              Performance by Topic
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Topic Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Detailed Breakdown</h3>
            <div className="space-y-6">
              {topicScores.map((item) => (
                <div key={item.topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.topic}</span>
                    <span className="text-sm font-semibold">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2 mb-1" />
                  <p className="text-sm text-muted-foreground">
                    {item.feedback}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Areas to Improve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold">Areas to Improve</h3>
            </div>
            <ul className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>{weakness}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Missing Concepts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold">Concepts to Learn</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {missingConcepts.map((concept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{concept.concept}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-accent text-muted-foreground">
                    {concept.topic}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {concept.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Question-by-Question Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">
            Question-by-Question Feedback
          </h3>
          <div className="space-y-4">
            {questionResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{result.question}</h4>
                      <span className="text-xs px-2 py-1 rounded bg-accent text-muted-foreground">
                        {result.topic}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-2xl font-bold">{result.score}%</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                  <p className="text-sm">{result.feedback}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Recommendations</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <Card className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to improve further?</h3>
          <p className="mb-6 opacity-90">
            Keep practicing to master these concepts and boost your interview
            confidence!
          </p>
          <Link to="/app/interview">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <RotateCw className="w-5 h-5 mr-2" />
              Practice Again
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}
