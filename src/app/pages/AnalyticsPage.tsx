import { useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const performanceOverTime = [
    { date: "Apr 1", score: 72, interviews: 2 },
    { date: "Apr 2", score: 75, interviews: 1 },
    { date: "Apr 3", score: 78, interviews: 3 },
    { date: "Apr 4", score: 76, interviews: 2 },
    { date: "Apr 5", score: 82, interviews: 2 },
    { date: "Apr 6", score: 85, interviews: 1 },
    { date: "Apr 7", score: 87, interviews: 2 },
    { date: "Apr 8", score: 87, interviews: 1 },
  ];

  const topicPerformance = [
    { topic: "Algorithms", score: 85, change: 12 },
    { topic: "System Design", score: 72, change: -3 },
    { topic: "Databases", score: 90, change: 8 },
    { topic: "API Design", score: 92, change: 15 },
    { topic: "Security", score: 65, change: 5 },
    { topic: "Testing", score: 78, change: 10 },
    { topic: "DevOps", score: 70, change: -2 },
    { topic: "Cloud Services", score: 68, change: 6 },
  ];

  const difficultyBreakdown = [
    { name: "Easy", value: 35, color: "#10b981" },
    { name: "Medium", value: 45, color: "#f59e0b" },
    { name: "Hard", value: 20, color: "#ef4444" },
  ];

  const timeSpentData = [
    { day: "Mon", hours: 1.5 },
    { day: "Tue", hours: 2.0 },
    { day: "Wed", hours: 1.2 },
    { day: "Thu", hours: 2.5 },
    { day: "Fri", hours: 1.8 },
    { day: "Sat", hours: 3.0 },
    { day: "Sun", hours: 2.2 },
  ];

  const weeklyStats = [
    { week: "Week 1", interviews: 8, avgScore: 72 },
    { week: "Week 2", interviews: 12, avgScore: 75 },
    { week: "Week 3", interviews: 10, avgScore: 78 },
    { week: "Week 4", interviews: 15, avgScore: 87 },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Track your progress and identify areas for improvement
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Filters:</span>
            </div>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="algorithms">Algorithms</SelectItem>
                <SelectItem value="system-design">System Design</SelectItem>
                <SelectItem value="databases">Databases</SelectItem>
                <SelectItem value="api-design">API Design</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="ml-auto">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </h3>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-bold mb-1">48</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              +12 this week
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Average Score
              </h3>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-3xl font-bold mb-1">87%</p>
            <p className="text-sm text-green-600 dark:text-green-400">
              +5% from last week
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Time Invested
              </h3>
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-bold mb-1">24.5h</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Best Topic
              </h3>
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-3xl font-bold mb-1">92%</p>
            <p className="text-sm text-muted-foreground">API Design</p>
          </Card>
        </motion.div>
      </div>

      {/* Performance Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">
            Performance Over Time
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceOverTime}>
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
              <Legend />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorScore)"
                name="Score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Topic Performance & Difficulty Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">
              Performance by Topic
            </h3>
            <div className="space-y-4">
              {topicPerformance.map((topic, index) => (
                <motion.div
                  key={topic.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{topic.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {topic.score}%
                        </span>
                        <span
                          className={`text-xs flex items-center ${
                            topic.change >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {topic.change >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(topic.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.score}%` }}
                        transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">
              Questions by Difficulty
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={difficultyBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {difficultyBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {difficultyBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Time Spent & Weekly Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Time Spent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">
              Daily Practice Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="interviews"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Interviews"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Avg Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
