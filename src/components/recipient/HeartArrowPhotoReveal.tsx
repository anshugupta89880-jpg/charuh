import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RotateCcw, Target, Heart, Eye } from 'lucide-react';
import { CardPhoto } from '../../types/card';
import { PolaroidStack } from './PolaroidStack';
import { playArrowShootSound, playHeartHitSound } from '../../utils/soundEffects';

interface HeartArrowPhotoRevealProps {
  photos: CardPhoto[];
  recipientName?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  char: string;
  opacity: number;
  rotation: number;
  vRot: number;
}

export const HeartArrowPhotoReveal: React.FC<HeartArrowPhotoRevealProps> = ({
  photos,
  recipientName = 'You'
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [hasHit, setHasHit] = useState(false);
  const [arrowProgress, setArrowProgress] = useState(0); // 0 to 1 along path
  const [arrowPos, setArrowPos] = useState({ x: 50, y: 260, angle: -45 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shakeContainer, setShakeContainer] = useState(false);

  const pathRef = useRef<SVGPathElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize arrow at start of curve
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      const p1 = pathRef.current.getPointAtLength(0);
      const p2 = pathRef.current.getPointAtLength(Math.min(length, 4));
      const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
      setArrowPos({ x: p1.x, y: p1.y, angle });
    }
  }, []);

  const triggerLaunch = () => {
    if (isFlying || hasHit) return;

    setIsFlying(true);
    playArrowShootSound();

    const path = pathRef.current;
    if (!path) {
      handleImpact();
      return;
    }

    const totalLength = path.getTotalLength();
    const duration = 900; // ms flight duration
    const startTime = performance.now();

    const animateFlight = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth ease-in-out curve
      const easeProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setArrowProgress(progress);

      const currentDistance = easeProgress * totalLength;
      const p1 = path.getPointAtLength(currentDistance);
      const nextDistance = Math.min(totalLength, currentDistance + 3);
      const p2 = path.getPointAtLength(nextDistance);
      const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

      setArrowPos({ x: p1.x, y: p1.y, angle });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFlight);
      } else {
        // Arrow arrived at the heart!
        handleImpact();
      }
    };

    animationRef.current = requestAnimationFrame(animateFlight);
  };

  const handleImpact = () => {
    setIsFlying(false);
    setHasHit(true);
    playHeartHitSound();
    setShakeContainer(true);

    setTimeout(() => {
      setShakeContainer(false);
    }, 500);

    // Generate burst particles radiating from heart center
    const newParticles: Particle[] = [];
    const chars = ['💖', '❤️', '✨', '🌸', '💫', '⭐', '💕'];

    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 7 + 4;
      newParticles.push({
        id: i,
        x: 235, // Heart center in SVG viewBox
        y: 85,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: Math.random() * 12 + 14,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12
      });
    }

    setParticles(newParticles);

    // Particle animation loop
    let frame = 0;
    const animateExplosion = () => {
      frame++;
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy + 0.3, // gravity
            rotation: p.rotation + p.vRot,
            opacity: p.opacity - 0.022
          }))
          .filter((p) => p.opacity > 0)
      );

      if (frame < 55) {
        requestAnimationFrame(animateExplosion);
      } else {
        // Unfold photo gallery
        setIsRevealed(true);
      }
    };

    requestAnimationFrame(animateExplosion);
  };

  const handleReplay = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsRevealed(false);
    setIsFlying(false);
    setHasHit(false);
    setArrowProgress(0);
    setParticles([]);

    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      const p1 = pathRef.current.getPointAtLength(0);
      const p2 = pathRef.current.getPointAtLength(Math.min(length, 4));
      const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
      setArrowPos({ x: p1.x, y: p1.y, angle });
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center my-6">
      {/* 1. INTERACTIVE HEART-ARROW REVEAL ARENA (Before Strike) */}
      {!isRevealed ? (
        <div
          className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl relative overflow-hidden transition-all duration-300 border border-rose-200/90 text-center ${
            shakeContainer ? 'animate-shake' : ''
          }`}
          style={{
            boxShadow:
              '0 25px 50px -12px rgba(244, 63, 94, 0.2), 0 0 45px rgba(251, 113, 133, 0.25)'
          }}
        >
          {/* Header Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/90 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Heart-Arrow Experience</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-800">
            Pierce the Heart to Unlock Memories
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            A golden arrow is poised to strike. Watch it fly along the celestial path to burst open the heart!
          </p>

          {/* SVG Flight Path & Heart-Shaped Container Arena */}
          <div className="relative w-full h-[280px] sm:h-[310px] my-3 select-none flex items-center justify-center">
            <svg
              viewBox="0 0 320 280"
              className="w-full h-full max-w-[380px] overflow-visible"
            >
              <defs>
                {/* Glow filter */}
                <filter id="goldenGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Heart Gradient */}
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="50%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>

                {/* Gold Arrow Gradient */}
                <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* FLIGHT TRAJECTORY PATH (Curved Bezier Line) */}
              <path
                ref={pathRef}
                d="M 50 250 C 70 160, 150 140, 235 90"
                fill="none"
                stroke="#fda4af"
                strokeWidth="2.5"
                strokeDasharray="5,6"
                className="opacity-70"
              />

              {/* Active path glow trail as arrow travels */}
              <path
                d="M 50 250 C 70 160, 150 140, 235 90"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeDasharray="1000"
                strokeDashoffset={1000 * (1 - arrowProgress)}
                filter="url(#goldenGlow)"
                className="transition-all"
              />

              {/* TARGET: THE HEART-SHAPED CONTAINER (Positioned around 235, 90) */}
              <g transform="translate(235, 85)" className="cursor-pointer" onClick={triggerLaunch}>
                {/* Concentric pulsing target rings */}
                <circle
                  r="52"
                  fill="none"
                  stroke="#fda4af"
                  strokeWidth="1.5"
                  className={!hasHit ? 'animate-ping opacity-30' : 'opacity-0'}
                  style={{ animationDuration: '2s' }}
                />
                <circle
                  r="42"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  className="animate-spin opacity-40"
                  style={{ animationDuration: '8s' }}
                />

                {/* Heart-Shaped SVG Container */}
                <g
                  transform="scale(0.85) translate(-36, -34)"
                  className={`transition-all duration-300 origin-center ${
                    hasHit ? 'scale-125 brightness-150 rotate-6' : 'hover:scale-105'
                  }`}
                >
                  {/* Heart Shadow */}
                  <path
                    d="M 36 68 C 10 45, 0 25, 12 10 C 22 -3, 36 8, 36 14 C 36 8, 50 -3, 60 10 C 72 25, 62 45, 36 68 Z"
                    fill="rgba(190, 18, 60, 0.3)"
                    transform="translate(2, 6)"
                  />
                  {/* Heart Body */}
                  <path
                    d="M 36 68 C 10 45, 0 25, 12 10 C 22 -3, 36 8, 36 14 C 36 8, 50 -3, 60 10 C 72 25, 62 45, 36 68 Z"
                    fill="url(#heartGrad)"
                    stroke="#ffe4e6"
                    strokeWidth="2"
                    filter="url(#goldenGlow)"
                  />
                  {/* Inner Heart Specular Shine */}
                  <path
                    d="M 16 12 C 22 5, 30 10, 32 16 C 26 14, 18 18, 16 26 C 14 18, 14 14, 16 12 Z"
                    fill="rgba(255, 255, 255, 0.6)"
                  />
                  {/* Photo count indicator inside heart */}
                  <text
                    x="36"
                    y="36"
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {photos.length} 📸
                  </text>
                </g>
              </g>

              {/* THE FLOATING ARROW (Travels along path) */}
              <g
                transform={`translate(${arrowPos.x}, ${arrowPos.y}) rotate(${arrowPos.angle})`}
                className="cursor-pointer transition-transform"
                onClick={triggerLaunch}
              >
                {/* Comet Trail */}
                <line
                  x1="-35"
                  y1="0"
                  x2="-5"
                  y2="0"
                  stroke="url(#arrowGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#goldenGlow)"
                  className="opacity-80"
                />
                {/* Arrow Shaft */}
                <line
                  x1="-24"
                  y1="0"
                  x2="10"
                  y2="0"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Golden Arrowhead */}
                <polygon
                  points="18,0 8,-7 10,0 8,7"
                  fill="#fef08a"
                  stroke="#d97706"
                  strokeWidth="1"
                  filter="url(#goldenGlow)"
                />
                {/* Ruby Feathers */}
                <polygon points="-24,-5 -28,-9 -16,-3" fill="#e11d48" />
                <polygon points="-24,5 -28,9 -16,3" fill="#e11d48" />

                {/* Stardust glow sparkles */}
                <circle cx="14" cy="0" r="3" fill="#ffffff" className="animate-ping" />
              </g>

              {/* BURST PARTICLES (On Impact) */}
              {particles.map((p) => (
                <text
                  key={p.id}
                  x={p.x}
                  y={p.y}
                  fontSize={p.size}
                  opacity={p.opacity}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${p.rotation}, ${p.x}, ${p.y})`}
                  className="pointer-events-none select-none"
                >
                  {p.char}
                </text>
              ))}
            </svg>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
            <button
              onClick={triggerLaunch}
              disabled={isFlying || hasHit}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>{isFlying ? 'Arrow in Flight...' : 'Release Arrow to Heart 🏹'}</span>
            </button>

            <button
              onClick={() => setIsRevealed(true)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors py-2 px-3"
            >
              Skip to Photos
            </button>
          </div>
        </div>
      ) : (
        /* 2. REVEALED PHOTO GALLERY + REPLAY HEART-ARROW BUTTON */
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Top Bar with Replay Heart-Arrow Hit */}
          <div className="flex items-center justify-between w-full max-w-md px-3 mb-2 text-xs">
            <div className="inline-flex items-center gap-1.5 text-rose-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Memories Unlocked by Cupid's Arrow</span>
            </div>

            <button
              onClick={handleReplay}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-rose-600 border border-rose-200 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 font-semibold"
              title="Replay arrow flight path and heart strike explosion"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Replay Heart-Arrow Hit</span>
            </button>
          </div>

          {/* The Polaroid Stack Gallery (Rendered immediately after explosion) */}
          <PolaroidStack photos={photos} initialRevealed={true} />
        </div>
      )}
    </div>
  );
};
