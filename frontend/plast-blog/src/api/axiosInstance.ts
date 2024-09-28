import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // 필요에 따라 다른 설정 추가
});

export default api;
