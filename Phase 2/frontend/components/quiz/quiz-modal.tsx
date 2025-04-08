import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import QuizAPI, { QuizSummary } from "@/lib/api/quiz";

type QuizProps = {
  closeCreateModal: () => void;
  setSelectedQuiz: React.Dispatch<React.SetStateAction<QuizSummary | null>>;
};

function QuizModal({ closeCreateModal, setSelectedQuiz }: QuizProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizLevel, setQuizLevel] = useState("beginner");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [promptOption, setPromptOption] = useState<
    "ai-prompt" | "struggle-areas"
  >("ai-prompt");

  const handleCreateQuiz = async () => {
    if (!quizTitle.trim()) return;
    if (!quizLevel) return;
    if (promptOption === "ai-prompt" && !aiPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await QuizAPI.generateAIQuiz({
        title: quizTitle,
        description: quizDescription,
        prompt: aiPrompt,
        level: quizLevel,
        prompt_type: promptOption,
      });

      setIsGenerating(false);
      setSelectedQuiz(response.data.data);
      closeCreateModal();
    } catch (error) {
      console.error("Error generating quiz:", error);
      setGenerationError("Failed to generate quiz. Please try again.");
      setIsGenerating(false);
    }
  };

  return (
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
            <div className="space-y-2">
              <Label htmlFor="quiz-title">Quiz Decription</Label>
              <Input
                id="quiz-title"
                placeholder="Enter a description for your quiz"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="border-primary/20 focus-visible:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quiz-level">Quiz Level</Label>
              <Select value={quizLevel} onValueChange={setQuizLevel}>
                <SelectTrigger
                  id="quiz-level"
                  className="border-primary/20 focus-visible:border-primary/50"
                >
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md p-1 border-primary/20">
              <div className="flex">
                <button
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    promptOption === "ai-prompt"
                      ? "bg-gradient-to-r from-primary to-accent text-white"
                      : "hover:bg-muted"
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
                      : "hover:bg-muted"
                  )}
                  onClick={() => setPromptOption("struggle-areas")}
                >
                  Areas I Struggle
                </button>
              </div>
            </div>
            {promptOption === "ai-prompt" && (
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">AI Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Describe the quiz you want to create (e.g., 'Create a quiz about quadratic equations for high school students')"
                  className="min-h-[120px] border-primary/20 focus-visible:border-primary/50"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
            )}
            {generationError && (
              <div className="text-sm text-destructive">{generationError}</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 bg-muted/50 p-4 border-t">
          <Button
            variant="outline"
            onClick={closeCreateModal}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            onClick={handleCreateQuiz}
            disabled={
              (promptOption === "ai-prompt" && !aiPrompt.trim()) ||
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
  );
}

export default QuizModal;
