import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  Mail,
  MessageSquare,
  Lock,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { useTheme } from "../components/theme-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    achievementAlerts: true,
    reminderNotifications: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    toast.success("Notification settings updated");
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Account Settings</h3>
              <p className="text-sm text-muted-foreground">
                Update your account information
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Developer" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role</Label>
                <Select defaultValue="python">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="python">Python Backend</SelectItem>
                    <SelectItem value="django">Django Developer</SelectItem>
                    <SelectItem value="golang">Go Developer</SelectItem>
                    <SelectItem value="nodejs">Node.js Backend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Experience Level</Label>
                <Select defaultValue="mid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid-Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => toast.success("Account settings saved")}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize how the app looks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "light"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Light</p>
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "dark"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Dark</p>
                </button>
                <button
                  onClick={() => handleThemeChange("system")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === "system"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50"
                  }`}
                >
                  <Monitor className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">System</p>
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="email-notifications" className="cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your progress
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("emailNotifications", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1">
                <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="push-notifications" className="cursor-pointer">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get push notifications in your browser
                  </p>
                </div>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("pushNotifications", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="weekly-report" className="cursor-pointer">
                    Weekly Report
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your progress
                  </p>
                </div>
              </div>
              <Switch
                id="weekly-report"
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) =>
                  handleNotificationChange("weeklyReport", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-5 h-5 text-muted-foreground mt-0.5">🏆</div>
                <div>
                  <Label htmlFor="achievement-alerts" className="cursor-pointer">
                    Achievement Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you unlock achievements
                  </p>
                </div>
              </div>
              <Switch
                id="achievement-alerts"
                checked={notifications.achievementAlerts}
                onCheckedChange={(checked) =>
                  handleNotificationChange("achievementAlerts", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-5 h-5 text-muted-foreground mt-0.5">⏰</div>
                <div>
                  <Label htmlFor="reminder-notifications" className="cursor-pointer">
                    Practice Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Daily reminders to keep your streak going
                  </p>
                </div>
              </div>
              <Switch
                id="reminder-notifications"
                checked={notifications.reminderNotifications}
                onCheckedChange={(checked) =>
                  handleNotificationChange("reminderNotifications", checked)
                }
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Security</h3>
              <p className="text-sm text-muted-foreground">
                Manage your password and security settings
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Button variant="outline" className="w-full md:w-auto">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Active Sessions</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Manage devices where you're currently logged in
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">MacBook Pro - Chrome</p>
                    <p className="text-sm text-muted-foreground">
                      San Francisco, CA • Active now
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 border-red-500/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Irreversible actions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/50 bg-red-500/10">
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400">
                  Delete Account
                </h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => toast.error("Account deletion cancelled")}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
