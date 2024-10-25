import api from './axiosInstance';

export const write = async ({title, category, content}) => {
  const response = await api.post('posts/', { title, category, content });
  return response.data;
};

export const getPostList = async ({category}) => {
  const response = await api.get(`posts/?category=${category}`);
  return response.data;
};

export const getPostDetail = async ({postId}) => {
  const response = await api.get(`posts/${postId}`);
  return response.data;
};
