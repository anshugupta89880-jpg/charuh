import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gift, Mail, ArrowRight, Target } from 'lucide-react';
import { HeartCraftCard, OpeningActivity } from '../../types/card';
import { ArrowHeartShooter } from '../common/ArrowHeartShooter';

interface InteractiveOpeningProps {
  card: HeartCraftCard;
  onOpened: () => void;
  triggerAudioStart: () => void;
}

export const InteractiveOpening: React.FC<InteractiveOpeningProps> = ({
  card,
  onOpened,
  triggerAudioStart
}) => {
  const activityType: OpeningActivity = card.openingActivity || 'cupid-arrow';
  const [isOpening, setIsOpening] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);

  // Scratch card canvas setup
  useEffect(() => {
    if (activityType !== 'scratch-card') return;

    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = (canvas.width = 340);
    const height = (canvas.height = 240);

    // Draw shimmering scratch foil layer
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(0.3, '#fbbf24');
    gradient.addColorStop(0.5, '#fde68a');
    gradient.addColorStop(0.7, '#fbbf24');
    gradient.addColorStop(1, '#d97706');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add textured glitter pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const r = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Scratch text prompt
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Rub or Scratch Here ✨', width / 2, height / 2 - 10);
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('to reveal your special surprise!', width / 2, height / 2 + 15);

    const scratch = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * (canvas.width / rect.width);
      const y = (clientY - rect.top) * (canvas.height / rect.height);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      // Trigger audio on first scratch
      triggerAudioStart();

      // Calculate progress periodically
      checkScratchPercentage(ctx, width, height);
    };

    const checkScratchPercentage = (c: CanvasRenderingContext2D, w: number, h: number) => {
      // sample every 8th pixel for speed
      const imgData = c.getImageData(0, 0, w, h);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalSampled = pixels.length / 4 / 8;

      for (let i = 3; i < pixels.length; i += 32) {
        if (pixels[i] === 0) {
          transparentCount++;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / totalSampled) * 100));
      setScratchProgress(percent);

      if (percent >= 45 && !isOpening) {
        handleCompleteOpen();
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isScratchingRef.current = true;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      scratch(x, y);
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isScratchingRef.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      scratch(x, y);
    };

    const handlePointerUp = () => {
      isScratchingRef.current = false;
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [activityType]);

  const handleCompleteOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    triggerAudioStart();
    setTimeout(() => {
      onOpened();
    }, 900);
  };

  return (
    <div className="relative z-20 flex min-h-[90vh] flex-col items-center justify-center px-4 py-8">
      {/* Activity Title & Guidance */}
      <div className="text-center mb-6 max-w-md animate-fadeIn">
        <span className="text-xs uppercase tracking-widest font-semibold text-rose-500 flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Opening</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-serif-luxury">
          {activityType === 'cupid-arrow' && "Hit the Heart with Cupid's Arrow"}
          {activityType === 'gift-box' && 'Unbox Your Surprise'}
          {activityType === 'wax-envelope' && 'Break the Wax Seal'}
          {activityType === 'scratch-card' && 'Scratch to Reveal'}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {activityType === 'cupid-arrow' && 'Aim and release the golden arrow to strike the beating heart and reveal the memories!'}
          {activityType === 'gift-box' && 'Tap the ribbon knot to untie the gift and open the lid.'}
          {activityType === 'wax-envelope' && 'Tap the heart wax seal on the envelope to open the letter.'}
          {activityType === 'scratch-card' && 'Drag your finger or cursor across the card to peel the gold foil.'}
        </p>
      </div>

      {/* 0. Cupid's Arrow Activity */}
      {activityType === 'cupid-arrow' && (
        <div className="w-full max-w-md flex flex-col items-center">
          <ArrowHeartShooter
            onHeartHit={handleCompleteOpen}
            title={`Surprise for ${card.recipientName}`}
            subtitle="Release the golden arrow to pierce the heart and unlock the memories"
            buttonText="Shoot Arrow to Heart 🏹"
          />
        </div>
      )}

      {/* 1. Gift Box Activity */}
      {activityType === 'gift-box' && (
        <div
          onClick={handleCompleteOpen}
          className={`relative cursor-pointer select-none group transition-transform duration-700 ${
            isOpening ? 'scale-110' : 'hover:scale-105 active:scale-95'
          }`}
          style={{ perspective: 1000 }}
        >
          {/* Subtle glow underneath */}
          <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 to-pink-300 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />

          {/* 3D Box Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Box Body */}
            <div className="absolute bottom-0 w-full h-44 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 shadow-2xl overflow-hidden border border-rose-300/40">
              {/* Vertical Ribbon */}
              <div className="absolute inset-x-0 mx-auto w-10 h-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 shadow-md" />
              {/* Horizontal Ribbon */}
              <div className="absolute inset-y-0 my-auto w-full h-10 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-200 shadow-md" />

              {/* Heart Tag */}
              <div className="absolute top-4 right-4 bg-white/95 rounded-xl px-3 py-1.5 shadow-md border border-rose-100 rotate-6 flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-rose-600 font-script text-base">
                  For {card.recipientName}
                </span>
              </div>
            </div>

            {/* Box Lid */}
            <div
              className={`absolute top-10 sm:top-8 w-[106%] -left-[3%] h-20 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 shadow-xl border border-rose-200/50 transition-all duration-700 origin-top-left ${
                isOpening ? '-translate-y-24 -rotate-12 opacity-0' : 'translate-y-0 rotate-0'
              }`}
            >
              {/* Lid Vertical Ribbon */}
              <div className="absolute inset-x-0 mx-auto w-10 h-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200" />

              {/* Satin Bow on Top */}
              <div className="absolute -top-7 inset-x-0 mx-auto w-16 h-14 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute -left-1 w-7 h-8 rounded-full border-4 border-amber-300 bg-amber-200/90 rotate-[-30deg] shadow-md animate-pulse" />
                  <div className="absolute -right-1 w-7 h-8 rounded-full border-4 border-amber-300 bg-amber-200/90 rotate-[30deg] shadow-md animate-pulse" />
                  <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-amber-200 z-10 shadow-sm flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt tooltip */}
            <div className="absolute -bottom-10 inset-x-0 text-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 text-rose-600 text-xs font-semibold shadow-md border border-rose-200 animate-bounce">
                <Gift className="w-3.5 h-3.5" />
                <span>Tap the box to open!</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Wax-Sealed Envelope Activity */}
      {activityType === 'wax-envelope' && (
        <div
          onClick={handleCompleteOpen}
          className={`relative cursor-pointer select-none group transition-transform duration-700 ${
            isOpening ? 'scale-110' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-300 to-amber-200 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" />

          {/* Envelope Card Container */}
          <div className="relative w-72 h-52 sm:w-80 sm:h-56 rounded-2xl bg-[#faf5ee] border-2 border-[#e6dbc9] shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            {/* Envelope Paper Texture Lines */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-14 rounded border border-rose-300/60 p-1 flex items-center justify-center bg-rose-50/50">
                <span className="text-[10px] text-rose-500 font-mono text-center leading-tight">
                  AIR<br />MAIL
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-script text-slate-500 text-sm">
                  With deep feelings
                </span>
              </div>
            </div>

            {/* Center Recipient Name in Calligraphy */}
            <div className="text-center my-auto">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                To My Beloved
              </div>
              <div className="text-2xl sm:text-3xl text-rose-600 font-calligraphy">
                {card.recipientName}
              </div>
            </div>

            {/* Wax Seal Center Button */}
            <div className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-rose-700 via-red-600 to-rose-900 shadow-lg border-2 border-rose-400 flex items-center justify-center text-white transition-all duration-500 ${
                  isOpening ? 'scale-150 rotate-45 opacity-0' : 'group-hover:scale-110'
                }`}
                style={{
                  boxShadow: '0 4px 15px rgba(190, 18, 60, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4)'
                }}
              >
                <div className="w-10 h-10 rounded-full border border-rose-300/40 flex items-center justify-center font-serif text-lg font-bold">
                  ❤️
                </div>
              </div>
            </div>

            {/* Bottom prompt */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                <Mail className="w-3 h-3" />
                <span>Tap wax seal to break & read</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Scratch Card Activity */}
      {activityType === 'scratch-card' && (
        <div className="relative flex flex-col items-center">
          <div className="relative w-[340px] h-[240px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/80 bg-white">
            {/* The revealed content beneath the foil */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between items-center text-center bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50">
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                Surprise Unlocked!
              </span>
              <div>
                <h3 className="text-xl font-bold font-serif-luxury text-slate-800">
                  {card.hookTitle || `Dear ${card.recipientName},`}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3">
                  {card.heartfeltNote}
                </p>
              </div>
              <button
                onClick={handleCompleteOpen}
                className="py-1.5 px-4 rounded-full bg-rose-500 text-white text-xs font-semibold shadow hover:bg-rose-600 transition-colors flex items-center gap-1"
              >
                <span>Step into the full story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* The canvas scratch layer on top */}
            <canvas
              ref={scratchCanvasRef}
              className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-700 ${
                isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            />
          </div>

          {/* Scratch Progress Bar & Instant Unlock */}
          <div className="mt-4 flex items-center gap-3 w-[340px]">
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-200"
                style={{ width: `${scratchProgress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 tabular-nums">
              {scratchProgress}%
            </span>
            <button
              onClick={handleCompleteOpen}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 underline underline-offset-2 ml-1"
            >
              Scratch All
            </button>
          </div>
        </div>
      )}

      {/* Quick Skip Button */}
      <div className="mt-8">
        <button
          onClick={handleCompleteOpen}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
        >
          <span>Skip opening sequence</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
