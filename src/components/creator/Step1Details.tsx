import React from 'react';
import { Heart, Cake, HeartCrack, Sparkles, User, Palette, Image as ImageIcon, Sliders } from 'lucide-react';
import { HeartCraftCard, OccasionType, PaperTheme } from '../../types/card';

interface Step1DetailsProps {
  card: HeartCraftCard;
  onChange: (updates: Partial<HeartCraftCard>) => void;
}

export const Step1Details: React.FC<Step1DetailsProps> = ({ card, onChange }) => {
  const occasions: { id: OccasionType; label: string; icon: any; defaultBadge: string; description: string }[] = [
    {
      id: 'sorry',
      label: 'Apology & Sorry',
      icon: HeartCrack,
      defaultBadge: "I'm Truly Sorry",
      description: 'Mend what was hurt with sweet memes & promises'
    },
    {
      id: 'anniversary',
      label: 'Love & Anniversary',
      icon: Heart,
      defaultBadge: 'Happy Anniversary',
      description: 'Celebrate your journey, milestones & tender love'
    },
    {
      id: 'birthday',
      label: 'Birthday Celebration',
      icon: Cake,
      defaultBadge: 'Happy Birthday!',
      description: 'Make their special day unforgettable & joyful'
    },
    {
      id: 'custom',
      label: 'Custom Occasion',
      icon: Sparkles,
      defaultBadge: 'Thinking of You',
      description: 'Thank you, Miss You, Proposal, or Just Because'
    }
  ];

  const themes: { id: PaperTheme; name: string; bgClass: string; dotClass: string }[] = [
    { id: 'rose-blush', name: 'Rose Blush', bgClass: 'from-rose-100 to-pink-50', dotClass: 'bg-rose-500' },
    { id: 'lavender-dream', name: 'Lavender Dream', bgClass: 'from-violet-100 to-purple-50', dotClass: 'bg-purple-500' },
    { id: 'golden-honey', name: 'Golden Honey', bgClass: 'from-amber-100 to-yellow-50', dotClass: 'bg-amber-500' },
    { id: 'mint-whisper', name: 'Mint Whisper', bgClass: 'from-emerald-100 to-teal-50', dotClass: 'bg-emerald-500' },
    { id: 'midnight-velvet', name: 'Midnight Velvet', bgClass: 'from-slate-900 to-indigo-950', dotClass: 'bg-indigo-400' }
  ];

  const handleOccasionSelect = (occ: OccasionType) => {
    const item = occasions.find((o) => o.id === occ);
    onChange({
      occasion: occ,
      occasionBadge: item?.defaultBadge || 'Special Surprise'
    });
  };

  const handleIntroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange({ introPhotoUrl: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">1. Names, Intro & Occasion</h3>
        <p className="text-xs text-slate-500 mt-1">
          Customize who this experience is for, the opening meme photo, and the swipe-to-fix prompt. Everything is 100% free & editable!
        </p>
      </div>

      {/* Recipient & Sender Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Recipient's Name / Pet Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={card.recipientName}
              onChange={(e) => onChange({ recipientName: e.target.value })}
              placeholder="e.g., Babyy, Sophia, My Love..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-white text-slate-800 text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            From (Your Name / Sign-off)
          </label>
          <input
            type="text"
            value={card.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            placeholder="e.g., Your Love, Alex, Julian..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-white text-slate-800 text-sm shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Screen 2 Customization: Intro Photo, Title, Subtitle, Swipe Text */}
      <div className="p-4 rounded-3xl bg-rose-50/50 border border-rose-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
            2
          </div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Intro Screen Customization (As in Video)
          </h4>
        </div>

        {/* Intro Photo uploader */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-rose-200 shrink-0">
            <img
              src={card.introPhotoUrl || card.photos[0]?.url}
              alt="Intro preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Intro Photo / Crying Baby Meme
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold transition-all shadow-2xs">
                <span>Upload New Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIntroImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Hook Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Intro Headline Text
            </label>
            <input
              type="text"
              value={card.hookTitle}
              onChange={(e) => onChange({ hookTitle: e.target.value })}
              placeholder="I know I messed up"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Subtitle / Message
            </label>
            <input
              type="text"
              value={card.introSubtitle || ''}
              onChange={(e) => onChange({ introSubtitle: e.target.value })}
              placeholder="Allow me to fix it for us, please listen to my heart"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>
        </div>

        {/* Swipe Slider Text & Hold Button Text */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Swipe Slider Prompt Text
            </label>
            <input
              type="text"
              value={card.swipePromptText || 'Swipe right to fix it'}
              onChange={(e) => onChange({ swipePromptText: e.target.value })}
              placeholder="Swipe right to fix it"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Hold Heart Prompt Text
            </label>
            <input
              type="text"
              value={card.holdHeartText || 'Hold to Forgive!'}
              onChange={(e) => onChange({ holdHeartText: e.target.value })}
              placeholder="Hold to Forgive!"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Occasion Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Select Occasion Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {occasions.map((occ) => {
            const Icon = occ.icon;
            const isSelected = card.occasion === occ.id;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => handleOccasionSelect(occ.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/70 shadow-sm ring-1 ring-rose-400'
                    : 'border-slate-200 hover:border-rose-200 bg-white'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{occ.label}</div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {occ.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Atmosphere */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Palette className="w-3.5 h-3.5 text-rose-500" />
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Color Atmosphere & Mood
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {themes.map((th) => {
            const isSelected = card.theme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => onChange({ theme: th.id })}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${th.dotClass} shrink-0`} />
                <span className="text-xs font-medium text-slate-800 truncate">{th.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
