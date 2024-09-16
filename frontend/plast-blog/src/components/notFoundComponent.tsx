import React from 'react';
import { Link, createFileRoute } from '@tanstack/react-router'
import Header from './header';
import AnimatedWaveDriver from './animatedWaveDivider';


const NotFoundComponent = () => {
  return (
    <div className="min-h-screen category-page bg-plast-main">
      <AnimatedWaveDriver />
      <Header />
      <main className="pt-40 px-4 max-w-4xl mx-auto">
        <h1 className="text-[36px] font-bold text-center text-plast-red mb-4">
          페이지를 찾을 수 없습니다.
        </h1>
      </main>
    </div>
  );
};

export default NotFoundComponent;
