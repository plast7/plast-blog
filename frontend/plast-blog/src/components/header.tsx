import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';

const MenuItem = ({ to, label, items }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="group relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <div className="text-black text-[24px] font-bold flex items-center cursor-pointer">
        {label}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isHovered && (
        <div 
          className="absolute left-0 mt-2 w-auto mx-[-26px] rounded-[18px] shadow-lg bg-plast-background ring-1 ring-black ring-opacity-5"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mx-[20px] my-[20px] grid grid-cols-[120px_120px_120px] gap-x-12" role="menu" aria-orientation="horizontal" aria-labelledby="options-menu">
            {items.map((item, index) => (
              <div key={index} className="w-[120px] p-4">
                <h3 className="font-bold text-[24px] text-plast-red mb-2">{item.label}</h3>
                <div className="">
                  {item.subItems && item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.to}
                      className="my-[26px] block font-bold text-[20px] text-gray-700 hover:bg-red-100 hover:text-red-400 py-1 rounded"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const Header = ({ bgOpacity = 'bg-opacity-70' }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  return (
    <header className={`shadow-[0_16px_24px_-4px_rgba(0,0,0,0.05)] h-[70px] fixed top-[27px] left-[80px] right-[80px] z-10 bg-white ${bgOpacity} backdrop-blur-sm rounded-[18px]`}>
      <nav className="h-[70px] container mx-auto px-10 flex items-center justify-between relative">
        <div className="mx-[16px] flex h-[70px] items-center space-x-16 absolute left-[40px]">
            <MenuItem
              to="/tech"
              label="Tech"
              items={[
                { 
                  label: "Dev", 
                  to: "/tech/dev",
                  subItems: [
                    { label: "프론트엔드", to: "/category/frontend" },
                    { label: "백엔드", to: "/category/backend" },
                  ]
                },
                { 
                  label: "CS", 
                  to: "/tech/cs",
                  subItems: [
                    { label: "자료구조", to: "/category/data-structures" },
                    { label: "알고리즘", to: "/category/algorithms" },
                    { label: "운영체제", to: "/category/operating-systems" },
                    { label: "아키텍처", to: "/category/architecture" },
                  ]
                },
                { 
                  label: "AI", 
                  to: "/tech/ai",
                  subItems: [
                    { label: "머신러닝", to: "/category/machine-learning" },
                    { label: "수리통계", to: "/category/statistics" },
                  ]
                },
            ]}
          />
          <MenuItem
            to="/life"
            label="Life"
            items={[
              { 
                label: "Daily", 
                to: "/life/daily",
                subItems: [
                  { label: "회고", to: "/category/review" },
                  { label: "커리어", to: "/category/career" },
                ]
              },
              { 
                label: "Hobby", 
                to: "/life/hobby",
                subItems: [
                  { label: "헬스", to: "/category/fitness" },
                ]
              },
            ]}
          />
        </div>
        <Link
          key={'main'}
          to={'/'}
          className="text-black text-[30px] font-extrabold absolute left-1/2 transform -translate-x-1/2"
        >
          Plast Dev
        </Link>
        {/* <h1 className="text-black text-[30px] font-extrabold absolute left-1/2 transform -translate-x-1/2">Plast Dev</h1> */}
      </nav>
    </header>
  );
};

export default Header;
