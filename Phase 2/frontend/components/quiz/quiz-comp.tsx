import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import QuizAPI, { Question } from "@/lib/api/quiz";
import { useToast } from "@/hooks/use-toast";

type QuizProps = {
  id: number;
  title: string;
  questions: Question[];
  selectedAnswers: Record<number, string>;
  setSelectedAnswers: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  setQuizSubmitted: React.Dispatch<boolean>;
};

function QuizComp({
  id,
  title,
  questions,
  selectedAnswers,
  setSelectedAnswers,
  setQuizSubmitted,
}: QuizProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questions[currentQuestion].ID]: answer,
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await QuizAPI.completeQuiz({
        quiz_id: id,
        answers: selectedAnswers,
      });

      setQuizSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toast({ title: "Error occured while submitting quiz" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-[70%] h-4 rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>
      <Card className="shadow-soft overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-xl">
            {questions[currentQuestion]?.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <RadioGroup
            value={selectedAnswers[questions[currentQuestion].ID]}
            onValueChange={handleAnswerSelect}
            className="space-y-3"
          >
            {(["A", "B", "C", "D"] as const).map((option) => {
              const question = questions[currentQuestion];
              const answerText =
                option === "A"
                  ? question?.answer_a
                  : option === "B"
                  ? question?.answer_b
                  : option === "C"
                  ? question?.answer_c
                  : question?.answer_d;

              const isSelected =
                selectedAnswers[questions[currentQuestion].ID] === option;

              return (
                <Label
                  key={option}
                  htmlFor={`option-${option}`}
                  className={cn(
                    "flex items-center space-x-2 rounded-md border p-4 transition-all cursor-pointer",
                    "hover:bg-accent/10",
                    isSelected && "border-primary bg-primary/10"
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${option}`}
                    className="sr-only"
                  />
                  <span>
                    {option}) {answerText}
                  </span>
                </Label>
              );
            })}
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
                onClick={handleSubmit}
                disabled={
                  Object.keys(selectedAnswers).length < questions.length ||
                  loading
                }
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                onClick={nextQuestion}
                disabled={!selectedAnswers[questions[currentQuestion].ID]}
              >
                Next Question
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default QuizComp;
