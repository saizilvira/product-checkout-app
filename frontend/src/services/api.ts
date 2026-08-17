import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.message ||
            'Error de conexión con el servidor'
        return Promise.reject(new Error(message))
    },
)