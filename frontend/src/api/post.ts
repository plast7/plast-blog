import api from './axiosInstance';

export const post = async ({title, category, content}) => {
  const response = await api.post('posts/', { title, category, content });
  return response.data;
};
