import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Brain,
  Zap,
  Target,
  BarChart3,
  Code,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Interviews",
      description:
        "Practice with intelligent interview questions tailored to your target role and experience level.",
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description:
        "Get customized recommendations based on your performance and focus on your weak areas.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Track your progress over time with detailed insights and performance metrics.",
    },
    {
      icon: Code,
      title: "Real-World Questions",
      description:
        "Practice with questions used by top tech companies in actual interviews.",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description:
        "Receive immediate, detailed feedback on your answers with improvement suggestions.",
    },
    {
      icon: CheckCircle,
      title: "Interview Ready",
      description:
        "Build confidence and master the skills you need to ace your next technical interview.",
    },
  ];

  const benefits = [
    "Unlimited practice interviews",
    "Role-specific question banks",
    "Performance tracking & analytics",
    "Personalized learning paths",
    "Mock interview sessions",
    "Expert feedback & tips",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">InterviewAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">
                Join 50,000+ developers preparing for interviews
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Master Technical Interviews with AI
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Practice with AI-powered mock interviews, get instant feedback, and
              track your progress. Land your dream developer job with confidence.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Start Practicing Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 bg-accent/30">
                    <div className="h-3 bg-muted rounded mb-3 w-3/4"></div>
                    <div className="h-2 bg-muted rounded mb-2"></div>
                    <div className="h-2 bg-muted rounded w-5/6"></div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-accent/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features to help you prepare for technical
              interviews effectively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Why developers choose InterviewAI
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform is designed specifically for backend developers and
                software engineers who want to excel in technical interviews.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Your Progress
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +24% this week
                    </span>
                  </div>
                  <div className="h-48 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg flex items-end gap-2 p-4">
                    {[40, 65, 45, 80, 70, 90, 85].map((height, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Interviews", value: "48" },
                      { label: "Avg Score", value: "87%" },
                      { label: "Streak", value: "12d" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to ace your next interview?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of developers who have already improved their interview
            skills with InterviewAI.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2026 InterviewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
