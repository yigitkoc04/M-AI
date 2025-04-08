import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award, Check, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question } from "@/lib/api/quiz";

type QuizProps = {
  id: number;
  questions: Question[];
  selectedAnswers: Record<number, string>;
  resetQuiz: () => void;
};

function QuizResult({ id, selectedAnswers, questions, resetQuiz }: QuizProps) {
  const calculateScore = () => {
    let correct = 0;
    Object.keys(selectedAnswers).forEach((questionIndex) => {
      const index = Number.parseInt(questionIndex);
      if (
        selectedAnswers[index] === questions.find((q) => q.ID === index)?.answer
      ) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const score = calculateScore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">Quiz Results</span>
        </h1>
        <p className="text-muted-foreground">
          See how you performed on this quiz
        </p>
      </div>
      <Card className="shadow-soft overflow-hidden">
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
                  {selectedAnswers[question.ID] === question.answer ? (
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
                  {(["A", "B", "C", "D"] as const).map((option) => {
                    const answerText =
                      option === "A"
                        ? question.answer_a
                        : option === "B"
                        ? question.answer_b
                        : option === "C"
                        ? question.answer_c
                        : question.answer_d;

                    console.log(selectedAnswers);
                    const isCorrect = question.answer === option;
                    const isSelected = selectedAnswers[question.ID] === option;

                    return (
                      <div
                        key={option}
                        className={cn(
                          "flex items-center rounded-md border p-2",
                          isCorrect && "border-green-500 bg-green-500/10",
                          isSelected &&
                            !isCorrect &&
                            "border-red-500 bg-red-500/10"
                        )}
                      >
                        <span>{answerText}</span>
                        {isCorrect && (
                          <Check className="ml-auto h-4 w-4 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Back to Quizzes
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default QuizResult;
