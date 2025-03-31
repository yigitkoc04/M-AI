import { ApiResponse } from './auth';
import axios from './axios';

export interface Resource {
    id: number;
    title: string;
    description: string;
    link: string;
    topic: string[];
    level: string;
    createdAt: string;
}

const ResourceAPI = {
    getResources: (params?: { search?: string; level?: string }) => {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.level) queryParams.append('level', params.level);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        return axios.get<ApiResponse<Resource[]>>(`/resources${queryString}`, {
            withCredentials: true,
        });
    },
};

export default ResourceAPI;
