import React, { useState } from 'react';
import { Type, BookOpen, Heart, Sparkles, ChevronDown, ChevronUp, Sliders, ShieldCheck } from 'lucide-react';
import { HeartCraftCard, TypographyStyle } from '../../types/card';

interface Step2MessagesProps {
  card: HeartCraftCard;
  onChange: (updates: Partial<HeartCraftCard>) => void;
}

export const Step2Messages: React.FC<Step2MessagesProps> = ({ card, onChange }) => {
  const [showAdvancedTexts, setShowAdvancedTexts] = useState(false);

  const typographyOptions: { id: TypographyStyle; name: string; preview: string; fontClass: string }[] = [
    {
      id: 'serif',
      name: 'Editorial Luxury Serif',
      preview: 'Thank You for Being so Kind',
      fontClass: 'font-serif-luxury text-sm font-semibold text-slate-800'
    },
    {
      id: 'script',
      name: 'Romantic Script (Cursive)',
      preview: 'Forever with you my love',
      fontClass: 'font-script text-lg text-rose-600'
    },
    {
      id: 'handwriting',
      name: 'Intimate Handwritten',
      preview: 'Written by hand with love',
      fontClass: 'font-handwriting text-lg text-rose-600'
    },
    {
      id: 'calligraphy',
      name: 'Royal Calligraphy',
      preview: 'My beloved & one only',
      fontClass: 'font-calligraphy text-xl text-rose-600'
    },
    {
      id: 'playful',
      name: 'Playful Cursive',
      preview: 'Sweet & Cheerful Love',
      fontClass: 'font-playful text-sm text-pink-600'
    },
    {
      id: 'typewriter',
      name: 'Vintage Typewriter',
      preview: 'Dear Babyy, with all my heart',
      fontClass: 'font-typewriter text-xs font-semibold text-slate-800'
    },
    {
      id: 'sans',
      name: 'Modern Sans',
      preview: 'Clean & Warm Typography',
      fontClass: 'font-sans-modern text-xs font-semibold text-slate-800'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800">2. Typewriter Letter, Texts & Fonts</h3>
          <p className="text-xs text-slate-500 mt-1">
            Every text, message heading, and font style across all screens is 100% editable for free.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Free Forever</span>
        </div>
      </div>

      {/* Typography Font Picker */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Type className="w-4 h-4 text-rose-500" />
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Choose Typography Font Style (7 Fonts Available)
            </label>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">
            Active: {card.typography}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {typographyOptions.map((opt) => {
            const isSelected = card.typography === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ typography: opt.id })}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/70 shadow-sm ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-xs font-semibold text-slate-700">{opt.name}</div>
                <div className={`mt-1 truncate ${opt.fontClass}`}>
                  {opt.preview}
                </div>
              </button>
            );
          })}
        </div>

        {/* Font Size controls */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Letter Font Size:</span>
          <div className="flex items-center gap-1.5">
            {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onChange({ fontSize: sz })}
                className={`px-3 py-1 rounded-lg font-semibold uppercase text-xs transition-all ${
                  (card.fontSize || 'md') === sz
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screen 6: Typewriter Letter Customization */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/50 border border-amber-200/80 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
            6
          </div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Typewriter Letter Screen (Types out letter-by-letter with typewriter sounds)
          </h4>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Letter Header Title
          </label>
          <input
            type="text"
            value={card.letterTitle || 'Thank You for Being so Kind'}
            onChange={(e) => onChange({ letterTitle: e.target.value })}
            placeholder="Thank You for Being so Kind"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400 font-semibold"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-700">
              Typewriter Letter Content
            </label>
            <span className="text-[10px] text-slate-400">
              {card.heartfeltNote.length} characters
            </span>
          </div>
          <textarea
            rows={6}
            value={card.heartfeltNote}
            onChange={(e) => onChange({ heartfeltNote: e.target.value })}
            placeholder="Write your heartfelt letter here..."
            className="w-full p-3.5 rounded-2xl border border-amber-200 bg-white text-slate-800 text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Screen 9: Final Reveal Closing Customization */}
      <div className="p-4 sm:p-5 rounded-3xl bg-pink-50/50 border border-pink-200/80 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-500 text-white flex items-center justify-center text-xs font-bold">
            9
          </div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Final Ending Reveal Screen
          </h4>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Final Title (Types out with glowing golden heart)
          </label>
          <input
            type="text"
            value={card.finalPolaroidCaption || 'New Beginnings Ahead'}
            onChange={(e) => onChange({ finalPolaroidCaption: e.target.value })}
            placeholder="New Beginnings Ahead"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400 font-semibold"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Final Closing Love Message
          </label>
          <textarea
            rows={3}
            value={card.finalClosingNote || ''}
            onChange={(e) => onChange({ finalClosingNote: e.target.value })}
            placeholder="Thank you for being the most forgiving and wonderful person. I love you to the moon and back and I'm never letting you go. ❤️"
            className="w-full p-3.5 rounded-2xl border border-pink-200 bg-white text-slate-800 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>
      </div>

      {/* Advanced All Screens Text Headings Toggle */}
      <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-2xs">
        <button
          type="button"
          onClick={() => setShowAdvancedTexts(!showAdvancedTexts)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-500" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                Customize All Other Screen Headings & Prompts
              </div>
              <div className="text-[11px] text-slate-500">
                Hook title, swipe button, hold text, heal heart title, bribes title
              </div>
            </div>
          </div>
          {showAdvancedTexts ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showAdvancedTexts && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-fadeIn">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Screen 2: Intro Hook Title
              </label>
              <input
                type="text"
                value={card.hookTitle}
                onChange={(e) => onChange({ hookTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Screen 2: Intro Subtitle / Note
              </label>
              <textarea
                rows={2}
                value={card.introSubtitle || ''}
                onChange={(e) => onChange({ introSubtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Screen 2: Swipe Prompt Button Text
              </label>
              <input
                type="text"
                value={card.swipePromptText}
                onChange={(e) => onChange({ swipePromptText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Screen 5: Heart Action Button Text
              </label>
              <input
                type="text"
                value={card.holdHeartText}
                onChange={(e) => onChange({ holdHeartText: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Screen 7: Heal My Heart Title
                </label>
                <input
                  type="text"
                  value={card.healHeartTitle || 'Now Please Heal My heart'}
                  onChange={(e) => onChange({ healHeartTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Screen 8: Apology Bribes Title
                </label>
                <input
                  type="text"
                  value={card.bribesTitle || 'Please accept my apology bribes ;)'}
                  onChange={(e) => onChange({ bribesTitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
