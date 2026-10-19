import React, { useEffect, useRef } from 'react';
import { ParticleType } from '../../types/card';

interface CanvasParticlesProps {
  type: ParticleType;
  intensity?: 'gentle' | 'normal' | 'festive';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  hue: number;
  flipSpeed: number;
  flipAngle: number;
  life?: number;
  maxLife?: number;
}

export const CanvasParticles: React.FC<CanvasParticlesProps> = ({
  type = 'floating-hearts',
  intensity = 'normal',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current = { x: clientX, y: clientY, active: true };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);

    // Particle count based on intensity & screen size
    const baseCount = intensity === 'gentle' ? 24 : intensity === 'festive' ? 65 : 42;
    const count = window.innerWidth < 768 ? Math.round(baseCount * 0.7) : baseCount;

    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      const startY = initialY !== undefined ? initialY : (type === 'floating-hearts' ? height + 20 : -20);
      return {
        x: Math.random() * width,
        y: startY,
        size: type === 'stardust' ? Math.random() * 4 + 2 : Math.random() * 14 + 10,
        speedX: (Math.random() - 0.5) * (type === 'confetti' ? 2.5 : 1.2),
        speedY: type === 'floating-hearts' 
          ? -(Math.random() * 1.2 + 0.8) 
          : (Math.random() * 1.5 + 0.9),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.6 + 0.35,
        hue: type === 'floating-hearts' 
          ? Math.random() * 30 + 340 // rosy pinks & deep rubies
          : type === 'cherry-petals' 
          ? Math.random() * 20 + 335 // soft sakura pink
          : type === 'stardust' 
          ? Math.random() * 40 + 40 // warm gold & champagne
          : Math.random() * 360, // rainbow confetti
        flipSpeed: Math.random() * 0.05 + 0.02,
        flipAngle: Math.random() * Math.PI
      };
    };

    // Populate initially across the screen
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    // Helper: draw heart
    const drawHeart = (c: CanvasRenderingContext2D, size: number, color: string, alpha: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      // bottom left curve
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
      // bottom right curve
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      // top right curve
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      
      // subtle 3D highlight
      c.fillStyle = 'rgba(255, 255, 255, 0.35)';
      c.beginPath();
      c.arc(-size * 0.22, topCurveHeight * 0.9, size * 0.12, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    // Helper: draw petal
    const drawPetal = (c: CanvasRenderingContext2D, size: number, color: string, alpha: number, flipAngle: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.scale(1, Math.cos(flipAngle)); // 3D tumbling effect
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, -size);
      c.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.8, size * 0.5, 0, size);
      c.bezierCurveTo(-size * 0.8, size * 0.5, -size * 0.7, -size * 0.6, 0, -size);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Helper: draw star
    const drawStar = (c: CanvasRenderingContext2D, size: number, alpha: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = '#fef08a';
      c.shadowColor = '#fef08a';
      c.shadowBlur = 8;
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(size * 1.5, 0);
        c.lineTo(size * 0.25, size * 0.25);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Helper: draw confetti ribbon
    const drawConfettiPiece = (c: CanvasRenderingContext2D, size: number, color: string, alpha: number, flipAngle: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.scale(1, Math.cos(flipAngle));
      c.fillStyle = color;
      c.fillRect(-size / 2, -size / 4, size, size / 2);
      c.restore();
    };

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Interaction with mouse/touch
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120;
            p.x += (dx / dist) * force * 4;
            p.y += (dy / dist) * force * 4;
          }
        }

        // Natural movement
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flipAngle += p.flipSpeed;

        // Reset if offscreen
        if (type === 'floating-hearts' && p.y < -30) {
          particles[i] = createParticle(height + 20);
        } else if (type !== 'floating-hearts' && p.y > height + 30) {
          particles[i] = createParticle(-20);
        }

        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (type === 'floating-hearts') {
          drawHeart(ctx, p.size, `hsl(${p.hue}, 85%, 68%)`, p.opacity);
        } else if (type === 'cherry-petals') {
          drawPetal(ctx, p.size, `hsl(${p.hue}, 80%, 82%)`, p.opacity, p.flipAngle);
        } else if (type === 'stardust') {
          drawStar(ctx, p.size, p.opacity);
        } else {
          drawConfettiPiece(ctx, p.size, `hsl(${p.hue}, 90%, 65%)`, p.opacity, p.flipAngle);
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [type, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-10 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};
