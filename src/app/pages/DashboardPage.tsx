import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  Loader2,
  Play,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  getDashboardOverview,
  type DashboardOverviewResponse,
} from "../lib/api";

type StatDelta = {
  delta_direction: "up" | "down" | "flat" | "new";
  delta_percent: number;
};

function formatPracticeTime(seconds: number) {
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  }

  const hours = seconds / 3600;

  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

function formatDelta(delta: StatDelta) {
  if (delta.delta_direction === "new") {
    return "New";
  }

  if (delta.delta_direction === "flat" || delta.delta_percent === 0) {
    return "No change";
  }

  const prefix = delta.delta_direction === "up" ? "+" : "-";

  return `${prefix}${Math.abs(delta.delta_percent)}%`;
}

function getDeltaClass(delta: StatDelta) {
  if (delta.delta_direction === "down") {
    return "text-red-600 dark:text-red-400";
  }

  if (delta.delta_direction === "up" || delta.delta_direction === "new") {
    return "text-green-600 dark:text-green-400";
  }

  return "text-muted-foreground";
}

function formatScore(score: number | null) {
  return score === null ? "No score" : `${score}%`;
}

function getRelativeTime(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return "";
  }

  const diffSeconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${diffDays}d ago`;
}

function getDisplayName(data: DashboardOverviewResponse) {
  return data.user.full_name || data.user.email || "there";
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardOverviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await getDashboardOverview("7d");
      setDashboard(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load dashboard data right now.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setErrorMessage("");

    getDashboardOverview("7d")
      .then((result) => {
        if (isActive) {
          setDashboard(result);
        }
      })
      .catch((error) => {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load dashboard data right now.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading && !dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dashboard
        </div>
      </div>
    );
  }

  if (errorMessage && !dashboard) {
    return (
      <div className="p-8">
        <Card className="mx-auto max-w-xl p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Dashboard unavailable</h1>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          </div>
          <Button onClick={loadDashboard} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const performanceData = dashboard.performance.points.map((point) => ({
    date: point.label,
    score: point.average_score,
    interviews: point.interviews_completed,
  }));
  const weakTopics = dashboard.topics.weak;
  const strongTopics = dashboard.topics.strong;
  const recommendedTopics =
    dashboard.recommendations.recommended_topics.length > 0
      ? dashboard.recommendations.recommended_topics
      : weakTopics.map((topic) => ({
          id: topic.id,
          name: topic.name,
          priority: "medium" as const,
          reason: topic.reason,
        }));

  return (
    <div className="space-y-8 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {getDisplayName(dashboard)}!
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your interview preparation journey?
        </p>
      </motion.div>

      {errorMessage ? (
        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{errorMessage}</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadDashboard}>
              Retry
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span
                className={`text-sm font-medium ${getDeltaClass(
                  dashboard.stats.total_interviews,
                )}`}
              >
                {formatDelta(dashboard.stats.total_interviews)}
              </span>
            </div>
            <h3 className="mb-1 text-3xl font-bold">
              {dashboard.stats.total_interviews.value}
            </h3>
            <p className="text-sm text-muted-foreground">Total Interviews</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span
                className={`text-sm font-medium ${getDeltaClass(
                  dashboard.stats.average_score,
                )}`}
              >
                {formatDelta(dashboard.stats.average_score)}
              </span>
            </div>
            <h3 className="mb-1 text-3xl font-bold">
              {formatScore(dashboard.stats.average_score.value)}
            </h3>
            <p className="text-sm text-muted-foreground">Average Score</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              {dashboard.stats.current_streak_days.is_record ? (
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  New record
                </span>
              ) : null}
            </div>
            <h3 className="mb-1 text-3xl font-bold">
              {dashboard.stats.current_streak_days.value} Days
            </h3>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span
                className={`text-sm font-medium ${getDeltaClass(
                  dashboard.stats.total_practice_seconds,
                )}`}
              >
                {formatDelta(dashboard.stats.total_practice_seconds)}
              </span>
            </div>
            <h3 className="mb-1 text-3xl font-bold">
              {formatPracticeTime(dashboard.stats.total_practice_seconds.value)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Practice Time</p>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="mb-1 text-xl font-semibold">
                  Performance Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your progress for the selected range
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-600 dark:text-green-400">
                  {dashboard.performance.summary.score_delta_percent >= 0
                    ? "+"
                    : ""}
                  {dashboard.performance.summary.score_delta_percent}%
                  improvement
                </span>
              </div>
            </div>

            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient
                      id="colorScore"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
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
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-border text-center">
                <div>
                  <p className="font-medium">No performance data yet</p>
                  <p className="text-sm text-muted-foreground">
                    Complete an interview to start building your trend.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
            <h3 className="mb-3 text-2xl font-bold">
              Ready for your next interview?
            </h3>
            <p className="mb-6 opacity-90">
              Start a new practice session tailored to your goals.
            </p>
            <Link to="/app/interview">
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                <Play className="mr-2 h-5 w-5" />
                Start Interview
              </Button>
            </Link>
            <div className="mt-6 border-t border-white/20 pt-6">
              <p className="mb-2 text-sm opacity-75">Recommended topics:</p>
              <div className="flex flex-wrap gap-2">
                {recommendedTopics.slice(0, 3).map((topic) => (
                  <span
                    key={topic.id}
                    className="rounded-full bg-white/20 px-3 py-1 text-sm"
                  >
                    {topic.name}
                  </span>
                ))}
                {recommendedTopics.length === 0 ? (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                    Your preferred topics
                  </span>
                ) : null}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Areas to Improve</h3>
                <p className="text-sm text-muted-foreground">
                  Focus on these topics
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic) => (
                  <div key={topic.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatScore(topic.score)}
                      </span>
                    </div>
                    <Progress value={topic.score ?? 0} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {topic.questions_answered} questions attempted
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No weak topics yet. Complete more interviews to get focused
                  recommendations.
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Your Strengths</h3>
                <p className="text-sm text-muted-foreground">Keep it up!</p>
              </div>
            </div>

            <div className="space-y-4">
              {strongTopics.length > 0 ? (
                strongTopics.map((topic) => (
                  <div key={topic.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.name}</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {formatScore(topic.score)}
                      </span>
                    </div>
                    <Progress value={topic.score ?? 0} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {topic.questions_answered} questions attempted
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Strengths will appear after enough completed interview
                  activity.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <Link to="/app/analytics">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {dashboard.recent_activity.items.length > 0 ? (
              dashboard.recent_activity.items.map((activity) => (
                <Link
                  key={activity.session_id}
                  to={
                    activity.status === "completed"
                      ? `/app/results/${activity.session_id}`
                      : "/app/interview"
                  }
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="font-bold text-white">
                      {activity.score ?? "-"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 font-medium">{activity.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {activity.topics.map((topic) => (
                        <span
                          key={topic.id}
                          className="rounded bg-accent px-2 py-1 text-xs text-muted-foreground"
                        >
                          {topic.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPracticeTime(activity.duration_seconds)} ·{" "}
                    {getRelativeTime(activity.started_at)}
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="font-medium">No interview activity yet</p>
                <p className="text-sm text-muted-foreground">
                  Start your first interview to populate this feed.
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
