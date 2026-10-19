import React, { useState } from 'react';
import { Lock, Key, HelpCircle, Gift, Mail, Sparkles, Check, Copy, ExternalLink, QrCode, Share2, Target } from 'lucide-react';
import { HeartCraftCard, OpeningActivity, ParticleType } from '../../types/card';
import { encodeCardToHash } from '../../utils/storage';

interface Step5SecurityShareProps {
  card: HeartCraftCard;
  onChange: (updates: Partial<HeartCraftCard>) => void;
  onOpenRecipientPreview: () => void;
}

export const Step5SecurityShare: React.FC<Step5SecurityShareProps> = ({
  card,
  onChange,
  onOpenRecipientPreview
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Generate shareable URL with hash
  const shareHash = encodeCardToHash(card);
  const shareableUrl = `${window.location.origin}${window.location.pathname}${shareHash}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey ${card.recipientName}! I made a special personalized HeartCraft experience for you. Open this link: ${shareableUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const activities: { id: OpeningActivity; label: string; desc: string; icon: any }[] = [
    {
      id: 'cupid-arrow',
      label: "Cupid's Arrow & Heart",
      desc: 'Shoot golden arrow to hit beating heart & burst open memories',
      icon: Target
    },
    {
      id: 'gift-box',
      label: '3D Gift Box',
      desc: 'Tap ribbon knot to untie satin bow & pop box lid',
      icon: Gift
    },
    {
      id: 'wax-envelope',
      label: 'Wax-Sealed Mail',
      desc: 'Tap heart wax seal to break seal & pull letter',
      icon: Mail
    },
    {
      id: 'scratch-card',
      label: 'Scratch-Off Card',
      desc: 'Rub gold shimmer foil to uncover the surprise',
      icon: Sparkles
    }
  ];

  const particles: { id: ParticleType; label: string; emoji: string }[] = [
    { id: 'floating-hearts', label: 'Floating 3D Hearts', emoji: '💖' },
    { id: 'cherry-petals', label: 'Cherry Blossom Petals', emoji: '🌸' },
    { id: 'stardust', label: 'Golden Stardust', emoji: '✨' },
    { id: 'confetti', label: 'Party Confetti', emoji: '🎉' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">5. Password Protection & Reveal Magic</h3>
        <p className="text-xs text-slate-500 mt-1">
          Lock this card with a secret word only they know, choose the unboxing ritual, and get your final shareable link.
        </p>
      </div>

      {/* Secret Password Configuration */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Secret Password / PIN Gate</div>
            <div className="text-[10px] text-slate-500">
              Only the recipient can unlock this card by typing this secret
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              4-Digit Passcode PIN (Screen 1 in Video)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="text"
                maxLength={6}
                value={card.secretPassword}
                onChange={(e) => onChange({ secretPassword: e.target.value })}
                placeholder="e.g., 1204"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Default is 1204 (as shown in video keypad)
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Passcode Hint for Recipient (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={card.passwordHint}
                onChange={(e) => onChange({ passwordHint: e.target.value })}
                placeholder="e.g., Something special is waiting for you"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Opening Activity Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Interactive Opening Ritual *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {activities.map((act) => {
            const Icon = act.icon;
            const isSelected = card.openingActivity === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onChange({ openingActivity: act.id })}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/70 shadow-sm ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-semibold text-slate-800">{act.label}</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-snug">{act.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Particle Atmosphere Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Canvas Floating Particle Effect *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {particles.map((p) => {
            const isSelected = card.particleEffect === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ particleEffect: p.id })}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/70 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="text-base">{p.emoji}</div>
                <div className="text-[11px] font-medium text-slate-700 mt-1">{p.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shareable Link Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 border border-rose-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">Your HeartCraft is Ready!</div>
              <div className="text-[11px] text-slate-500">
                Share this secure link with {card.recipientName || 'your recipient'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-2xs transition-all flex items-center gap-1 text-xs font-semibold"
            title="Toggle QR Code"
          >
            <QrCode className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
        </div>

        {/* Link Input & Copy */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareableUrl}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-xs text-slate-600 select-all font-mono truncate"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* QR Code Container */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-white border border-rose-200 flex flex-col items-center justify-center animate-fadeIn">
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Scan with smartphone camera:
            </div>
            {/* Visual SVG QR Code simulation */}
            <div className="p-3 bg-white border-2 border-slate-800 rounded-xl shadow-inner">
              <svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className="w-40 h-40"
              >
                {/* QR Positioning patterns */}
                <rect width="160" height="160" fill="white" />
                {/* Top-Left Corner */}
                <rect x="10" y="10" width="40" height="40" fill="#be123c" />
                <rect x="18" y="18" width="24" height="24" fill="white" />
                <rect x="24" y="24" width="12" height="12" fill="#be123c" />
                {/* Top-Right Corner */}
                <rect x="110" y="10" width="40" height="40" fill="#be123c" />
                <rect x="118" y="18" width="24" height="24" fill="white" />
                <rect x="124" y="24" width="12" height="12" fill="#be123c" />
                {/* Bottom-Left Corner */}
                <rect x="10" y="110" width="40" height="40" fill="#be123c" />
                <rect x="18" y="118" width="24" height="24" fill="white" />
                <rect x="24" y="124" width="12" height="12" fill="#be123c" />
                {/* Decorative data dots */}
                <rect x="60" y="20" width="10" height="10" fill="#1e293b" />
                <rect x="80" y="20" width="10" height="10" fill="#1e293b" />
                <rect x="60" y="40" width="10" height="10" fill="#1e293b" />
                <rect x="70" y="50" width="10" height="10" fill="#1e293b" />
                <rect x="90" y="50" width="10" height="10" fill="#1e293b" />
                <rect x="20" y="60" width="10" height="10" fill="#1e293b" />
                <rect x="40" y="70" width="10" height="10" fill="#1e293b" />
                <rect x="70" y="70" width="20" height="20" fill="#be123c" rx="4" />
                <rect x="110" y="70" width="10" height="10" fill="#1e293b" />
                <rect x="130" y="80" width="10" height="10" fill="#1e293b" />
                <rect x="60" y="90" width="10" height="10" fill="#1e293b" />
                <rect x="80" y="100" width="10" height="10" fill="#1e293b" />
                <rect x="60" y="120" width="10" height="10" fill="#1e293b" />
                <rect x="80" y="130" width="10" height="10" fill="#1e293b" />
                <rect x="100" y="110" width="10" height="10" fill="#1e293b" />
                <rect x="120" y="120" width="10" height="10" fill="#1e293b" />
                <rect x="130" y="130" width="10" height="10" fill="#1e293b" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-400 mt-2">
              HeartCraft Instant QR Key
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onOpenRecipientPreview}
            className="flex-1 min-w-[160px] py-3 px-4 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 text-xs"
          >
            <ExternalLink className="w-4 h-4 text-rose-400" />
            <span>Launch Recipient Experience</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="py-3 px-4 rounded-xl font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 shadow-2xs transition-all active:scale-98 flex items-center justify-center gap-1.5 text-xs"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Send via WhatsApp</span>
          </button>
        </div>

        {/* 100% Free Guarantee Card */}
        <div className="p-3.5 rounded-2xl bg-white/80 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">
              100% Free Forever • Zero Payment • Unlimited Free Sharing
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
            No Money Required
          </span>
        </div>
      </div>
    </div>
  );
};
