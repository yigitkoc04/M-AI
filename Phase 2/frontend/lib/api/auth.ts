import axios from './axios';

export interface ApiResponse<T> {
    data: T;
}

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ChangeNameRequest {
    name: string;
}

export interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

const AuthAPI = {
    signup: (data: SignupRequest) => {
        return axios.post('/auth/signup', data);
    },

    login: (data: LoginRequest) => {
        return axios.post('/auth/login', data);
    },

    logout: () => {
        return axios.post('/auth/logout', {});
    },

    getCurrentUser: () => {
        return axios.get<ApiResponse<User>>('/auth/me');
    },

    changeName: (data: ChangeNameRequest) => {
        return axios.put('/auth/me/name', data);
    },

    changePassword: (data: ChangePasswordRequest) => {
        return axios.put('/auth/me/password', data);
    },
};

export default AuthAPI;