"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Filter, GraduationCap, PlayCircle, Search, Star, Bookmark } from "lucide-react"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Mock resource data with simplified color classes
  const resources = [
    {
      title: "Calculus Fundamentals",
      description: "A comprehensive introduction to differential and integral calculus",
      type: "Course",
      level: "Intermediate",
      duration: "8 weeks",
      rating: 4.8,
      reviews: 245,
      topics: ["Limits", "Derivatives", "Integrals"],
      provider: "Khan Academy",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Linear Algebra Interactive",
      description: "Visual explanations of vectors, matrices, and transformations",
      type: "Interactive",
      level: "Beginner",
      duration: "Self-paced",
      rating: 4.6,
      reviews: 189,
      topics: ["Vectors", "Matrices", "Transformations"],
      provider: "3Blue1Brown",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Statistics & Probability",
      description: "Learn statistical analysis and probability theory",
      type: "Video Series",
      level: "Advanced",
      duration: "12 hours",
      rating: 4.9,
      reviews: 312,
      topics: ["Probability", "Distributions", "Hypothesis Testing"],
      provider: "MIT OpenCourseWare",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Geometry Mastery",
      description: "Master geometric proofs and concepts",
      type: "Practice",
      level: "Intermediate",
      duration: "6 weeks",
      rating: 4.7,
      reviews: 156,
      topics: ["Proofs", "Triangles", "Circles"],
      provider: "Brilliant",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600 dark:text-amber-400",
    },
  ]

  // Filter resources based on search query and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLevel = !selectedLevel || resource.level === selectedLevel
    const matchesType = !selectedType || resource.type === selectedType

    return matchesSearch && matchesLevel && matchesType
  })

  const levels = ["Beginner", "Intermediate", "Advanced"]
  const types = ["Course", "Interactive", "Video Series", "Practice"]

  // Level colors - simplified approach
  const levelColors = {
    Beginner: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    Intermediate: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
    Advanced: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  }

  // Type colors - simplified approach
  const typeColors = {
    Course: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
    Interactive: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
    "Video Series": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
    Practice: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          <span className="text-gradient">Learning Resources</span>
        </h1>
        <p className="text-muted-foreground">Explore our curated collection of math learning resources</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
            <Input
              placeholder="Search resources..."
              className="pl-8 border-primary/20 focus-visible:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 border-primary/20 hover:border-primary/50 text-primary"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList className="w-full sm:w-auto bg-secondary/50 backdrop-blur-sm">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
              >
                All Resources
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
              >
                Saved
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                className={
                  selectedLevel === level
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "border-primary/20 hover:border-primary/50 text-primary"
                }
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                {level}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={
                  selectedType === type
                    ? "bg-gradient-to-r from-primary to-accent text-white"
                    : "border-primary/20 hover:border-primary/50 text-primary"
                }
              >
                {type === "Course" && <BookOpen className="mr-2 h-4 w-4" />}
                {type === "Interactive" && <PlayCircle className="mr-2 h-4 w-4" />}
                {type === "Video Series" && <PlayCircle className="mr-2 h-4 w-4" />}
                {type === "Practice" && <GraduationCap className="mr-2 h-4 w-4" />}
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource, i) => (
            <Card key={i} className="flex flex-col shadow-soft hover-lift overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${resource.color}`} />
              <CardHeader className={`${resource.bgColor}`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm">
                      <Clock className="mr-1 h-4 w-4 text-primary" />
                      <span>{resource.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="mr-1 h-4 w-4 text-amber-500" />
                      <span>{resource.rating}</span>
                      <span className="ml-1 text-muted-foreground">({resource.reviews})</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resource.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className={`${resource.bgColor} ${resource.textColor}`}>
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{resource.provider}</span>
                    <Badge variant="outline" className={levelColors[resource.level as keyof typeof levelColors]}>
                      {resource.level}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

