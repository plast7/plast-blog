// src/components/PrivateRoute.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { useRouter, useRouterState } from '@tanstack/react-router';

const PrivateRoute = ({ children }) => {
  const { user, isLoading, error } = useAuth();
  const router = useRouter();
  const state = useRouterState()

  React.useEffect(() => {
    if (!isLoading && !user) {
      // 로그인되지 않은 상태라면 로그인 페이지로 리디렉션
      router.navigate({ to: '/login', search: { redirectTo: state.location } });
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return null; // 리디렉션이 발생하므로 아무 것도 렌더링하지 않습니다.
  }

  return children;
};

export default PrivateRoute;
