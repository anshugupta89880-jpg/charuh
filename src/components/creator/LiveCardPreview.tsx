import React, { useState } from 'react';
import { Sparkles, Eye, Music, Lock, Heart, Play, Layers } from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { HeartCraftAnimatedStory } from '../animated/HeartCraftAnimatedStory';

interface LiveCardPreviewProps {
  card: HeartCraftCard;
  onTestFullView: () => void;
}

export const LiveCardPreview: React.FC<LiveCardPreviewProps> = ({ card, onTestFullView }) => {
  const [previewMode, setPreviewMode] = useState<'animated-story' | 'letter'>('animated-story');

  const getTypographyClass = () => {
    switch (card.typography) {
      case 'handwriting':
        return 'font-handwriting text-lg leading-relaxed';
      case 'calligraphy':
        return 'font-calligraphy text-xl leading-relaxed';
      case 'serif':
        return 'font-serif-luxury text-xs leading-relaxed';
      case 'playful':
        return 'font-playful text-sm leading-relaxed';
      case 'typewriter':
        return 'font-typewriter text-xs leading-relaxed';
      case 'sans':
        return 'font-sans-modern text-xs leading-relaxed';
      case 'script':
      default:
        return 'font-script text-lg leading-relaxed';
    }
  };

  const getThemeBg = () => {
    switch (card.theme) {
      case 'lavender-dream':
        return 'from-violet-100 to-pink-50';
      case 'golden-honey':
        return 'from-amber-100 to-yellow-50';
      case 'mint-whisper':
        return 'from-emerald-100 to-teal-50';
      case 'midnight-velvet':
        return 'from-slate-900 to-purple-950 text-white';
      case 'rose-blush':
      default:
        return 'from-rose-100 to-pink-50';
    }
  };

  const isDark = card.theme === 'midnight-velvet';
  const topPhoto = card.photos && card.photos.length > 0 ? card.photos[0] : null;

  return (
    <div className="flex flex-col items-center w-full sticky top-24">
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between w-full max-w-[340px] mb-2 px-1 text-xs">
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl">
          <button
            onClick={() => setPreviewMode('animated-story')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              previewMode === 'animated-story'
                ? 'bg-white text-rose-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Story</span>
          </button>
          <button
            onClick={() => setPreviewMode('letter')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              previewMode === 'letter'
                ? 'bg-white text-rose-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Letter</span>
          </button>
        </div>

        <button
          onClick={onTestFullView}
          className="text-rose-500 hover:text-rose-600 font-semibold underline underline-offset-2 flex items-center gap-1"
        >
          <span>Fullscreen</span>
        </button>
      </div>

      {/* Simulated Smartphone Shell */}
      <div className="relative w-full max-w-[340px] rounded-[38px] p-2 bg-slate-900 shadow-2xl border-4 border-slate-800">
        {/* Dynamic Island Notch */}
        <div className="absolute top-3.5 inset-x-0 mx-auto w-24 h-4 rounded-full bg-slate-950 z-30" />

        {previewMode === 'animated-story' ? (
          /* Live Animated Storybook Experience (From Video) */
          <div className="relative w-full h-[550px] rounded-[30px] overflow-hidden bg-white">
            <HeartCraftAnimatedStory
              card={card}
              isEmbeddedMockup={true}
            />
          </div>
        ) : (
          /* Classic Letter & Polaroid Preview */
          <div
            className={`relative w-full h-[550px] rounded-[30px] overflow-y-auto overflow-x-hidden p-4 pt-8 bg-gradient-to-b ${getThemeBg()} transition-colors duration-500 scrollbar-none`}
          >
            {/* Status indicators */}
            <div className="flex items-center justify-between text-[10px] mb-3 opacity-75">
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>{card.occasionBadge || 'HeartCraft'}</span>
              </span>
              <div className="flex items-center gap-2">
                {card.secretPassword && (
                  <span className="flex items-center gap-0.5 text-slate-500" title="Password Protected">
                    <Lock className="w-2.5 h-2.5 text-rose-500" />
                    <span>PIN</span>
                  </span>
                )}
                {card.youtubeUrl && (
                  <span className="flex items-center gap-0.5 text-slate-500" title="Background Music">
                    <Music className="w-2.5 h-2.5 text-pink-500" />
                    <span>Audio</span>
                  </span>
                )}
              </div>
            </div>

            {/* Recipient Title */}
            <div className="text-center mb-4">
              <h4
                className={`text-xl font-bold font-serif-luxury ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Dear {card.recipientName || 'Name'}
              </h4>
              {card.hookTitle && (
                <p className="text-xs font-script text-rose-500 mt-0.5 line-clamp-1">
                  "{card.hookTitle}"
                </p>
              )}
            </div>

            {/* Polaroid Preview */}
            {topPhoto ? (
              <div className="relative mx-auto my-3 w-48 bg-white rounded-xl p-2 pb-3 shadow-md border border-slate-200/80 -rotate-2">
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={topPhoto.url}
                    alt={topPhoto.caption || 'Memory'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-handwriting text-slate-800 truncate">
                    {topPhoto.caption || 'Cherished moment'}
                  </p>
                </div>
                {card.photos.length > 1 && (
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold shadow-sm">
                    +{card.photos.length - 1} more
                  </span>
                )}
              </div>
            ) : (
              <div className="my-4 p-4 rounded-2xl bg-white/50 border border-dashed border-rose-200 text-center text-[11px] text-slate-400">
                No photos added yet
              </div>
            )}

            {/* Letter Preview Box */}
            <div
              className={`p-4 rounded-2xl ${
                isDark ? 'glass-panel-dark' : 'glass-panel'
              } shadow-md mt-4 relative text-left`}
            >
              <div
                className={`line-clamp-6 ${getTypographyClass()} ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                {card.heartfeltNote || 'Your custom message will appear here...'}
              </div>

              {card.senderName && (
                <div className="mt-3 pt-2 border-t border-rose-200/40 text-right">
                  <span className="text-xs font-calligraphy text-rose-500">
                    With love, {card.senderName}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
