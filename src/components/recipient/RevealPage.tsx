import React, { useState } from 'react';
import { Heart, RotateCcw, Share2, Sparkles, Check, PlusCircle, Quote, Video } from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { CanvasParticles } from '../common/CanvasParticles';
import { HeartArrowPhotoReveal } from './HeartArrowPhotoReveal';
import { VideoMessageModal } from '../common/VideoMessageModal';

interface RevealPageProps {
  card: HeartCraftCard;
  onReplay: () => void;
  onCreateNew: () => void;
}

export const RevealPage: React.FC<RevealPageProps> = ({ card, onReplay, onCreateNew }) => {
  const [copied, setCopied] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Typography class
  const getTypographyClass = () => {
    switch (card.typography) {
      case 'handwriting':
        return 'font-handwriting text-xl sm:text-2xl leading-relaxed';
      case 'calligraphy':
        return 'font-calligraphy text-2xl sm:text-3xl leading-relaxed tracking-wide';
      case 'serif':
        return 'font-serif-luxury text-base sm:text-lg leading-relaxed';
      case 'playful':
        return 'font-playful text-lg sm:text-xl leading-relaxed';
      case 'typewriter':
        return 'font-typewriter text-xs sm:text-sm leading-relaxed';
      case 'sans':
        return 'font-sans-modern text-sm sm:text-base leading-relaxed';
      case 'script':
      default:
        return 'font-script text-xl sm:text-2xl leading-relaxed';
    }
  };

  // Theme gradient styles
  const getThemeBackground = () => {
    switch (card.theme) {
      case 'lavender-dream':
        return 'from-violet-100/90 via-purple-50/80 to-pink-100/90';
      case 'golden-honey':
        return 'from-amber-100/90 via-orange-50/80 to-yellow-100/90';
      case 'mint-whisper':
        return 'from-emerald-100/90 via-teal-50/80 to-cyan-100/90';
      case 'midnight-velvet':
        return 'from-slate-900 via-indigo-950 to-purple-950 text-white';
      case 'rose-blush':
      default:
        return 'from-rose-100/90 via-pink-50/80 to-orange-50/90';
    }
  };

  const isDarkTheme = card.theme === 'midnight-velvet';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Special HeartCraft for ${card.recipientName}`,
          text: `Here is a personalized HeartCraft surprise created especially for you!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback copy
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={`relative min-h-screen py-12 px-4 sm:px-6 transition-colors duration-700 bg-gradient-to-b ${getThemeBackground()}`}>
      {/* Dynamic Floating Canvas Particles */}
      <CanvasParticles type={card.particleEffect || 'floating-hearts'} intensity="normal" />

      {/* Main Container */}
      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <div className="animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-sm border border-rose-200/60 dark:border-rose-900/40 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse text-rose-500" />
            <span>{card.occasionBadge || card.customOccasionTitle || 'A Heartfelt Message'}</span>
            <span aria-hidden="true">·</span>
            <span>Made with love</span>
          </div>
        </div>

        {/* Personalized Header */}
        <div className="text-center mt-4 mb-8">
          <h1 className={`text-3xl sm:text-5xl font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-800'} font-serif-luxury`}>
            Dearest {card.recipientName}
          </h1>

          {card.hookTitle && (
            <p className={`mt-2 text-base sm:text-xl font-script ${isDarkTheme ? 'text-pink-300' : 'text-rose-600'} max-w-lg mx-auto`}>
              "{card.hookTitle}"
            </p>
          )}
        </div>

        {/* Interactive Heart-Arrow Photo Reveal & Polaroid Memory Gallery */}
        {card.photos && card.photos.length > 0 && (
          <div className="w-full">
            <HeartArrowPhotoReveal photos={card.photos} recipientName={card.recipientName} />
          </div>
        )}

        {/* Glassmorphic Heartfelt Letter Card */}
        <div
          className={`w-full mt-4 p-6 sm:p-10 rounded-3xl ${
            isDarkTheme ? 'glass-panel-dark' : 'glass-panel'
          } shadow-2xl relative overflow-hidden transition-all`}
          style={{
            boxShadow: isDarkTheme
              ? '0 20px 45px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 85, 247, 0.2)'
              : '0 20px 45px -10px rgba(225, 29, 72, 0.12), 0 0 30px rgba(244, 114, 182, 0.15)'
          }}
        >
          {/* Subtle Corner Wax Stamp Motif */}
          <div className="absolute top-4 right-4 opacity-70 pointer-events-none">
            <div className="w-10 h-10 rounded-full border border-rose-400/40 flex items-center justify-center text-xs font-bold font-serif text-rose-500">
              💌
            </div>
          </div>

          {/* Decorative quote icon */}
          <div className="mb-4 text-rose-400/60">
            <Quote className="w-8 h-8 rotate-180" />
          </div>

          {/* Letter Body */}
          <div className={`whitespace-pre-line ${getTypographyClass()} ${isDarkTheme ? 'text-slate-100' : 'text-slate-800'}`}>
            {card.heartfeltNote}
          </div>

          {/* Sign-off */}
          {card.senderName && (
            <div className="mt-8 pt-6 border-t border-rose-200/50 dark:border-slate-700/50 flex flex-col items-end">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-sans">
                Forever In My Heart
              </span>
              <span className={`text-2xl sm:text-3xl font-calligraphy mt-1 ${isDarkTheme ? 'text-pink-300' : 'text-rose-600'}`}>
                {card.senderName}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 w-full">
          {card.videoMessageUrl && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 transition-all active:scale-95 flex items-center gap-2 text-sm font-semibold"
            >
              <Video className="w-4 h-4 text-white" />
              <span>Watch Video Message 🎥💕</span>
            </button>
          )}

          <button
            onClick={onReplay}
            className="px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800 shadow-md border border-slate-200/80 dark:border-slate-700 transition-all active:scale-95 flex items-center gap-2 text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Replay Experience</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800 shadow-md border border-slate-200/80 dark:border-slate-700 transition-all active:scale-95 flex items-center gap-2 text-sm font-semibold"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-pink-500" />
                <span>Share Card Link</span>
              </>
            )}
          </button>

          <button
            onClick={onCreateNew}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-500/25 transition-all active:scale-95 flex items-center gap-2 text-sm font-semibold"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Make Your Own Card</span>
          </button>
        </div>

        {/* Brand footer */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>HeartCraft · Created with intimate intention</span>
        </div>
      </div>

      {/* Video Message Modal */}
      {card.videoMessageUrl && (
        <VideoMessageModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoUrl={card.videoMessageUrl}
          title={card.videoMessageTitle || 'A Special Video Message For You 🎥💕'}
          recipientName={card.recipientName}
          senderName={card.senderName}
        />
      )}
    </div>
  );
};
