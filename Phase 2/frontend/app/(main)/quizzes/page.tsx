"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  RotateCcw,
  Sparkles,
  Timer,
  X,
  Award,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function QuizzesPage() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [quizTitle, setQuizTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [promptOption, setPromptOption] = useState<"ai-prompt" | "struggle-areas">("ai-prompt")
  const [struggleAreas, setStruggleAreas] = useState("")

  // Mock quiz data
  const quizzes = [
    {
      id: "algebra",
      title: "Algebra Fundamentals",
      description: "Test your knowledge of basic algebraic concepts",
      difficulty: "Beginner",
      questions: 10,
      timeLimit: "5 minutes",
      category: "Algebra",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "calculus",
      title: "Differential Calculus",
      description: "Practice derivatives and related concepts",
      difficulty: "Intermediate",
      questions: 8,
      timeLimit: "10 minutes",
      category: "Calculus",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "geometry",
      title: "Geometric Proofs",
      description: "Test your understanding of geometric theorems",
      difficulty: "Advanced",
      questions: 6,
      timeLimit: "15 minutes",
      category: "Geometry",
      color: "from-green-500 to-teal-500",
    },
    {
      id: "statistics",
      title: "Probability & Statistics",
      description: "Explore concepts in probability and statistical analysis",
      difficulty: "Intermediate",
      questions: 12,
      timeLimit: "12 minutes",
      category: "Statistics",
      color: "from-orange-500 to-amber-500",
    },
  ]

  // Mock questions for the active quiz
  const questions = [
    {
      id: 1,
      question: "Solve for x: 3x + 7 = 22",
      options: ["x = 5", "x = 7", "x = 15", "x = 3"],
      correctAnswer: "x = 5",
    },
    {
      id: 2,
      question: "If f(x) = 2x² - 3x + 1, what is f(2)?",
      options: ["3", "5", "7", "9"],
      correctAnswer: "5",
    },
    {
      id: 3,
      question: "Simplify: (3x² + 2x - 1) - (x² - 2x + 3)",
      options: ["2x² + 4x - 4", "4x² + 0x - 4", "2x² + 0x - 4", "4x² + 4x - 4"],
      correctAnswer: "2x² + 4x - 4",
    },
  ]

  // Mock performance data for the graph
  const performanceData = {
    categories: ["Algebra", "Calculus", "Geometry", "Statistics", "Probability"],
    scores: [85, 62, 78, 45, 70],
    colors: [
      "bg-gradient-to-r from-blue-500 to-indigo-500",
      "bg-gradient-to-r from-purple-500 to-pink-500",
      "bg-gradient-to-r from-green-500 to-teal-500",
      "bg-gradient-to-r from-orange-500 to-amber-500",
      "bg-gradient-to-r from-red-500 to-rose-500",
    ],
  }

  const startQuiz = (quizId: string) => {
    setActiveQuiz(quizId)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setTimeRemaining(300) // Reset timer
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer,
    })
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = () => {
    setQuizSubmitted(true)
  }

  const resetQuiz = () => {
    setActiveQuiz(null)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizSubmitted(false)
  }

  const openCreateModal = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setAiPrompt("")
    setQuizTitle("")
    setGenerationError(null)
    setPromptOption("ai-prompt")
    setStruggleAreas("")
  }

  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) return
    if (
      (promptOption === "ai-prompt" && !aiPrompt.trim()) ||
      (promptOption === "struggle-areas" && !struggleAreas.trim())
    )
      return

    setIsGenerating(true)
    setGenerationError(null)

    try {
      // Construct the prompt based on the selected option
      const promptText =
        promptOption === "ai-prompt"
          ? `Create a math quiz about: ${aiPrompt}`
          : `Create a math quiz focusing on these areas where the student struggles: ${struggleAreas}. Make sure to include explanations for correct answers.`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: promptText,
        system:
          "You are a math education expert. Create a quiz with 5 multiple-choice questions. Each question should have 4 options and one correct answer. Format your response as JSON.",
      })

      console.log("Generated quiz:", text)

      // In a real app, we would parse the response and add it to the quizzes list
      // For now, we'll just close the modal after a delay
      setTimeout(() => {
        setIsGenerating(false)
        closeCreateModal()
        // Here you would add the new quiz to the quizzes list
      }, 1000)
    } catch (error) {
      console.error("Error generating quiz:", error)
      setGenerationError("Failed to generate quiz. Please try again.")
      setIsGenerating(false)
    }
  }

  // Calculate score
  const calculateScore = () => {
    let correct = 0
    Object.keys(selectedAnswers).forEach((questionIndex) => {
      const index = Number.parseInt(questionIndex)
      if (selectedAnswers[index] === questions[index].correctAnswer) {
        correct++
      }
    })
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    }
  }

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (!activeQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              <span className="text-gradient">Quizzes</span>
            </h1>
            <p className="text-muted-foreground">
              Test your knowledge with our AI-generated quizzes tailored to your skill level.
            </p>
          </div>
          <Button
            className="hidden sm:flex items-center bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            onClick={openCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Quiz
          </Button>
        </div>

        {/* Mobile Create Quiz Button */}
        <div className="sm:hidden">
          <Button
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            onClick={openCreateModal}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Quiz
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList className="w-full sm:w-auto overflow-x-auto bg-secondary/50 backdrop-blur-sm">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
                  >
                    All Quizzes
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="border-primary/20 hover:border-primary/50">
                <Filter className="mr-2 h-4 w-4 text-primary" />
                Filter
              </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden shadow-soft hover-lift">
                  <div className={`h-2 bg-gradient-to-r ${quiz.color}`} />
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>{quiz.timeLimit}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {quiz.category}
                        </span>
                        <span className="ml-2 inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full bg-gradient-to-r ${quiz.color} hover:opacity-90 transition-opacity`}
                      onClick={() => startQuiz(quiz.id)}
                    >
                      Start Quiz
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Graph */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-lg">Quiz Performance</CardTitle>
                </div>
                <CardDescription>Your performance across different topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {performanceData.categories.map((category, index) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{performanceData.scores[index]}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${performanceData.colors[index]}`}
                        style={{ width: `${performanceData.scores[index]}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">
                        Total Quizzes: <span className="text-primary">24</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1 text-accent" />
                      <span className="font-medium">
                        Avg. Score: <span className="text-accent">68%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Custom Quiz Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="h-2 bg-gradient-to-r from-primary to-accent" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Create Custom Quiz
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input
                      id="quiz-title"
                      placeholder="Enter a title for your quiz"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="border-primary/20 focus-visible:border-primary/50"
                    />
                  </div>

                  <div className="border rounded-md p-1 border-primary/20">
                    <div className="flex">
                      <button
                        className={cn(
                          "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          promptOption === "ai-prompt"
                            ? "bg-gradient-to-r from-primary to-accent text-white"
                            : "hover:bg-muted",
                        )}
                        onClick={() => setPromptOption("ai-prompt")}
                      >
                        AI Prompt
                      </button>
                      <button
                        className={cn(
                          "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          promptOption === "struggle-areas"
                            ? "bg-gradient-to-r from-primary to-accent text-white"
                            : "hover:bg-muted",
                        )}
                        onClick={() => setPromptOption("struggle-areas")}
                      >
                        Areas I Struggle
                      </button>
                    </div>
                  </div>

                  {promptOption === "ai-prompt" ? (
                    <div className="space-y-2">
                      <Label htmlFor="ai-prompt">AI Prompt</Label>
                      <Textarea
                        id="ai-prompt"
                        placeholder="Describe the quiz you want to create (e.g., 'Create a quiz about quadratic equations for high school students')"
                        className="min-h-[120px] border-primary/20 focus-visible:border-primary/50"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Be specific about the topic, difficulty level, and target audience.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Set a default value for struggle areas */}
                      {struggleAreas === "" && setStruggleAreas("Algebra, Calculus, Geometry")}
                    </div>
                  )}

                  {generationError && <div className="text-sm text-destructive">{generationError}</div>}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 bg-muted/50 p-4 border-t">
                <Button variant="outline" onClick={closeCreateModal} disabled={isGenerating}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  onClick={handleCreateQuiz}
                  disabled={
                    (promptOption === "ai-prompt" && !aiPrompt.trim()) ||
                    (promptOption === "struggle-areas" && !struggleAreas.trim()) ||
                    !quizTitle.trim() ||
                    isGenerating
                  }
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-pulse">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (quizSubmitted) {
    const score = calculateScore()

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient">Quiz Results</span>
          </h1>
          <p className="text-muted-foreground">See how you performed on this quiz</p>
        </div>

        <Card className="math-animation shadow-soft overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle>Your Score: {score.percentage}%</CardTitle>
            <CardDescription>
              You got {score.correct} out of {score.total} questions correct
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="h-4 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${score.percentage}%` }}
              />
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Question Review
              </h3>
              {questions.map((question, index) => (
                <div key={index} className="rounded-lg border p-4 shadow-soft">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <p className="mt-1">{question.question}</p>
                    </div>
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <div className="rounded-full bg-green-500/10 p-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-red-500/10 p-1">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={cn(
                          "flex items-center rounded-md border p-2",
                          option === question.correctAnswer && "border-green-500 bg-green-500/10",
                          selectedAnswers[index] === option &&
                            option !== question.correctAnswer &&
                            "border-red-500 bg-red-500/10",
                        )}
                      >
                        <span>{option}</span>
                        {option === question.correctAnswer && <Check className="ml-auto h-4 w-4 text-green-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetQuiz} className="border-primary/20 hover:border-primary/50">
              <RotateCcw className="mr-2 h-4 w-4 text-primary" />
              Back to Quizzes
            </Button>
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              Try Similar Quiz
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">{quizzes.find((q) => q.id === activeQuiz)?.title}</span>
        </h1>
        <p className="text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-[70%] h-4 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Timer className="h-4 w-4 text-primary" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <Card className="math-animation shadow-soft overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <RadioGroup value={selectedAnswers[currentQuestion]} onValueChange={handleAnswerSelect} className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-4 transition-all hover:bg-accent/10",
                  selectedAnswers[currentQuestion] === option && "border-primary bg-primary/10",
                )}
              >
                <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
                <Label htmlFor={`option-${index}`} className="flex flex-1 cursor-pointer items-center justify-between">
                  <span>{option}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="border-primary/20 hover:border-primary/50"
          >
            Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion === questions.length - 1 ? (
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                onClick={submitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                onClick={nextQuestion}
                disabled={!selectedAnswers[currentQuestion]}
              >
                Next Question
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

