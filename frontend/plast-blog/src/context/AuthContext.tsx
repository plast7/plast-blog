import React, { createContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';

interface User {
  id: number;
  name: string;
  email: string;
  // 필요한 필드 추가
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await api.get('/auth/check-auth/');
      return response.data;
    },
    retry: false, // 인증 실패 시 재시도 방지
  });

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
