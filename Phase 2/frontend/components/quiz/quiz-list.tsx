import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Filter, Plus, Award, TrendingUp } from "lucide-react";
import QuizAPI, { QuizSummary } from "@/lib/api/quiz";
import QuizModal from "./quiz-modal";
import { cn } from "@/lib/utils";

function QuizList({
  setSelectedQuiz,
}: {
  setSelectedQuiz: React.Dispatch<React.SetStateAction<QuizSummary | null>>;
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [filter, setFilter] = useState<"all" | "completed">("all");
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await QuizAPI.listQuizzes({ filter });
        // @ts-ignore
        setQuizzes(res.data.data);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      } finally {
      }
    };

    fetchQuizzes();
  }, [filter]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            <span className="text-gradient">Quizzes</span>
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge with our AI-generated quizzes tailored to your
            skill level.
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
      <div className="sm:hidden">
        <Button
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          onClick={openCreateModal}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Custom Quiz
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        <Tabs
          defaultValue="all"
          value={filter}
          onValueChange={(val) => setFilter(val as "all" | "completed")}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto overflow-x-auto bg-secondary/50 backdrop-blur-sm p-0 rounded-md">
            <TabsTrigger
              value="all"
              className={cn(
                "px-4 py-2 rounded-md",
                filter === "all" && "border border-primary text-primary"
              )}
            >
              All Quizzes
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={cn(
                "px-4 py-2 rounded-md",
                filter === "completed" && "border border-primary text-primary"
              )}
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap">
          {(quizzes || []).map((quiz, i) => (
            <div className="lg:w-1/3 w-full p-4">
              <Card
                key={quiz.id}
                className="overflow-hidden shadow-soft hover-lift w-full"
              >
                <div className={`h-2 ${colors[i % colors.length]}`} />
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle>{quiz?.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{quiz.question_count} questions</span>
                    </div>
                    <div className="col-span-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {quiz.level.charAt(0).toUpperCase() +
                          quiz.level.slice(1)}
                      </span>
                      {quiz.topics?.map((topic, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent"
                        >
                          {topic}
                        </span>
                      ))}
                      {quiz.completed_at && (
                        <>
                          <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                            Completed on{" "}
                            {new Date(quiz.completed_at).toLocaleString(
                              "en-GB",
                              {
                                timeZone: "Europe/London",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                            Score: {quiz.score}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full hover:${colors[i % colors.length]} ${colors[i % colors.length]
                      } hover:opacity-90 transition-opacity`}
                    onClick={() => setSelectedQuiz(quiz)}
                    disabled={!!quiz.completed_at}
                  >
                    {quiz.completed_at ? "Quiz Solved" : "Start Quiz"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {isCreateModalOpen && (
        <QuizModal
          closeCreateModal={closeCreateModal}
          setSelectedQuiz={setSelectedQuiz}
        />
      )}
    </div>
  );
}

export default QuizList;
