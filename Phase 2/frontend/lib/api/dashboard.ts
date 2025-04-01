import { ApiResponse } from './auth';
import axios from './axios';

export interface DashboardStats {
    quizzes_completed: number;
    accuracy_rate: number;
    most_challenging_topic: string;
}

export interface RecentActivityItem {
    id: number;
    title: string;
    type: string;
    timestamp: string;
}

export interface TopicProficiencyItem {
    topic: string;
    correct: number;
    total: number;
    percentage: number;
}

export interface ChallengingTopicItem {
    topic: string;
    wrongAnswers: number;
    percentage: number;
}

const DashboardAPI = {
    getStats: () => {
        return axios.get<ApiResponse<DashboardStats>>('/dashboard/stats', { withCredentials: true });
    },

    getRecentActivity: () => {
        return axios.get<ApiResponse<RecentActivityItem[]>>('/dashboard/recent', { withCredentials: true });
    },

    getTopicProficiency: () => {
        return axios.get<ApiResponse<TopicProficiencyItem[]>>('/dashboard/proficiency', { withCredentials: true });
    },

    getChallengingTopics: () => {
        return axios.get<ApiResponse<ChallengingTopicItem[]>>('/dashboard/challenges', { withCredentials: true });
    },
};

export default DashboardAPI;