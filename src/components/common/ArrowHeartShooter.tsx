import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Target, RotateCcw } from 'lucide-react';
import { playArrowShootSound, playHeartHitSound } from '../../utils/soundEffects';

interface ArrowHeartShooterProps {
  onHeartHit: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  compact?: boolean;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  char: string;
  opacity: number;
}

export const ArrowHeartShooter: React.FC<ArrowHeartShooterProps> = ({
  onHeartHit,
  title = "Shoot Cupid's Arrow",
  subtitle = "Aim for the beating heart to burst open your memories",
  buttonText = "Release Golden Arrow 🏹",
  compact = false
}) => {
  const [gameState, setGameState] = useState<'aiming' | 'flying' | 'hit' | 'exploded'>('aiming');
  const [pullDistance, setPullDistance] = useState(0); // 0 to 60px
  const [isDragging, setIsDragging] = useState(false);
  const [arrowY, setArrowY] = useState(0); // during flight
  const [burstParticles, setBurstParticles] = useState<SparkleParticle[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Shoot the arrow
  const shootArrow = () => {
    if (gameState !== 'aiming') return;

    setGameState('flying');
    playArrowShootSound();

    let currentY = 0;
    const targetY = compact ? -180 : -240; // distance up to the heart
    const speed = 16;

    const animateFlight = () => {
      currentY -= speed;
      setArrowY(currentY);

      if (currentY <= targetY) {
        // Arrow strikes the heart!
        handleImpact();
      } else {
        animationFrameRef.current = requestAnimationFrame(animateFlight);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateFlight);
  };

  const handleImpact = () => {
    setGameState('hit');
    playHeartHitSound();

    // Create explosion particles around heart
    const particles: SparkleParticle[] = [];
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fbbf24', '#ffffff'];
    const chars = ['❤️', '💖', '✨', '🌸', '💫'];

    for (let i = 0; i < 28; i++) {
      const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 6 + 4;
      particles.push({
        id: i,
        x: 0,
        y: compact ? -180 : -240,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: 1
      });
    }

    setBurstParticles(particles);

    // Animate particles
    let frame = 0;
    const animateExplosion = () => {
      frame++;
      setBurstParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + 0.5, // gravity
            opacity: p.opacity - 0.02
          }))
          .filter((p) => p.opacity > 0)
      );

      if (frame < 50) {
        animationFrameRef.current = requestAnimationFrame(animateExplosion);
      } else {
        setGameState('exploded');
        onHeartHit();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateExplosion);
  };

  // Drag interaction to pull bowstring
  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameState !== 'aiming') return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || gameState !== 'aiming') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relativeY = e.clientY - (rect.bottom - 80);
    const pull = Math.max(0, Math.min(65, relativeY));
    setPullDistance(pull);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (pullDistance > 20) {
      shootArrow();
    }
    setPullDistance(0);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setGameState('aiming');
    setArrowY(0);
    setBurstParticles([]);
    setPullDistance(0);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none w-full ${
        compact ? 'py-4' : 'py-8'
      }`}
    >
      {/* Title */}
      {title && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold mb-1 shadow-2xs">
            <Target className="w-3.5 h-3.5" />
            <span>{title}</span>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">{subtitle}</p>
        </div>
      )}

      {/* Arena Viewport */}
      <div
        className={`relative w-72 sm:w-80 flex flex-col items-center justify-between overflow-visible ${
          compact ? 'h-[270px]' : 'h-[340px]'
        }`}
      >
        {/* TARGET: THE BEATING HEART (Top Area) */}
        <div className="relative flex items-center justify-center z-10">
          {/* Target concentric glowing shockwave rings */}
          <div
            className={`absolute w-36 h-36 rounded-full border border-rose-300/40 ${
              gameState === 'aiming' ? 'animate-ping duration-1000' : ''
            }`}
          />
          <div className="absolute w-28 h-28 rounded-full border-2 border-dashed border-rose-400/50 animate-spin duration-3000" />
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-md" />

          {/* The Heart */}
          <div
            className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              gameState === 'hit'
                ? 'scale-135 brightness-150 rotate-6'
                : gameState === 'exploded'
                ? 'scale-110 opacity-90'
                : 'animate-pulse hover:scale-105'
            }`}
          >
            <div className="relative">
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500 filter drop-shadow-[0_8px_20px_rgba(244,63,94,0.45)]" />
              {/* Inner highlight */}
              <div className="absolute top-2 left-3 w-4 h-3 rounded-full bg-white/40 blur-[1px]" />
              {/* Center bullseye spark */}
              <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-white shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              </div>
            </div>

            {/* Embedded Arrow on Hit */}
            {gameState === 'hit' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1 h-14 bg-amber-400 rotate-[-15deg] shadow-lg relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-8 border-b-amber-200" />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs">🪶</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EXPLOSION PARTICLES (When hit) */}
        {burstParticles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(${p.x}px, ${p.y}px)`,
              opacity: p.opacity,
              fontSize: `${p.size}px`,
              pointerEvents: 'none',
              zIndex: 30
            }}
          >
            {p.char}
          </div>
        ))}

        {/* CUPID'S BOW & ARROW (Bottom Area) */}
        <div
          className="relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none z-20"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Cupid's Bow SVG */}
          <div className="relative w-40 h-24 flex items-center justify-center">
            <svg width="150" height="70" viewBox="0 0 150 70" className="overflow-visible">
              <defs>
                <linearGradient id="goldBowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <filter id="bowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Bow Wood Arc */}
              <path
                d="M 10 50 Q 75 0 140 50"
                fill="none"
                stroke="url(#goldBowGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#bowGlow)"
              />
              {/* Bow decorative grip */}
              <rect x="70" y="20" width="10" height="7" rx="3" fill="#be123c" />

              {/* Bowstring (stretches with pullDistance) */}
              <path
                d={`M 12 48 Q 75 ${48 + (gameState === 'aiming' ? pullDistance : 0)} 138 48`}
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                strokeDasharray="2,1"
              />
            </svg>

            {/* The Arrow */}
            <div
              style={{
                transform:
                  gameState === 'flying' || gameState === 'hit'
                    ? `translateY(${arrowY}px)`
                    : `translateY(${pullDistance}px)`,
                transition: gameState === 'aiming' && !isDragging ? 'transform 0.2s ease-out' : 'none'
              }}
              className="absolute pointer-events-none flex flex-col items-center z-25"
            >
              {/* Golden Arrowhead */}
              <div className="w-0 h-0 border-x-6 border-x-transparent border-b-12 border-b-amber-300 drop-shadow-md" />
              {/* Arrow shaft */}
              <div className="w-1.5 h-20 bg-gradient-to-b from-amber-300 via-amber-200 to-amber-400 shadow-sm relative">
                {/* Sparkle tip */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              {/* Ruby Fletching / Feathers */}
              <div className="relative flex items-center justify-center -mt-1">
                <div className="w-4 h-5 bg-rose-500 rounded-xs rotate-[-20deg] shadow-xs" />
                <div className="w-4 h-5 bg-rose-500 rounded-xs rotate-[20deg] shadow-xs" />
              </div>
            </div>
          </div>

          {/* Pull instruction hint */}
          {gameState === 'aiming' && (
            <div className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-bounce">
              <span>{isDragging ? 'Now release to shoot!' : 'Drag bow down & release to aim'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Button Controls */}
      <div className="mt-5 flex items-center gap-3">
        {gameState === 'aiming' ? (
          <button
            type="button"
            onClick={shootArrow}
            className="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/25 active:scale-95 transition-all flex items-center gap-2 text-sm group"
          >
            <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>{buttonText}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Shoot Arrow Again</span>
          </button>
        )}
      </div>
    </div>
  );
};
