import React, { useRef, useEffect } from 'react';

const MAJOR_AXIS = 100;
const MINOR_AXIS = 98;
const ROTATION_ANGLE = 177 / 360 * Math.PI * 2;

class Star {
  constructor(width, height) {
    this.reset(width, height);
  }

  reset(width, height) {
    // 최대 거리 계산 (화면 크기에 따라 조정)
    this.maxDistance = Math.min(width, height) * 0.28;

    // 중심점 설정 (화면 중앙)
    this.centerX = this.maxDistance * 1.2;
    this.centerY = this.maxDistance * 1.2;

    this.distance = Math.random()

    // 장축과 단축 설정 (랜덤 또는 고정)
    this.a = this.maxDistance * MAJOR_AXIS * this.distance / 100 * 2;
    this.b = this.maxDistance * MINOR_AXIS * this.distance / 100 * 2;

    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = ((Math.random() * 0.0025) + 0.001) * 2.6; // 속도 다르게 설정
    this.size = (Math.random() * 0.4 + 0.4) * 1.1 * 0.8;
    if(this.distance < 0.2)
      this.size = (Math.random() * 0.1 + 0.3) * 1.1 * 0.8;
    this.trails = [];
    this.maxTrails = 120; // 트레일 길이 조절
  }

  update() {
    this.angle += this.rotationSpeed;
    this.x = (Math.cos(this.angle) * this.a) * Math.cos(ROTATION_ANGLE) + (Math.sin(this.angle) * this.b) * Math.sin(ROTATION_ANGLE);
    this.y = (Math.cos(this.angle) * this.a) * Math.sin(ROTATION_ANGLE) + (Math.sin(this.angle) * this.b) * Math.cos(ROTATION_ANGLE);

    // 트레일 업데이트
    this.trails.push({ x: this.x, y: this.y });
    if (this.trails.length > this.maxTrails) {
      this.trails.shift();
    }
  }

  draw(ctx) {
    // 트레일 그리기
    for (let i = 0; i < this.trails.length; i++) {
      const trail = this.trails[i];
      const opacity = (i + 1) / this.trails.length;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(this.centerX + trail.x, this.centerY + trail.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 별 그리기
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.centerX + this.x, this.centerY + this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const RotatingStarsCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 별들 초기화
    const stars = [];
    const numStars = 100;

    // Canvas 크기 설정 및 별 초기화
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 기존 별 초기화 또는 새로운 별 생성
      stars.forEach(star => star.reset(canvas.width, canvas.height));
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 별 생성
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }

    // 애니메이션 함수
    const animate = () => {
      // Canvas를 클리어하여 배경 이미지가 보이도록 함
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 별 업데이트 및 그리기
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 클린업
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* 배경 이미지 */}
      <img
        src="stella.png"
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none', // 클릭 이벤트가 캔버스를 통과하도록 함
        }}
      />
    </div>
  );
};

export default RotatingStarsCanvas;
