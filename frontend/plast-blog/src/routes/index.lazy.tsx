import React, { useState, useRef, useEffect } from 'react';
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import Header from '../components/header';

export const Route = createLazyFileRoute('/')({
  component: () => (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("main.png")',
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-40 z-10" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header bgOpacity='bg-opacity-30' />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-5xl font-bold mb-4">Welcome to Plast Dev</h2>
            <p className="text-xl">
              Explore the intersection of technology and life
            </p>
          </div>
        </main>
      </div>
    </div>
  ),
})
