"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import DashboardAPI, { ChallengingTopicItem, DashboardStats, RecentActivityItem, TopicProficiencyItem } from "@/lib/api/dashboard"
import { BookOpen, Calculator, CheckCircle, Target, AlertTriangle, BarChart, PieChart, ChevronsDownUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[] | null>(null)
  const [topicProficiency, setTopicProficiency] = useState<TopicProficiencyItem[] | null>(null)
  const [challengingTopics, setChallengingTopics] = useState<ChallengingTopicItem[] | null>(null)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await DashboardAPI.getStats()
        setStats(res.data.data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
      }
    }

    const fetchRecentActivity = async () => {
      try {
        const res = await DashboardAPI.getRecentActivity()
        setRecentActivity(res.data.data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
      }
    }

    const fetchTopicProficiency = async () => {
      try {
        const res = await DashboardAPI.getTopicProficiency()
        setTopicProficiency(res.data.data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
      }
    }

    const fetchChallengingTopics = async () => {
      try {
        const res = await DashboardAPI.getChallengingTopics()
        setChallengingTopics(res.data.data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
      }
    }

    fetchStats()
    fetchRecentActivity()
    fetchTopicProficiency()
    fetchChallengingTopics()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          <span className="text-gradient">Welcome back, {user?.name}</span>
        </h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning mathematics with AI assistance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-soft hover-lift overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats?.quizzes_completed}</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft hover-lift overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-500/10 to-teal-500/10">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats?.accuracy_rate}%</div>
          </CardContent>
        </Card>
        <Card className="shadow-soft hover-lift overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-500/10 to-rose-500/10">
            <CardTitle className="text-sm font-medium">Most Challenging Topic</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.most_challenging_topic}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Learning Progress
        </h2>
        <Card className="shadow-soft overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent learning activities and interactions</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {(recentActivity || []).map((activity, i) => {
                const Icon = activity.type === "quiz" ? BookOpen : Calculator;

                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-lg border p-3 shadow-soft hover-lift"
                  >
                    <div className="rounded-full p-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                      <Icon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-primary" />
          Performance Analytics
        </h2>
        <div className="grid-cols-1">
          {/* First row of graphs */}
          <Card className="shadow-soft overflow-hidden mb-8">
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle>Topic Proficiency</CardTitle>
              <CardDescription>Your progress across different math topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {(topicProficiency || []).map((topic, i) => {
                const colorMap: Record<string, { text: string; from: string; to: string }> = {
                  "Number": { text: "text-blue-600 dark:text-blue-400", from: "from-blue-500", to: "to-indigo-500" },
                  "Algebra": { text: "text-purple-600 dark:text-purple-400", from: "from-purple-500", to: "to-pink-500" },
                  "Ratio, Proportion and Rates of Change": {
                    text: "text-teal-600 dark:text-teal-400",
                    from: "from-teal-500",
                    to: "to-cyan-500",
                  },
                  "Geometry and Measures": {
                    text: "text-green-600 dark:text-green-400",
                    from: "from-green-500",
                    to: "to-emerald-500",
                  },
                  "Probability": {
                    text: "text-amber-600 dark:text-amber-400",
                    from: "from-amber-500",
                    to: "to-orange-500",
                  },
                  "Statistics": {
                    text: "text-red-600 dark:text-red-400",
                    from: "from-red-500",
                    to: "to-rose-500",
                  },
                };

                const colors = colorMap[topic.topic] ?? {
                  text: "text-primary",
                  from: "from-primary",
                  to: "to-accent",
                };

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{topic.topic}</span>
                      </div>
                      <span className={`text-sm font-medium ${colors.text}`}>{topic.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colors.from} ${colors.to}`}
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Second row - only Challenging Topics remains */}
          <Card className="shadow-soft overflow-hidden lg:col-span-2">
            <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />
            <CardHeader className="bg-gradient-to-r from-red-500/5 to-rose-500/5">
              <div className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-red-500" />
                <CardTitle>Challenging Topics</CardTitle>
              </div>
              <CardDescription>Topics with the lowest accuracy rates</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  {(challengingTopics || []).map((topic, i) => {
                    const colorMap: Record<string, { text: string; from: string; to: string; gradientId: string }> = {
                      Statistics: {
                        text: "text-red-600 dark:text-red-400",
                        from: "from-red-500",
                        to: "to-rose-500",
                        gradientId: "redGradient",
                      },
                      Probability: {
                        text: "text-amber-600 dark:text-amber-400",
                        from: "from-amber-500",
                        to: "to-orange-500",
                        gradientId: "amberGradient",
                      },
                      "Ratio, Proportion and Rates of Change": {
                        text: "text-teal-600 dark:text-teal-400",
                        from: "from-teal-500",
                        to: "to-cyan-500",
                        gradientId: "tealGradient",
                      },
                    };

                    const colors = colorMap[topic.topic] ?? {
                      text: "text-primary",
                      from: "from-primary",
                      to: "to-accent",
                      gradientId: "primaryGradient",
                    };

                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{topic.topic}</span>
                          <span className={`text-sm font-medium ${colors.text}`}>{topic.percentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${colors.from} ${colors.to}`}
                            style={{ width: `${topic.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Donut Chart */}
                <div className="flex items-center justify-center">
                  <div className="relative h-[200px] w-[200px]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />
                      {challengingTopics?.reduce(
                        (acc, topic, i) => {
                          const totalCircumference = 2 * Math.PI * 45; // 282.6
                          const offset = acc.offset;
                          const percentage = topic.percentage;
                          const strokeLength = (percentage / 100) * totalCircumference;

                          const colorMap: Record<string, { text: string; from: string; to: string; gradientId: string }> = {
                            Number: {
                              text: "text-blue-600 dark:text-blue-400",
                              from: "from-blue-500",
                              to: "to-indigo-500",
                              gradientId: "blueGradient",
                            },
                            Algebra: {
                              text: "text-purple-600 dark:text-purple-400",
                              from: "from-purple-500",
                              to: "to-pink-500",
                              gradientId: "purpleGradient",
                            },
                            "Ratio, Proportion and Rates of Change": {
                              text: "text-teal-600 dark:text-teal-400",
                              from: "from-teal-500",
                              to: "to-cyan-500",
                              gradientId: "tealGradient",
                            },
                            "Geometry and Measures": {
                              text: "text-green-600 dark:text-green-400",
                              from: "from-green-500",
                              to: "to-emerald-500",
                              gradientId: "greenGradient",
                            },
                            Probability: {
                              text: "text-amber-600 dark:text-amber-400",
                              from: "from-amber-500",
                              to: "to-orange-500",
                              gradientId: "amberGradient",
                            },
                            Statistics: {
                              text: "text-red-600 dark:text-red-400",
                              from: "from-red-500",
                              to: "to-rose-500",
                              gradientId: "redGradient",
                            },
                          };

                          const color = colorMap[topic.topic]?.gradientId ?? "primaryGradient";

                          acc.circles.push(
                            <circle
                              key={i}
                              cx="50"
                              cy="50"
                              r="45"
                              fill="transparent"
                              stroke={`url(#${color})`}
                              strokeWidth="10"
                              strokeDasharray={`${totalCircumference} ${totalCircumference}`}
                              strokeDashoffset={totalCircumference - offset}
                              transform={`rotate(${acc.rotation} 50 50)`}
                            />
                          );

                          acc.offset += strokeLength;
                          acc.rotation += (percentage / 100) * 360;
                          return acc;
                        },
                        { offset: 0, rotation: -90, circles: [] as JSX.Element[] }
                      ).circles}
                      <defs>
                        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
                          <stop offset="100%" stopColor="hsl(350, 84%, 60%)" />
                        </linearGradient>
                        <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(43, 96%, 58%)" />
                          <stop offset="100%" stopColor="hsl(33, 96%, 58%)" />
                        </linearGradient>
                        <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(174, 76%, 45%)" />
                          <stop offset="100%" stopColor="hsl(184, 76%, 45%)" />
                        </linearGradient>
                        <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(220, 80%, 60%)" />
                          <stop offset="100%" stopColor="hsl(260, 80%, 60%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {challengingTopics?.[0] && (
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {challengingTopics[0].percentage}%
                        </span>
                        <span className="text-xs text-muted-foreground">{challengingTopics[0].topic}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

