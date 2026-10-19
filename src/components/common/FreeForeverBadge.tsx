import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles, Heart, Zap, X } from 'lucide-react';

interface FreeForeverBadgeProps {
  variant?: 'banner' | 'pill' | 'button';
  className?: string;
}

export const FreeForeverBadge: React.FC<FreeForeverBadgeProps> = ({
  variant = 'pill',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);

  const perks = [
    { title: 'Zero Cost Forever', desc: '100% Free! No hidden fees, no subscriptions, no credit card required.' },
    { title: 'Unlimited Photo & Video Uploads', desc: 'Add as many custom photos, memes, polaroids, and video links as you want.' },
    { title: 'Full YouTube Music & Audio', desc: 'Pick any song, set start seconds, chorus looping, with background playback.' },
    { title: 'Instant Shareable Links & QR Codes', desc: 'Share your card with friends or loved ones instantly on WhatsApp, Instagram, or anywhere.' },
    { title: 'Private & Secure PIN Lock', desc: 'Protect your heartfelt messages with a secret passcode only your recipient knows.' },
    { title: 'No Watermark & Clean Experience', desc: 'Clean, elegant, premium aesthetic inspired by HeartCraft without distracting ads.' }
  ];

  return (
    <>
      {variant === 'banner' && (
        <div className={`w-full py-2 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-500 text-white flex items-center justify-between text-xs shadow-xs ${className}`}>
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-semibold tracking-wide">
                🎉 100% Free Forever · No Money Required · No Paywalls · Unlimited Free Cards & Sharing
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold text-[11px] underline underline-offset-2 shrink-0 transition-all"
            >
              Why it's free?
            </button>
          </div>
        </div>
      )}

      {variant === 'pill' && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80 text-xs font-semibold shadow-2xs transition-all active:scale-95 ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free • No Payment Needed</span>
        </button>
      )}

      {variant === 'button' && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-sm hover:from-emerald-600 hover:to-teal-700 transition-all active:scale-95 ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Guarantee</span>
        </button>
      )}

      {/* Guarantee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  100% Free Forever Guarantee
                </h3>
                <p className="text-xs text-slate-500">
                  No money required · No credits · No charges
                </p>
              </div>
            </div>

            <div className="space-y-2.5 my-4">
              {perks.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-left">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{p.title}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
            >
              Awesome, Start Creating Free! ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
};
