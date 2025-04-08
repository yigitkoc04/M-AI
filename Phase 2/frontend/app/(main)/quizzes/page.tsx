"use client";

import { useEffect, useState } from "react";
import { QuizSummary } from "@/lib/api/quiz";
import QuizComp from "@/components/quiz/quiz-comp";
import QuizResult from "@/components/quiz/quiz-result";
import QuizList from "@/components/quiz/quiz-list";

export default function QuizzesPage() {
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSummary | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});

  const resetQuiz = () => {
    setSelectedQuiz(null);
  };

  useEffect(() => {
    setQuizSubmitted(false);
  }, [selectedQuiz]);

  if (!selectedQuiz) {
    return <QuizList setSelectedQuiz={setSelectedQuiz} />;
  }

  if (quizSubmitted) {
    return (
      <QuizResult
        id={selectedQuiz?.id || 0}
        questions={selectedQuiz?.questions || []}
        selectedAnswers={selectedAnswers}
        resetQuiz={resetQuiz}
      />
    );
  }

  return (
    <QuizComp
      id={selectedQuiz?.id || 0}
      title={selectedQuiz?.title || ""}
      questions={selectedQuiz?.questions || []}
      selectedAnswers={selectedAnswers}
      setSelectedAnswers={setSelectedAnswers}
      setQuizSubmitted={setQuizSubmitted}
    />
  );
}
