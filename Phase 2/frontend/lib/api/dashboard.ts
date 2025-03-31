import axios from './axios';

export interface DashboardStats {
    totalQuizzes: number;
    accuracyRate: number;
    mostChallengingTopic: string;
}

export interface RecentActivityItem {
    quizId: number;
    quizTitle: string;
    completedAt: string;
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
        return axios.get<DashboardStats>('/dashboard/stats', { withCredentials: true });
    },

    getRecentActivity: () => {
        return axios.get<RecentActivityItem[]>('/dashboard/recent', { withCredentials: true });
    },

    getTopicProficiency: () => {
        return axios.get<TopicProficiencyItem[]>('/dashboard/proficiency', { withCredentials: true });
    },

    getChallengingTopics: () => {
        return axios.get<ChallengingTopicItem[]>('/dashboard/challenges', { withCredentials: true });
    },
};

export default DashboardAPI;