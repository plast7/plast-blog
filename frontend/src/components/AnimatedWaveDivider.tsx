import React from 'react';

const AnimatedWaveDivider = () => {
  return (
    <>
      <div className="w-full h-32 overflow-hidden bg-plast-dark-background" />
      <div className="w-full h-16 overflow-hidden">
        {/* <div className="w-full h-32 overflow-hidden bg-red-500" /> */}
        <svg
          className="w-full h-full"
          viewBox="0 0 2880 120"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b88f88" />
              <stop offset="100%" stopColor="#b88f88" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,120 C480,60 960,0 1440,0 C1920,0 2400,60 2880,120 V0 H0 V120 Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,120 C480,60 960,0 1440,0 C1920,0 2400,60 2880,120 V0 H0 V120 Z;
                M0,60 C480,120 960,120 1440,60 C1920,0 2400,0 2880,60 V0 H0 V60 Z;
                M0,0 C480,0 960,60 1440,120 C1920,120 2400,60 2880,0 V0 H0 V0 Z;
                M0,60 C480,0 960,0 1440,60 C1920,120 2400,120 2880,60 V0 H0 V60 Z;
                M0,120 C480,60 960,0 1440,0 C1920,0 2400,60 2880,120 V0 H0 V120 Z
              "
            />
          </path>
        </svg>
      </div>
    </>
  );
};

export default AnimatedWaveDivider;