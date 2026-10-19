import React, { useState } from 'react';
import { Sparkles, Heart, Star, Cake, QrCode, Film, ArrowRight, X } from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { HeartCraftAnimatedStory } from './HeartCraftAnimatedStory';
import { APOLOGY_PRESET_CARD, ROMANTIC_PRESET_CARD, BIRTHDAY_PRESET_CARD } from '../../utils/storage';

interface TemplateShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (card: HeartCraftCard) => void;
}

type CategoryTab = 'heartfelt' | 'sweet' | 'romantic' | 'birthday';

export const TemplateShowcaseModal: React.FC<TemplateShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('heartfelt');
  const [activeCard, setActiveCard] = useState<HeartCraftCard>(APOLOGY_PRESET_CARD);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: CategoryTab) => {
    setSelectedCategory(cat);
    if (cat === 'heartfelt') {
      setActiveCard(APOLOGY_PRESET_CARD);
    } else if (cat === 'romantic') {
      setActiveCard(ROMANTIC_PRESET_CARD);
    } else if (cat === 'birthday') {
      setActiveCard(BIRTHDAY_PRESET_CARD);
    } else if (cat === 'sweet') {
      setActiveCard({
        ...APOLOGY_PRESET_CARD,
        id: 'preset-sweet',
        hookTitle: 'A little sweet surprise for you 🍰',
        swipePromptText: 'Swipe right for sweetness 👉',
        holdHeartText: 'Hold to Taste the Sweetness 🍯'
      });
    }
  };

  const handleUseThisTemplate = () => {
    onSelectTemplate(activeCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-xl bg-slate-900 rounded-[38px] p-5 sm:p-7 shadow-2xl border border-slate-800 text-white flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header from video: "Select your template" */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Select your template
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Experience the animated interactive storybook just like on HeartCraft
          </p>
        </div>

        {/* Center: The Phone Mockup running the Animated Story */}
        <div className="w-full flex justify-center my-2">
          <div className="w-full max-w-[340px] h-[550px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-slate-700 bg-white">
            <HeartCraftAnimatedStory
              card={activeCard}
              isEmbeddedMockup={true}
            />
          </div>
        </div>

        {/* Template Category Tabs from video: Sweet, Heartfelt, Romantic */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full">
          <button
            onClick={() => handleCategoryChange('sweet')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              selectedCategory === 'sweet'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Sweet</span>
          </button>

          <button
            onClick={() => handleCategoryChange('heartfelt')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              selectedCategory === 'heartfelt'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Heartfelt</span>
          </button>

          <button
            onClick={() => handleCategoryChange('romantic')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              selectedCategory === 'romantic'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Romantic</span>
          </button>

          <button
            onClick={() => handleCategoryChange('birthday')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              selectedCategory === 'birthday'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Birthday</span>
          </button>
        </div>

        {/* Feature Badges from video */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Personal link
          </span>
          <span className="flex items-center gap-1">
            <QrCode className="w-3 h-3 text-rose-400" />
            QR Code
          </span>
          <span className="flex items-center gap-1">
            <Film className="w-3 h-3 text-rose-400" />
            Personalized Music
          </span>
        </div>

        {/* 100% Free Forever Banner (No Money Required) */}
        <div className="w-full mt-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-left">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                100% Free Forever · No Money Required
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">Full Free Access</span>
                <span className="text-[10px] text-emerald-300 font-medium">· Unlimited Cards</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleUseThisTemplate}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Use This Template (Free)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
