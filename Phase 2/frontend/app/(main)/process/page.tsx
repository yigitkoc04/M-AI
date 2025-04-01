"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Image, Trash2, Upload, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarkdownSolution } from "@/components/markdown-solution"

export default function ProcessPage() {
  const [problem, setProblem] = useState("")
  const [solution, setSolution] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [inputMethod, setInputMethod] = useState<"text" | "image">("text")

  const streamSolution = async (question: string) => {
    const response = await fetch("http://localhost:8080/api/v1/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    })

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to GPT stream.")
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })

      // Skip `: ping` lines if they appear
      if (chunk.startsWith(": ping")) continue

      // Append directly (no buffering, no splitting)
      setSolution((prev) => prev + chunk)
    }
  }

  const streamSolutionFromImage = async (imageBase64: string, context: string) => {
    const response = await fetch("http://localhost:8080/api/v1/problems/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64, context }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to GPT stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Skip `: ping` lines from the SSE stream
      if (chunk.startsWith(": ping")) continue;

      // Update solution incrementally
      setSolution((prev) => prev + chunk);
    }
  };

  const handleSolve = async () => {
    if ((inputMethod === "text" && !problem.trim()) || (inputMethod === "image" && !uploadedImage)) {
      return
    }

    setSolution("")
    setLoading(true)

    try {
      if (inputMethod === "text") {
        await streamSolution(problem.trim())
      } else if (inputMethod === "image" && uploadedImage) {
        // Strip the data:image/... prefix
        const imageBase64 = uploadedImage.split(",")[1]

        const context = problem.trim()
          ? problem.trim()
          : "Please analyze this image and solve the math problem shown."

        await streamSolutionFromImage(imageBase64, context)
      }
    } catch (err) {
      console.error("Streaming error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Clear any existing image first
      setUploadedImage(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        // Replace with the new image
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
      // Clear any existing image first
      setUploadedImage(null)

      const reader = new FileReader()
      reader.onload = (event) => {
        // Replace with the new image
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

  const clearAll = () => {
    setProblem("")
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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
          <CardDescription>Type your problem or upload an image of the problem</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs
            defaultValue="text"
            className="w-full"
            onValueChange={(value) => setInputMethod(value as "text" | "image")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="text"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
              >
                <PenLine className="h-4 w-4 mr-2" />
                Type Problem
              </TabsTrigger>
              <TabsTrigger
                value="image"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
              >
                <Image className="h-4 w-4 mr-2" />
                Upload Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="e.g., Solve for x: 2x + 5 = 13"
                className="min-h-[120px] border-primary/20 focus-visible:border-primary/50"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
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
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-90"
                          onClick={removeImage}
                          title="Remove image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-center text-sm text-muted-foreground">Image uploaded successfully</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        className="border-primary/20 hover:border-primary/50 text-primary"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Replace Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Keep the existing upload UI for when no image is present
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              {/* Optional text input for additional context with the image */}
              {uploadedImage && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Additional context (optional):</p>
                  <Textarea
                    placeholder="Add any additional details about the problem..."
                    className="min-h-[80px] border-primary/20 focus-visible:border-primary/50"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={clearAll}
            className="border-primary/20 hover:border-primary/50 text-primary"
          >
            Clear
          </Button>
          <Button
            onClick={handleSolve}
            disabled={
              (inputMethod === "text" && !problem.trim()) || (inputMethod === "image" && !uploadedImage) || loading
            }
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
        <div className="container py-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Solution</h1>

          <MarkdownSolution content={solution} />
        </div>
      )}
    </div>
  )
}

