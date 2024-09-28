// src/api/posts.ts
import api from './axiosInstance';

export interface Post {
  id: number;
  title: string;
  // 필요에 따라 다른 필드 추가
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>('/blog/api/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};
