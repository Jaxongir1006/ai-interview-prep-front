import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Play,
  TrendingUp,
  Award,
  Target,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const progressData = [
    { date: "Mon", score: 65 },
    { date: "Tue", score: 72 },
    { date: "Wed", score: 68 },
    { date: "Thu", score: 78 },
    { date: "Fri", score: 82 },
    { date: "Sat", score: 85 },
    { date: "Sun", score: 87 },
  ];

  const topicPerformance = [
    { topic: "Algorithms", score: 85 },
    { topic: "System Design", score: 72 },
    { topic: "Databases", score: 68 },
    { topic: "APIs", score: 90 },
    { topic: "Security", score: 65 },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Python Backend Interview",
      score: 87,
      date: "2 hours ago",
      topics: ["Algorithms", "Data Structures"],
    },
    {
      id: 2,
      title: "System Design Session",
      score: 78,
      date: "Yesterday",
      topics: ["System Design", "Scalability"],
    },
    {
      id: 3,
      title: "Django Framework Quiz",
      score: 92,
      date: "2 days ago",
      topics: ["Django", "API Design"],
    },
  ];

  const weakTopics = [
    { name: "Security", score: 65, questions: 12 },
    { name: "System Design", score: 72, questions: 8 },
    { name: "Database Design", score: 68, questions: 15 },
  ];

  const strongTopics = [
    { name: "API Design", score: 90, questions: 20 },
    { name: "Algorithms", score: 85, questions: 25 },
    { name: "Data Structures", score: 83, questions: 18 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-muted-foreground">
          Ready to continue your interview preparation journey?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">48</h3>
            <p className="text-sm text-muted-foreground">Total Interviews</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +5%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">87%</h3>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                New Record!
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">7 Days</h3>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">24h</h3>
            <p className="text-sm text-muted-foreground">Total Practice Time</p>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  Performance Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your progress this week
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-600 dark:text-green-400">
                  +15% improvement
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Start Interview CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-3">
              Ready for your next interview?
            </h3>
            <p className="mb-6 opacity-90">
              Start a new practice session tailored to your goals.
            </p>
            <Link to="/app/interview">
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                <Play className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </Link>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm opacity-75 mb-2">Recommended topics:</p>
              <div className="flex flex-wrap gap-2">
                {["Security", "System Design", "Databases"].map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full bg-white/20 text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Topic Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Areas to Improve</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on these topics
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {weakTopics.map((topic) => (
                <div key={topic.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {topic.score}%
                    </span>
                  </div>
                  <Progress value={topic.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {topic.questions} questions attempted
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Strong Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Your Strengths</h3>
                <p className="text-sm text-muted-foreground">Keep it up!</p>
              </div>
            </div>

            <div className="space-y-4">
              {strongTopics.map((topic) => (
                <div key={topic.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {topic.score}%
                    </span>
                  </div>
                  <Progress value={topic.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {topic.questions} questions attempted
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <Link to="/app/analytics">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{activity.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1">{activity.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs px-2 py-1 rounded bg-accent text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.date}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
