import React, { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { login, checkAuth } from '../api/auth'; // checkAuth 함수 추가
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // useEffect(() => {
  //   // 로그인 상태 확인
  //   const verifyAuth = async () => {
  //     try {
  //       const isAuthenticated = await checkAuth(); // 로그인 상태를 확인하는 API 호출
  //       if (isAuthenticated) {
  //         router.navigate({ to: '/' }); // 로그인되어 있으면 루트 페이지로 리다이렉트
  //       }
  //     } catch (err) {
  //       console.error('인증 확인 중 오류 발생:', err);
  //     }
  //   };

  //   verifyAuth();
  // }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(username, password);
      router.navigate({ to: '/' });
    } catch (err) {
      setError('로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인하세요.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-5 border border-gray-300 rounded-lg">
      <h2 className="text-2xl mb-4">로그인</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4">
          <label className="block mb-1">사용자 이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          로그인
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
