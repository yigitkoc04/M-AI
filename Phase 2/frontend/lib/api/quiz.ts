import axios from './axios';

export interface CreateQuizRequest {
    title: string;
    topic: string;
    time: string; // ISO string or custom depending on backend
    questions: {
        question: string;
        correctAnswer: string;
        choices: string[];
    }[];
}

export interface QuizSummary {
    id: number;
    title: string;
    topic: string;
    time: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    createdAt: string;
}

const QuizAPI = {
    createQuiz: (data: CreateQuizRequest) => {
        return axios.post('/quizzes', data, { withCredentials: true });
    },

    listQuizzes: (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return axios.get<QuizSummary[]>(`/quizzes${query}`, { withCredentials: true });
    },
};

export default QuizAPI;