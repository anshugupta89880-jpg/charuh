import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, Sparkles, HeartHandshake, HelpCircle } from 'lucide-react';
import { HeartCraftCard } from '../../types/card';

interface PasswordGateProps {
  card: HeartCraftCard;
  onUnlocked: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ card, onUnlocked }) => {
  const [inputVal, setInputVal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isUnlocking) return;

    const trimmedInput = inputVal.trim().toLowerCase();
    const targetPassword = card.secretPassword.trim().toLowerCase();

    if (!targetPassword || trimmedInput === targetPassword) {
      setErrorMessage('');
      setIsUnlocking(true);
      // Play brief pleasant chime or trigger immediately
      setTimeout(() => {
        onUnlocked();
      }, 700);
    } else {
      setIsShaking(true);
      setErrorMessage('That secret word is not quite right. Try again!');
      setTimeout(() => {
        setIsShaking(false);
      }, 600);
    }
  };

  return (
    <div className="relative z-20 flex min-h-[90vh] items-center justify-center px-4 py-8">
      <div
        className={`w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel shadow-2xl transition-all duration-700 ${
          isUnlocking ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        } ${isShaking ? 'animate-shake' : ''}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(225, 29, 72, 0.15), 0 0 40px rgba(244, 114, 182, 0.2)'
        }}
      >
        {/* Top Decorative Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-float-slow">
              <Lock className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Header Text */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-500">
            Private & Confidential
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-800 font-serif-luxury">
            Surprise for {card.recipientName || 'You'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {card.senderName ? (
              <span>
                Crafted with love by <strong className="text-rose-600">{card.senderName}</strong>.
              </span>
            ) : (
              'Someone made a special interactive experience just for you.'
            )}
            <br />
            Enter the secret passcode to unlock and reveal.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter secret word or PIN..."
              className="w-full pl-11 pr-11 py-3.5 text-base sm:text-lg rounded-2xl border border-rose-200/80 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-slate-800 placeholder-slate-400 shadow-inner transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-xs font-medium text-rose-600 bg-rose-50/90 border border-rose-200 rounded-xl py-2 px-3 text-center">
              {errorMessage}
            </div>
          )}

          {/* Unlock Button */}
          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full py-3.5 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span>{isUnlocking ? 'Unlocking Memories...' : 'Unlock Experience'}</span>
          </button>
        </form>

        {/* Password Hint Accordion */}
        {card.passwordHint && (
          <div className="mt-5 pt-4 border-t border-rose-100/80 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide creator hint' : 'Need a hint?'}</span>
            </button>

            {showHint && (
              <div className="mt-2.5 p-3 rounded-xl bg-pink-50/70 border border-pink-100 text-xs text-slate-700 leading-normal animate-fadeIn">
                <span className="font-semibold text-rose-600">Hint:</span> {card.passwordHint}
              </div>
            )}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
          <span>Protected with HeartCraft end-to-end secret gate</span>
        </div>
      </div>
    </div>
  );
};
