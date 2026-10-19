import React, { useState } from 'react';
import { HeartCraftCard } from '../../types/card';
import { PasswordGate } from './PasswordGate';
import { InteractiveOpening } from './InteractiveOpening';
import { RevealPage } from './RevealPage';
import { YouTubePlayer } from './YouTubePlayer';
import { CanvasParticles } from '../common/CanvasParticles';
import { HeartCraftAnimatedStory } from '../animated/HeartCraftAnimatedStory';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

interface RecipientExperienceProps {
  card: HeartCraftCard;
  onExitToEditor: () => void;
}

type RecipientScreen = 'interactive-intro' | 'final-reveal' | 'animated-story';

export const RecipientExperience: React.FC<RecipientExperienceProps> = ({ card, onExitToEditor }) => {
  const [currentScreen, setCurrentScreen] = useState<RecipientScreen>('animated-story');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleOpeningFinished = () => {
    setCurrentScreen('final-reveal');
    setIsMusicPlaying(true);
  };

  const handleReplay = () => {
    setCurrentScreen('animated-story');
    setIsMusicPlaying(false);
  };

  const triggerAudioStart = () => {
    setIsMusicPlaying(true);
  };

  const getThemeBackground = () => {
    switch (card.theme) {
      case 'lavender-dream':
        return 'from-violet-100 via-purple-50 to-pink-50';
      case 'golden-honey':
        return 'from-amber-100 via-orange-50 to-yellow-50';
      case 'mint-whisper':
        return 'from-emerald-100 via-teal-50 to-cyan-50';
      case 'midnight-velvet':
        return 'from-slate-900 via-indigo-950 to-purple-950';
      case 'rose-blush':
      default:
        return 'from-rose-100 via-pink-50 to-rose-50';
    }
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${getThemeBackground()} overflow-x-hidden selection:bg-rose-200 selection:text-rose-900`}>
      {/* Background Floating Canvas */}
      <CanvasParticles type={card.particleEffect || 'floating-hearts'} intensity="gentle" />

      {/* Mode Switcher pill on top right when unlocked */}
      {currentScreen !== 'password-gate' && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 p-1 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg border border-slate-200/80 text-xs">
          <button
            onClick={() => setCurrentScreen('animated-story')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'animated-story'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Animated Story</span>
            <span className="sm:hidden">Story</span>
          </button>

          <button
            onClick={() => setCurrentScreen('final-reveal')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              currentScreen === 'final-reveal'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Letter & Photos</span>
            <span className="sm:hidden">Letter</span>
          </button>
        </div>
      )}

      {/* Screen A: Password Gate */}
      {currentScreen === 'password-gate' && (
        <PasswordGate
          card={card}
          onUnlocked={handlePasswordUnlocked}
        />
      )}

      {/* Screen B: Interactive Intro & Opening */}
      {currentScreen === 'interactive-intro' && (
        <InteractiveOpening
          card={card}
          onOpened={handleOpeningFinished}
          triggerAudioStart={triggerAudioStart}
        />
      )}

      {/* Screen: Animated Multi-Step Story (As shown in the video) */}
      {currentScreen === 'animated-story' && (
        <div className="relative z-20 min-h-screen py-10 px-4 flex flex-col items-center justify-center animate-fadeIn">
          <HeartCraftAnimatedStory
            card={card}
            isAudioPlaying={isMusicPlaying}
            onToggleAudio={() => setIsMusicPlaying(!isMusicPlaying)}
            onRestartExperience={handleReplay}
          />
        </div>
      )}

      {/* Screen C: The HeartCraft Classic Reveal Page (Letter & Polaroid Stack) */}
      {currentScreen === 'final-reveal' && (
        <RevealPage
          card={card}
          onReplay={handleReplay}
          onCreateNew={onExitToEditor}
        />
      )}

      {/* YouTube Audio Player */}
      {card.youtubeUrl && (
        <YouTubePlayer
          youtubeUrl={card.youtubeUrl}
          startOffset={card.youtubeOffsetSeconds || 0}
          loop={card.youtubeLoop ?? true}
          isPlaying={isMusicPlaying}
          onPlayStateChange={(playing) => setIsMusicPlaying(playing)}
          title={card.occasionBadge || 'Soundtrack'}
        />
      )}
    </div>
  );
};
