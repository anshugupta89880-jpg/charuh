import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  QrCode, 
  Copy, 
  Check, 
  Sparkles, 
  Heart, 
  Layers, 
  Lock, 
  Key, 
  Eye, 
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { generateCardQrDataUrl, getQrShareableUrl } from '../../utils/qrHelper';

interface PrintablePhysicalCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: HeartCraftCard;
}

type CardLayoutFormat = 'foldable-bifold' | 'mini-gift-tag' | 'postcard';
type CardPrintTheme = 'romantic-blush' | 'vintage-kraft' | 'luxury-gold' | 'minimalist-ink';

export const PrintablePhysicalCardModal: React.FC<PrintablePhysicalCardModalProps> = ({
  isOpen,
  onClose,
  card
}) => {
  const [layout, setLayout] = useState<CardLayoutFormat>('foldable-bifold');
  const [theme, setTheme] = useState<CardPrintTheme>('romantic-blush');
  const [qrColor, setQrColor] = useState<'#0f172a' | '#be123c' | '#431407'>('#0f172a');
  
  // Customizable physical card text
  const [cardHeadline, setCardHeadline] = useState(
    card.cardTitle || 'A Special Surprise Waiting For You'
  );
  const [customCardNote, setCustomCardNote] = useState(
    `I crafted an interactive animated story full of our sweet memories, fun surprises, and heartfelt words. Open your phone camera, scan the code below, and turn your sound on! 💕`
  );
  const [showPasscode, setShowPasscode] = useState(Boolean(card.secretPassword));
  const [showPhoto, setShowPhoto] = useState(card.photos && card.photos.length > 0);
  const [showGuideLines, setShowGuideLines] = useState(true);

  // QR code state
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [generatingQr, setGeneratingQr] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareableUrl = getQrShareableUrl(card);

  // Generate QR code whenever card or QR color changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setGeneratingQr(true);

    generateCardQrDataUrl(card, {
      width: 600,
      margin: 1,
      color: {
        dark: qrColor,
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setGeneratingQr(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR data URL:', err);
        if (isMounted) setGeneratingQr(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, card, qrColor]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `HeartCraft-QRCode-${card.recipientName || 'Gift'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  // Font styling based on typography
  const getCardFontClass = () => {
    switch (card.typography) {
      case 'handwriting': return 'font-handwriting';
      case 'script': return 'font-script';
      case 'calligraphy': return 'font-calligraphy';
      case 'serif': return 'font-serif-luxury';
      case 'playful': return 'font-playful';
      case 'typewriter': return 'font-typewriter';
      default: return 'font-sans-modern';
    }
  };

  // Theme styling presets
  const getThemeStyles = () => {
    switch (theme) {
      case 'romantic-blush':
        return {
          cardBg: 'bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-amber-50/80',
          border: 'border-rose-300',
          accentText: 'text-rose-600',
          badgeBg: 'bg-rose-500 text-white',
          qrFrame: 'border-2 border-rose-300 bg-white/95 shadow-md',
          paperTexture: 'border-dashed border-rose-200'
        };
      case 'vintage-kraft':
        return {
          cardBg: 'bg-[#fbf6ec]',
          border: 'border-[#d6c4a8]',
          accentText: 'text-[#854d0e]',
          badgeBg: 'bg-[#854d0e] text-[#fef9c3]',
          qrFrame: 'border-2 border-[#bfa682] bg-white shadow-sm',
          paperTexture: 'border-dashed border-[#d6c4a8]'
        };
      case 'luxury-gold':
        return {
          cardBg: 'bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#1c1917]',
          border: 'border-amber-400/40 text-amber-100',
          accentText: 'text-amber-300',
          badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900',
          qrFrame: 'border-2 border-amber-400 bg-white shadow-lg',
          paperTexture: 'border-dashed border-amber-500/30'
        };
      case 'minimalist-ink':
      default:
        return {
          cardBg: 'bg-white',
          border: 'border-slate-800',
          accentText: 'text-slate-900',
          badgeBg: 'bg-slate-900 text-white',
          qrFrame: 'border-2 border-slate-900 bg-white shadow-xs',
          paperTexture: 'border-dashed border-slate-300'
        };
    }
  };

  const currentTheme = getThemeStyles();
  const selectedPhoto = card.photos && card.photos.length > 0 ? card.photos[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/80 backdrop-blur-md">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header (Hidden when printing via index.css) */}
        <div className="no-print px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-rose-50/80 via-white to-pink-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Print on Physical Card & QR Code
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Generate a real scannable QR code and ready-to-print physical gift card for your recipient
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card (A4 / Letter)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Controls on left, Live Card Preview on right */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column (Hidden during print) */}
          <div className="no-print lg:col-span-4 space-y-5">
            
            {/* Format Selector */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-500" />
                <span>Card Print Format</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setLayout('foldable-bifold')}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                    layout === 'foldable-bifold'
                      ? 'border-rose-500 bg-white ring-2 ring-rose-400/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 ${layout === 'foldable-bifold' ? 'text-rose-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Foldable Greeting Card</div>
                    <div className="text-[10px] text-slate-500">
                      Standard A4/Letter foldable card with inside note + QR code on right
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLayout('mini-gift-tag')}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                    layout === 'mini-gift-tag'
                      ? 'border-rose-500 bg-white ring-2 ring-rose-400/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 mt-0.5 ${layout === 'mini-gift-tag' ? 'text-rose-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Mini Gift Tag / Polaroid Insert</div>
                    <div className="text-[10px] text-slate-500">
                      3.5" x 5" compact card to slip inside a flower bouquet, chocolate box, or envelope
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLayout('postcard')}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                    layout === 'postcard'
                      ? 'border-rose-500 bg-white ring-2 ring-rose-400/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 ${layout === 'postcard' ? 'text-rose-500' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Postcard Keepsake</div>
                    <div className="text-[10px] text-slate-500">
                      Horizontal postcard with memories on left and scan instructions on right
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Paper Theme */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Paper Theme & Aesthetic</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'romantic-blush', label: 'Romantic Blush', color: 'bg-rose-100 border-rose-300 text-rose-800' },
                  { id: 'vintage-kraft', label: 'Vintage Kraft', color: 'bg-[#fbf6ec] border-[#bfa682] text-[#854d0e]' },
                  { id: 'luxury-gold', label: 'Luxury Obsidian', color: 'bg-slate-900 border-amber-400 text-amber-200' },
                  { id: 'minimalist-ink', label: 'Printer Friendly', color: 'bg-white border-slate-300 text-slate-800' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id as CardPrintTheme)}
                    className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      theme === th.id
                        ? `${th.color} ring-2 ring-rose-400/30 font-bold shadow-xs`
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Content Customization */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>Custom Card Text</span>
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Card Main Headline
                </label>
                <input
                  type="text"
                  value={cardHeadline}
                  onChange={(e) => setCardHeadline(e.target.value)}
                  placeholder="A Special Surprise For You..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Physical Note / Instructions
                </label>
                <textarea
                  rows={3}
                  value={customCardNote}
                  onChange={(e) => setCustomCardNote(e.target.value)}
                  placeholder="Write a sweet note or instructions on the card..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPasscode}
                    onChange={(e) => setShowPasscode(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Print Secret Passcode on Card ({card.secretPassword || '1204'})
                  </span>
                </label>

                {selectedPhoto && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showPhoto}
                      onChange={(e) => setShowPhoto(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Include Photo Memory on Card
                    </span>
                  </label>
                )}

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showGuideLines}
                    onChange={(e) => setShowGuideLines(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Show Cut & Fold Guide Marks (Dashed Lines)
                  </span>
                </label>
              </div>
            </div>

            {/* QR Code Actions */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/60 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>QR Code Tools</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Camera Scannable
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  disabled={generatingQr || !qrDataUrl}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                  title="Download standalone high-resolution QR Code PNG"
                >
                  <Download className="w-3.5 h-3.5 text-rose-500" />
                  <span>Download QR PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-rose-500" />
                      <span>Copy Card Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Color Picker */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">QR Ink Color:</span>
                <div className="flex items-center gap-1.5">
                  {[
                    { hex: '#0f172a', label: 'Black' },
                    { hex: '#be123c', label: 'Rose' },
                    { hex: '#431407', label: 'Sepia' }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setQrColor(c.hex as any)}
                      className={`w-5 h-5 rounded-full border transition-all ${
                        qrColor === c.hex ? 'ring-2 ring-rose-400 scale-110' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Printable Preview */}
          <div className="lg:col-span-8 flex flex-col items-center justify-start overflow-hidden">
            
            {/* Live Preview Label & Quick Print Button */}
            <div className="no-print w-full flex items-center justify-between mb-3 px-2">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-rose-500" />
                <span>Live Card Preview (Prints Exactly As Shown)</span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-rose-400" />
                <span>Print This Card</span>
              </button>
            </div>

            {/* ======================================================================
                PRINTABLE AREA: This is the exact target printed via #printable-physical-card-area
                ====================================================================== */}
            <div
              id="printable-physical-card-area"
              className="w-full flex items-center justify-center p-2 sm:p-4"
            >
              
              {/* -------------------------------------------------------------
                  LAYOUT 1: FOLDABLE BIFOLD GREETING CARD (A4/Letter Foldable)
                  ------------------------------------------------------------- */}
              {layout === 'foldable-bifold' && (
                <div className={`w-full max-w-3xl rounded-2xl border-2 ${currentTheme.border} ${currentTheme.cardBg} p-6 sm:p-8 shadow-lg relative overflow-hidden transition-all duration-300`}>
                  
                  {/* Subtle decorative background watermark */}
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-rose-200/20 blur-2xl pointer-events-none" />
                  <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-pink-200/20 blur-2xl pointer-events-none" />

                  {/* Cut & Fold Line down the center */}
                  {showGuideLines && (
                    <div className="hidden sm:block absolute left-1/2 inset-y-0 -translate-x-1/2 w-0 border-r-2 border-dashed border-slate-300/80 pointer-events-none z-10">
                      <span className="absolute top-2 left-1 text-[9px] uppercase tracking-widest text-slate-400 font-mono rotate-90 origin-top-left">
                        ✂️ Fold Here
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch relative z-10">
                    
                    {/* LEFT PANEL: Inside Greeting / Sentimental Message */}
                    <div className="flex flex-col justify-between p-4 rounded-xl bg-white/70 backdrop-blur-xs border border-white/80 shadow-2xs">
                      <div>
                        {/* Header badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500 flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-rose-500" />
                            <span>HeartCraft Letter</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-serif italic">
                            For: {card.recipientName || 'You'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className={`text-xl font-bold ${currentTheme.accentText} leading-snug mb-3`}>
                          {cardHeadline}
                        </h3>

                        {/* Note */}
                        <p className={`text-xs text-slate-700 leading-relaxed ${getCardFontClass()} whitespace-pre-line mb-4`}>
                          {customCardNote}
                        </p>

                        {/* Embedded Memory Photo if enabled */}
                        {showPhoto && selectedPhoto && (
                          <div className="my-3 flex justify-center">
                            <div className="p-2 bg-white rounded-lg shadow-md border border-slate-200 rotate-[-1deg] max-w-[180px]">
                              <img
                                src={selectedPhoto.url}
                                alt="Memory"
                                className="w-full h-24 object-cover rounded-sm"
                              />
                              {selectedPhoto.caption && (
                                <p className="text-[10px] text-center font-handwriting text-slate-600 mt-1 truncate">
                                  {selectedPhoto.caption}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Sender Sign-off */}
                      <div className="pt-4 border-t border-slate-200/60 mt-auto">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Forever Handcrafted With Love By
                        </div>
                        <div className={`text-base font-bold text-slate-800 ${getCardFontClass()}`}>
                          {card.senderName || 'Your Love'} 💖
                        </div>
                      </div>
                    </div>

                    {/* RIGHT PANEL: The Scannable QR Code Portal */}
                    <div className="flex flex-col items-center justify-between text-center p-4 rounded-xl bg-white/70 backdrop-blur-xs border border-white/80 shadow-2xs">
                      
                      <div className="w-full">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 mb-2">
                          <Sparkles className="w-3 h-3 text-rose-500" />
                          <span>Scan To Reveal Surprise</span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          Open With Your Phone Camera
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 max-w-[220px] mx-auto">
                          Point your iPhone or Android camera at the QR code to open your interactive experience
                        </p>
                      </div>

                      {/* Scannable QR Code Box */}
                      <div className="my-3 p-3 rounded-2xl bg-white border-2 border-rose-200 shadow-sm relative group">
                        {generatingQr ? (
                          <div className="w-44 h-44 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
                          </div>
                        ) : qrDataUrl ? (
                          <div className="relative">
                            <img
                              src={qrDataUrl}
                              alt="Scan to open HeartCraft Card"
                              className="w-44 h-44 object-contain rounded-lg"
                            />
                            {/* Decorative Center Heart Stamp (with error correction 'H', QR remains 100% scannable) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-9 h-9 rounded-full bg-white shadow-md border border-rose-200 flex items-center justify-center">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-44 h-44 flex items-center justify-center text-xs text-rose-500">
                            Failed to generate QR
                          </div>
                        )}

                        <span className="block text-[9px] text-slate-400 font-mono mt-1">
                          HeartCraft Scannable Portal
                        </span>
                      </div>

                      {/* Secret Passcode Badge */}
                      {showPasscode && card.secretPassword && (
                        <div className="w-full p-2 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-center justify-center gap-2 text-xs">
                          <Key className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-semibold text-[11px]">
                            Secret Passcode: <span className="font-mono font-bold tracking-widest text-sm bg-white px-2 py-0.5 rounded border border-amber-300">{card.secretPassword}</span>
                          </span>
                        </div>
                      )}

                      {/* Audio instruction reminder */}
                      <div className="text-[9px] text-slate-400 font-medium mt-2">
                        💡 Tip: Turn phone sound ON for background music 🎵
                      </div>
                    </div>

                  </div>

                  {/* Back Watermark */}
                  <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Designed with HeartCraft • 100% Free Forever</span>
                    <span>heartcraft.app</span>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  LAYOUT 2: MINI GIFT TAG / POLAROID INSERT (3.5" x 5")
                  ------------------------------------------------------------- */}
              {layout === 'mini-gift-tag' && (
                <div className={`w-80 rounded-2xl border-2 ${currentTheme.border} ${currentTheme.cardBg} p-6 shadow-lg relative flex flex-col items-center text-center transition-all`}>
                  
                  {/* Punch Hole for ribbon tag */}
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white mb-2 shadow-inner" />

                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mb-1">
                    Special Delivery 💖
                  </span>

                  <h3 className={`text-base font-bold ${currentTheme.accentText} leading-snug mb-1`}>
                    {cardHeadline}
                  </h3>

                  <p className="text-[10px] text-slate-600 max-w-[240px] mb-3">
                    Scan with your camera to open an interactive experience made for you:
                  </p>

                  {/* Scannable QR Code */}
                  <div className="p-2.5 rounded-xl bg-white border border-rose-200 shadow-sm relative mb-3">
                    {qrDataUrl ? (
                      <div className="relative">
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          className="w-40 h-40 object-contain rounded-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-7 h-7 rounded-full bg-white shadow-xs border border-rose-200 flex items-center justify-center">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center text-xs text-rose-500">
                        Generating QR...
                      </div>
                    )}
                  </div>

                  {/* Passcode */}
                  {showPasscode && card.secretPassword && (
                    <div className="w-full py-1.5 px-3 rounded-lg bg-white/90 border border-slate-200 text-slate-800 text-[11px] mb-3 font-semibold">
                      Passcode: <span className="font-mono font-bold tracking-widest text-rose-600">{card.secretPassword}</span>
                    </div>
                  )}

                  {/* Sign-off */}
                  <div className="text-[11px] text-slate-600 font-medium border-t border-slate-200/60 pt-2 w-full">
                    With all my love, <span className="font-bold text-slate-800">{card.senderName || 'Your Love'}</span>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  LAYOUT 3: POSTCARD KEEPSAKE (Horizontal Flat Card)
                  ------------------------------------------------------------- */}
              {layout === 'postcard' && (
                <div className={`w-full max-w-2xl rounded-2xl border-2 ${currentTheme.border} ${currentTheme.cardBg} p-6 sm:p-8 shadow-lg relative transition-all`}>
                  
                  {/* Postcard Stamp at top right */}
                  <div className="absolute top-5 right-5 w-14 h-16 border-2 border-dashed border-rose-400 bg-white p-1 rounded flex flex-col items-center justify-center text-center shadow-2xs rotate-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span className="text-[8px] font-bold text-rose-600 uppercase mt-0.5">Air Mail</span>
                    <span className="text-[7px] text-slate-400">Postage Paid</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    
                    {/* Left side: Postcard Note & Photo */}
                    <div className="sm:col-span-7 pr-4 sm:border-r sm:border-slate-300/80">
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                        Postcard From The Heart
                      </div>

                      <h3 className={`text-base font-bold text-slate-900 mb-2 leading-snug`}>
                        {cardHeadline}
                      </h3>

                      <p className={`text-xs text-slate-700 leading-relaxed ${getCardFontClass()} mb-4`}>
                        {customCardNote}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-200 text-xs">
                        <span className="text-slate-400 text-[10px] block uppercase">Sent to:</span>
                        <span className="font-bold text-slate-800 text-sm">{card.recipientName || 'My Love'}</span>
                      </div>
                    </div>

                    {/* Right side: QR Code Portal */}
                    <div className="sm:col-span-5 flex flex-col items-center text-center">
                      <div className="p-2 rounded-xl bg-white border border-rose-200 shadow-sm relative mb-2">
                        {qrDataUrl && (
                          <img
                            src={qrDataUrl}
                            alt="QR Code"
                            className="w-36 h-36 object-contain rounded-md"
                          />
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-slate-800 block">
                        Scan with Phone Camera
                      </span>

                      {showPasscode && card.secretPassword && (
                        <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-mono font-bold mt-1.5">
                          PIN: {card.secretPassword}
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="mt-6 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[9px] text-slate-400">
                    <span>HeartCraft Physical Keepsake</span>
                    <span>Crafted for {card.recipientName || 'You'} by {card.senderName || 'Sender'}</span>
                  </div>
                </div>
              )}

            </div>

            {/* Printing Tips Callout */}
            <div className="no-print w-full mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Pro Printing Tip: </span>
                In your print settings dialog, choose <span className="font-mono font-bold text-slate-800">"Background graphics" = ON</span> and paper size <span className="font-mono font-bold text-slate-800">A4 or US Letter</span>. For the ultimate luxury gift, print on cardstock paper (200-300 gsm)!
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
