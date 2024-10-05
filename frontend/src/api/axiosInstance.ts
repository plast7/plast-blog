import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh-token/'); // 리프레시 토큰 엔드포인트 호출
        return api(originalRequest);
      } catch (err) {
        await api.post('/auth/logout/');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);


export default api;
