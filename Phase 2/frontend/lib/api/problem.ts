import axios from './axios';

export interface Problem {
    id: number;
    topic: string;
    title: string;
    question: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProblemRequest {
    question: string;
}

const ProblemAPI = {
    createProblem: (data: CreateProblemRequest) => {
        return axios.post<Problem>('/problems', data, { withCredentials: true });
    },
};

export default ProblemAPI;