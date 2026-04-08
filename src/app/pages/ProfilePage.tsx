import { useState } from "react";
import { motion } from "motion/react";
import { User, Mail, MapPin, Calendar, Edit, Award, Target, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Developer",
    email: "john@example.com",
    location: "San Francisco, CA",
    targetRole: "Python Backend Developer",
    experienceLevel: "Mid-Level (3 years)",
    joinedDate: "January 2026",
  });

  const topics = [
    { name: "Algorithms", level: 85 },
    { name: "System Design", level: 72 },
    { name: "Databases", level: 90 },
    { name: "API Design", level: 92 },
    { name: "Security", level: 65 },
    { name: "Testing", level: 78 },
    { name: "DevOps", level: 70 },
    { name: "Cloud Services", level: 68 },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Interview",
      description: "Completed your first practice interview",
      icon: Target,
      unlocked: true,
    },
    {
      id: 2,
      title: "Week Streak",
      description: "Maintained a 7-day practice streak",
      icon: CheckCircle2,
      unlocked: true,
    },
    {
      id: 3,
      title: "Perfect Score",
      description: "Scored 100% on an interview",
      icon: Award,
      unlocked: false,
    },
    {
      id: 4,
      title: "Topic Master",
      description: "Achieved 90+ score in a topic",
      icon: Target,
      unlocked: true,
    },
  ];

  const stats = [
    { label: "Total Interviews", value: "48", change: "+12" },
    { label: "Average Score", value: "87%", change: "+5%" },
    { label: "Current Streak", value: "7 days", change: "New!" },
    { label: "Total Time", value: "24.5h", change: "+8h" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and track your achievements
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                JD
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Change Photo
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>

              {isEditing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) =>
                        setProfile({ ...profile, location: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Target Role</Label>
                    <Input
                      id="role"
                      value={profile.targetRole}
                      onChange={(e) =>
                        setProfile({ ...profile, targetRole: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Target Role</p>
                      <p className="font-medium">{profile.targetRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{profile.joinedDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{stat.value}</p>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Topics & Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topic Proficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Topic Proficiency</h3>
            <div className="space-y-4">
              {topics.map((topic, index) => (
                <motion.div
                  key={topic.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {topic.level}%
                    </span>
                  </div>
                  <Progress value={topic.level} className="h-2" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`flex items-start gap-4 p-4 rounded-lg border ${
                      achievement.unlocked
                        ? "border-border bg-accent/30"
                        : "border-border opacity-50"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-blue-500 to-purple-600"
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          achievement.unlocked
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge variant="secondary" className="text-xs">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Preferred Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Preferred Topics</h3>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Algorithms",
              "Data Structures",
              "System Design",
              "Databases",
              "API Design",
              "Security",
              "Python",
              "Django",
              "PostgreSQL",
              "REST APIs",
              "Microservices",
            ].map((topic) => (
              <Badge key={topic} variant="secondary" className="px-4 py-2">
                {topic}
              </Badge>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
