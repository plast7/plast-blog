import React, { useRef, useEffect } from 'react';

class Star {
  constructor(width, height) {
    this.maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.29;
    this.centerX = this.maxDistance * 1.2;
    this.centerY = this.maxDistance * 1.2;
    this.reset();
  }

  reset() {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = Math.random() * this.maxDistance;
    this.size = (Math.random() * 0.5 + 0.3) * 1;
    this.rotationSpeed = ((Math.random() * 0.0025) + 0.001) * 2; // Varying speeds
    this.trails = [];
    this.maxTrails = 150; // Adjust trail length
  }

  update() {
    this.angle += this.rotationSpeed;
    this.x = Math.cos(this.angle) * this.distance;
    this.y = Math.sin(this.angle) * this.distance;

    // Update trails
    this.trails.push({ x: this.x, y: this.y });
    if (this.trails.length > this.maxTrails) {
      this.trails.shift();
    }
  }

  draw(ctx) {
    // Draw trails
    for (let i = 0; i < this.trails.length; i++) {
      const trail = this.trails[i];
      const opacity = (i + 1) / this.trails.length;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(this.centerX + trail.x, this.centerY + trail.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw the star
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

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize stars
    const stars = [];
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }

    // Animation function
    const animate = () => {
      // Clear the canvas instead of filling it with black
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach(star => {
        star.update();
        star.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Background Image */}
      <img
        src="stella.jpg"
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
          pointerEvents: 'none', // Optional: Allows clicks to pass through the canvas
        }}
      />
    </div>
  );
};

export default RotatingStarsCanvas;
