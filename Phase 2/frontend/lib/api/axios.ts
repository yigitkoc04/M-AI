import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // your backend base URL
    withCredentials: true,            // ensures cookies (like JWT) are sent
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;