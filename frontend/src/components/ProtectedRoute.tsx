import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (authContext.isLoading) {
    // 로딩 스피너 등 표시
    return <div>Loading...</div>;
  }

  if (!authContext.isAuthenticated) {
    return {
      redirect: '/login',
    };
  }

  return children;
};

export default ProtectedRoute;
