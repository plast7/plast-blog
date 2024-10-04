import React, { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading, error } = useQuery(['auth'], async () => {
    const response = await api.get('/auth/check-auth/');
    return response.data;
  }, {
    retry: false, // 인증 실패 시 재시도 방지
  });

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

