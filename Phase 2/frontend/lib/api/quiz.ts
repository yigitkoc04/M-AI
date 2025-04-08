import axios from "./axios";

export interface CreateQuizRequest {
  title: string;
  topic: string;
  questions: {
    question: string;
    correctAnswer: string;
    choices: string[];
  }[];
}

export interface QuizSummary {
  id: number;
  level: string;
  created_at: string;
  title: string;
  description: string;
  topics: string[];
  question_count: number;
  score: number;
  completed_at: string | null;
  questions: Question[];
}

export interface Question {
  ID: number;
  quiz_id: number;
  question: string;
  answer: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  topic: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const QuizAPI = {
  createQuiz: (data: CreateQuizRequest) => {
    return axios.post("/quizzes", data, { withCredentials: true });
  },

  listQuizzes: (params?: { search?: string; filter?: "all" | "completed" }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.filter) query.append("filter", params.filter);

    const url = `/quizzes${query.toString() ? "?" + query.toString() : ""}`;
    return axios.get<QuizSummary[]>(url, { withCredentials: true });
  },

  completeQuiz: (data: {
    quiz_id: number;
    answers: Record<number, string>;
  }) => {
    return axios.post("/quizzes/complete", data, { withCredentials: true });
  },

  generateAIQuiz: (data: {
    title: string;
    description: string;
    prompt: string;
    level: string;
    prompt_type: string;
  }) => {
    return axios.post("/quizzes/generate", data, { withCredentials: true });
  },
};

export default QuizAPI;
