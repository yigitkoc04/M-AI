import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calculator, CheckCircle, Target, AlertTriangle, BarChart, PieChart } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          <span className="text-gradient">Welcome back, Alex</span>
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
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft hover-lift overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-500/10 to-teal-500/10">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">87%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft hover-lift overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-red-500/10 to-rose-500/10">
            <CardTitle className="text-sm font-medium">Most Challenging Topic</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">Statistics</div>
            <p className="text-xs text-muted-foreground">45% accuracy rate</p>
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
              {[
                {
                  title: "Completed Quiz: Quadratic Equations",
                  time: "Today, 10:30 AM",
                  score: "8/10",
                  icon: BookOpen,
                  color: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20",
                  iconColor: "text-blue-500",
                },
                {
                  title: "Solved Problem: Ratio and Proportion",
                  time: "Yesterday, 3:45 PM",
                  score: "Correct",
                  icon: Calculator,
                  color: "bg-gradient-to-r from-teal-500/20 to-cyan-500/20",
                  iconColor: "text-teal-500",
                },
                {
                  title: "Completed Quiz: Number Properties",
                  time: "2 days ago, 5:20 PM",
                  score: "7/10",
                  icon: BookOpen,
                  color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
                  iconColor: "text-green-500",
                },
                {
                  title: "Solved Problem: Geometry and Measures",
                  time: "3 days ago, 11:15 AM",
                  score: "Partially Correct",
                  icon: Calculator,
                  color: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
                  iconColor: "text-amber-500",
                },
                {
                  title: "Completed Quiz: Probability Theory",
                  time: "4 days ago, 2:00 PM",
                  score: "9/10",
                  icon: BookOpen,
                  color: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
                  iconColor: "text-red-500",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 rounded-lg border p-3 shadow-soft hover-lift">
                  <div className={`rounded-full p-2 ${activity.color}`}>
                    <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-sm font-medium text-primary">{activity.score}</div>
                </div>
              ))}
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
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* First row of graphs */}
          <Card className="shadow-soft overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle>Topic Proficiency</CardTitle>
              <CardDescription>Your progress across different math topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Number</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">82%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: "82%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Algebra</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Ratio, Proportion and Rates of Change</span>
                  </div>
                  <span className="text-sm font-medium text-teal-600 dark:text-teal-400">68%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Geometry and Measures</span>
                  </div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">70%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Probability</span>
                  </div>
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">62%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: "62%" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Statistics</span>
                  </div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">45%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
            <CardHeader className="bg-gradient-to-r from-green-500/5 to-teal-500/5">
              <CardTitle>Accuracy Rate</CardTitle>
              <CardDescription>Monthly accuracy trend</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[250px] w-full bg-muted/30 rounded-md p-4 relative">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  <polyline
                    points="0,140 50,120 100,100 150,110 200,80 250,30"
                    fill="none"
                    stroke="url(#greenGradient)"
                    strokeWidth="3"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(142, 76%, 45%)" />
                      <stop offset="100%" stopColor="hsl(174, 76%, 45%)" />
                    </linearGradient>
                  </defs>
                  {/* Dots at data points */}
                  <circle cx="0" cy="140" r="4" fill="hsl(142, 76%, 45%)" />
                  <circle cx="50" cy="120" r="4" fill="hsl(142, 76%, 45%)" />
                  <circle cx="100" cy="100" r="4" fill="hsl(142, 76%, 45%)" />
                  <circle cx="150" cy="110" r="4" fill="hsl(142, 76%, 45%)" />
                  <circle cx="200" cy="80" r="4" fill="hsl(142, 76%, 45%)" />
                  <circle cx="250" cy="30" r="4" fill="hsl(142, 76%, 45%)" />
                </svg>
                <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                  <span className="text-xs text-muted-foreground">Jan</span>
                  <span className="text-xs text-muted-foreground">Feb</span>
                  <span className="text-xs text-muted-foreground">Mar</span>
                  <span className="text-xs text-muted-foreground">Apr</span>
                  <span className="text-xs text-muted-foreground">May</span>
                  <span className="text-xs text-muted-foreground">Jun</span>
                </div>
              </div>
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Statistics</span>
                      </div>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">45%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Probability</span>
                      </div>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">62%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: "62%" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Ratio, Proportion and Rates of Change</span>
                      </div>
                      <span className="text-sm font-medium text-teal-600 dark:text-teal-400">68%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                        style={{ width: "68%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative h-[200px] w-[200px]">
                    {/* Simplified pie chart visualization */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e2e8f0" strokeWidth="10" />

                      {/* Statistics - 45% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke="url(#redGradient)"
                        strokeWidth="10"
                        strokeDasharray="282.6 282.6"
                        strokeDashoffset="155.4"
                        transform="rotate(-90 50 50)"
                      />

                      {/* Probability - 62% (starts at 45%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke="url(#amberGradient)"
                        strokeWidth="10"
                        strokeDasharray="282.6 282.6"
                        strokeDashoffset="107.4"
                        transform="rotate(72 50 50)"
                      />

                      {/* Ratio - 68% (starts at 45% + 62% = 107%) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke="url(#tealGradient)"
                        strokeWidth="10"
                        strokeDasharray="282.6 282.6"
                        strokeDashoffset="90.4"
                        transform="rotate(295.2 50 50)"
                      />

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
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">45%</span>
                      <span className="text-xs text-muted-foreground">Statistics</span>
                    </div>
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

