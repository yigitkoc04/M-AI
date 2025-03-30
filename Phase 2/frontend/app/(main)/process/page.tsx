"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, ChevronRight, Image, Lightbulb, Trash2, Upload, Sparkles, Target, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function ProcessPage() {
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSolve = async () => {
    if (!problem.trim() && !uploadedImage) return

    setLoading(true)
    setSolution(null)
    setActiveStep(0)
    setShowHint(false)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Solve this math problem step by step: ${problem}${uploadedImage ? " (User has also uploaded an image of the problem)" : ""}`,
        system:
          "You are a helpful math tutor. Break down the solution into clear, numbered steps. Use markdown for formatting and LaTeX for equations. Keep explanations concise but thorough.",
      })

      setSolution(text)
    } catch (error) {
      console.error("Error solving problem:", error)
      setSolution("Sorry, there was an error solving this problem. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Mock steps for the solution process with simplified styling
  const steps = [
    {
      title: "Understand the Problem",
      content: "First, let's identify what we're looking for and what information we have.",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-500/10",
      icon: Target,
    },
    {
      title: "Identify the Approach",
      content: "Based on the problem, we'll use the appropriate mathematical technique.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      icon: Lightbulb,
    },
    {
      title: "Apply the Method",
      content: "Now we'll work through the solution step by step.",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-500/10",
      icon: Calculator,
    },
    {
      title: "Verify the Answer",
      content: "Finally, let's check our answer to make sure it makes sense.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          <span className="text-gradient">Problem Solver</span>
        </h1>
        <p className="text-muted-foreground">Enter a math problem and get a step-by-step solution with explanations.</p>
      </div>

      <Card className="shadow-soft overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Enter Your Problem</CardTitle>
          </div>
          <CardDescription>Type or paste your math problem below, or upload an image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Textarea
            placeholder="e.g., Solve for x: 2x + 5 = 13"
            className="min-h-[120px] border-primary/20 focus-visible:border-primary/50"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />

          <div
            className={cn(
              "border-2 border-dashed rounded-md p-6 transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-primary/20",
              uploadedImage ? "bg-muted/30" : "bg-transparent",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative mx-auto max-w-xs overflow-hidden rounded-md shadow-md">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded problem"
                    className="w-full h-auto object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
                    onClick={removeImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">Image uploaded successfully</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-gradient-to-r from-primary/20 to-accent/20 p-3">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Drag and drop your image here</p>
                  <p className="text-xs text-muted-foreground">Supports JPG, PNG and GIF up to 10MB</p>
                </div>
                <Button
                  variant="outline"
                  onClick={triggerFileInput}
                  className="border-primary/20 hover:border-primary/50 text-primary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setProblem("")
              setUploadedImage(null)
              if (fileInputRef.current) {
                fileInputRef.current.value = ""
              }
            }}
            className="border-primary/20 hover:border-primary/50 text-primary"
          >
            Clear
          </Button>
          <Button
            onClick={handleSolve}
            disabled={(!problem.trim() && !uploadedImage) || loading}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <span className="animate-pulse">Solving...</span>
            ) : (
              <>
                Solve Problem
                <Calculator className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {solution && (
        <Card className="shadow-soft overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-accent" />
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Solution Process</CardTitle>
            </div>
            <CardDescription>Follow the step-by-step solution to your problem</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="guided" className="space-y-4">
              <TabsList className="bg-secondary/50 backdrop-blur-sm">
                <TabsTrigger
                  value="guided"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
                >
                  Guided Solution
                </TabsTrigger>
                <TabsTrigger
                  value="full"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
                >
                  Full Solution
                </TabsTrigger>
              </TabsList>
              <TabsContent value="guided" className="space-y-4">
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-lg border p-4 transition-all shadow-soft hover-lift",
                        index === activeStep ? step.bgColor : "opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`rounded-full bg-gradient-to-r ${step.color} p-1.5 mr-2`}>
                            <step.icon className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-medium">
                            Step {index + 1}: {step.title}
                          </h3>
                        </div>
                        {index === activeStep && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHint(!showHint)}
                            className="text-primary hover:text-accent hover:bg-primary/10"
                          >
                            <Lightbulb className="h-4 w-4 mr-1" />
                            {showHint ? "Hide Hint" : "Show Hint"}
                          </Button>
                        )}
                      </div>
                      {(index < activeStep || (index === activeStep && showHint)) && (
                        <p className="mt-2 text-sm text-muted-foreground ml-9">{step.content}</p>
                      )}
                      {index === activeStep && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (activeStep < steps.length - 1) {
                                setActiveStep(activeStep + 1)
                                setShowHint(false)
                              }
                            }}
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                          >
                            Next Step
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="full">
                <div className="rounded-lg border p-4 prose dark:prose-invert max-w-none shadow-soft">
                  <div dangerouslySetInnerHTML={{ __html: solution.replace(/\n/g, "<br />") }} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

