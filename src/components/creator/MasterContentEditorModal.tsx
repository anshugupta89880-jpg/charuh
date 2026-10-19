import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Save, 
  Check, 
  Upload, 
  Trash2, 
  Plus, 
  Heart, 
  Layers,
  Lock,
  Gift
} from 'lucide-react';
import { HeartCraftCard, TypographyStyle, CardPhoto, StoryCard, LoveBribe } from '../../types/card';
import { CURATED_MUSIC_PRESETS } from '../../utils/youtube';

interface MasterContentEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: HeartCraftCard;
  onChange: (updates: Partial<HeartCraftCard>) => void;
}

export const MasterContentEditorModal: React.FC<MasterContentEditorModalProps> = ({
  isOpen,
  onClose,
  card,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'texts' | 'photos' | 'video-audio' | 'fonts'>('texts');
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleNotifySave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const typographyOptions: { id: TypographyStyle; name: string; preview: string; fontClass: string }[] = [
    {
      id: 'serif',
      name: 'Editorial Luxury Serif',
      preview: 'Thank You for Being so Kind',
      fontClass: 'font-serif-luxury text-sm font-semibold'
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
      preview: 'Written directly from the heart',
      fontClass: 'font-handwriting text-lg text-rose-600'
    },
    {
      id: 'calligraphy',
      name: 'Royal Calligraphy',
      preview: 'My one and only',
      fontClass: 'font-calligraphy text-xl text-rose-600'
    },
    {
      id: 'playful',
      name: 'Playful Cursive',
      preview: 'Sweet & Cheerful',
      fontClass: 'font-playful text-sm text-pink-600'
    },
    {
      id: 'typewriter',
      name: 'Vintage Typewriter',
      preview: 'Dear Babyy, with love...',
      fontClass: 'font-typewriter text-xs font-semibold'
    },
    {
      id: 'sans',
      name: 'Modern Clean Sans',
      preview: 'Minimal & Elegant',
      fontClass: 'font-sans-modern text-xs font-semibold'
    }
  ];

  // Helper: File upload
  const handleGenericUpload = (callback: (dataUrl: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
          handleNotifySave();
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Master Content Editor</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  100% Free
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Instantly edit every single text, photo, video message, and font in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedNotification && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fadeIn">
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'texts'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>All Texts & Messages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'photos'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>All Photos & Memes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video-audio')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'video-audio'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Message & Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fonts')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'fonts'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fonts & Styling</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* ========================================================
              TAB 1: ALL TEXTS & MESSAGES
             ======================================================== */}
          {activeTab === 'texts' && (
            <div className="space-y-6">
              
              {/* Names */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Names & Occasion Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Recipient Name / Pet Name
                    </label>
                    <input
                      type="text"
                      value={card.recipientName}
                      onChange={(e) => {
                        onChange({ recipientName: e.target.value });
                        handleNotifySave();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Sender Name
                    </label>
                    <input
                      type="text"
                      value={card.senderName}
                      onChange={(e) => {
                        onChange({ senderName: e.target.value });
                        handleNotifySave();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Passcode & Hint */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Screen 1: Passcode & Secret Hint</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      4-Digit Passcode (Leave empty for no passcode)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={card.secretPassword}
                      onChange={(e) => {
                        onChange({ secretPassword: e.target.value });
                        handleNotifySave();
                      }}
                      placeholder="e.g. 1204"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Password Hint for Recipient
                    </label>
                    <input
                      type="text"
                      value={card.passwordHint}
                      onChange={(e) => {
                        onChange({ passwordHint: e.target.value });
                        handleNotifySave();
                      }}
                      placeholder="e.g. Our special date 💖"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Screen 2: Intro Hook */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 space-y-3">
                <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Screen 2: Intro Opening Texts</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Hook Title
                    </label>
                    <input
                      type="text"
                      value={card.hookTitle}
                      onChange={(e) => {
                        onChange({ hookTitle: e.target.value });
                        handleNotifySave();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Intro Subtitle / Expression
                    </label>
                    <textarea
                      rows={2}
                      value={card.introSubtitle || ''}
                      onChange={(e) => {
                        onChange({ introSubtitle: e.target.value });
                        handleNotifySave();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Swipe Button Prompt Text
                    </label>
                    <input
                      type="text"
                      value={card.swipePromptText}
                      onChange={(e) => {
                        onChange({ swipePromptText: e.target.value });
                        handleNotifySave();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Screen 5: Hold to Forgive */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Screen 5: Heart Action Button Text
                </h4>
                <div>
                  <input
                    type="text"
                    value={card.holdHeartText}
                    onChange={(e) => {
                      onChange({ holdHeartText: e.target.value });
                      handleNotifySave();
                    }}
                    placeholder="Hold to Forgive!"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Screen 6: Typewriter Love Letter */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Screen 6: Typewriter Letter
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Letter Header Title
                  </label>
                  <input
                    type="text"
                    value={card.letterTitle || 'Thank You for Being so Kind'}
                    onChange={(e) => {
                      onChange({ letterTitle: e.target.value });
                      handleNotifySave();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 mb-3"
                  />
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Letter Content (Types out letter-by-letter with sound)
                  </label>
                  <textarea
                    rows={6}
                    value={card.heartfeltNote}
                    onChange={(e) => {
                      onChange({ heartfeltNote: e.target.value });
                      handleNotifySave();
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-amber-200 bg-white text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Screen 7 & 8: Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                  <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                    Screen 7: Heal My Heart Title
                  </h4>
                  <input
                    type="text"
                    value={card.healHeartTitle || 'Now Please Heal My heart'}
                    onChange={(e) => {
                      onChange({ healHeartTitle: e.target.value });
                      handleNotifySave();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                  <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Screen 8: Apology Bribes Title
                  </h4>
                  <input
                    type="text"
                    value={card.bribesTitle || 'Please accept my apology bribes ;)'}
                    onChange={(e) => {
                      onChange({ bribesTitle: e.target.value });
                      handleNotifySave();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Screen 9: Final Reveal */}
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-3">
                <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                  Screen 9: Final Ending Reveal
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Final Ending Title (with glowing golden heart)
                  </label>
                  <input
                    type="text"
                    value={card.finalPolaroidCaption || 'New Beginnings Ahead'}
                    onChange={(e) => {
                      onChange({ finalPolaroidCaption: e.target.value });
                      handleNotifySave();
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500 mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Final Closing Love Note
                  </label>
                  <textarea
                    rows={3}
                    value={card.finalClosingNote || ''}
                    onChange={(e) => {
                      onChange({ finalClosingNote: e.target.value });
                      handleNotifySave();
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-pink-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 2: ALL PHOTOS & MEMES
             ======================================================== */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              
              {/* Intro Meme / Photo */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Screen 2: Opening Meme / Photo
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      The cute puppy/baby or custom couple photo shown on the swipe screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenericUpload((url) => onChange({ introPhotoUrl: url }))}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    {card.introPhotoUrl && (
                      <img src={card.introPhotoUrl} alt="Intro" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Or paste Image URL:</label>
                    <input
                      type="url"
                      value={card.introPhotoUrl || ''}
                      onChange={(e) => {
                        onChange({ introPhotoUrl: e.target.value });
                        handleNotifySave();
                      }}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Sweet Moments Photos */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Screen 4: "Some Sweet Moments" Photo Deck ({card.sweetMomentsPhotos?.length || 0} photos)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Polaroid cards that swipe one by one with heartfelt captions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleGenericUpload((url) => {
                        const newPhoto: CardPhoto = {
                          id: `sweet-${Date.now()}`,
                          url,
                          caption: 'I love you 💖'
                        };
                        const updated = [...(card.sweetMomentsPhotos || []), newPhoto];
                        onChange({ sweetMomentsPhotos: updated, photos: updated });
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(card.sweetMomentsPhotos || []).map((photo, idx) => (
                    <div key={photo.id || idx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="relative w-full aspect-square rounded-lg bg-slate-100 overflow-hidden">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = card.sweetMomentsPhotos.filter((_, i) => i !== idx);
                            onChange({ sweetMomentsPhotos: updated, photos: updated });
                            handleNotifySave();
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => {
                          const updated = [...card.sweetMomentsPhotos];
                          updated[idx] = { ...updated[idx], caption: e.target.value };
                          onChange({ sweetMomentsPhotos: updated, photos: updated });
                          handleNotifySave();
                        }}
                        placeholder="Caption..."
                        className="w-full px-2 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Heal My Heart 3 Frames */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
                <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Screen 7: Heal My Heart 3 Locked Frames
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => {
                    const photo = card.healHeartPhotos?.[idx];
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-sky-200 space-y-2">
                        <div className="text-[10px] font-bold text-sky-700">Key #{idx + 1} Frame</div>
                        <div className="relative w-full aspect-square rounded-lg bg-slate-100 overflow-hidden">
                          {photo?.url ? (
                            <img src={photo.url} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleGenericUpload((url) => {
                              const list = [...(card.healHeartPhotos || [])];
                              list[idx] = { id: `heal-${idx}`, url, caption: photo?.caption || `Memory ${idx + 1}` };
                              onChange({ healHeartPhotos: list });
                            });
                          }}
                          className="w-full py-1 text-[11px] rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold"
                        >
                          Change Photo
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Final Polaroid Photo */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                      Screen 9: Final Polaroid Photo
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      The centerpiece memory shown on the final screen with washi tape.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenericUpload((url) => onChange({ finalPolaroidUrl: url }))}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Final Photo</span>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white polaroid-shadow p-1.5 shrink-0 border border-slate-200">
                    {card.finalPolaroidUrl && (
                      <img src={card.finalPolaroidUrl} alt="Final" className="w-full h-full object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Image URL:</label>
                    <input
                      type="url"
                      value={card.finalPolaroidUrl || ''}
                      onChange={(e) => {
                        onChange({ finalPolaroidUrl: e.target.value });
                        handleNotifySave();
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 3: VIDEO MESSAGE & AUDIO SETUP
             ======================================================== */}
          {activeTab === 'video-audio' && (
            <div className="space-y-6">
              
              {/* Personal Video Message */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-50 to-amber-50 border border-rose-300 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Personal Video Greeting Message (100% Free)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Add a personal video message (YouTube video, YouTube Short, or video clip) for your recipient to watch!
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Video Message Title
                    </label>
                    <input
                      type="text"
                      value={card.videoMessageTitle || 'A Special Video Message For You 🎥💕'}
                      onChange={(e) => {
                        onChange({ videoMessageTitle: e.target.value });
                        handleNotifySave();
                      }}
                      placeholder="e.g. A Special Video Message For You 🎥💕"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      YouTube Video / Shorts Link or Video URL
                    </label>
                    <input
                      type="url"
                      value={card.videoMessageUrl || ''}
                      onChange={(e) => {
                        onChange({ videoMessageUrl: e.target.value });
                        handleNotifySave();
                      }}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      💡 Tip: Paste any YouTube video link or Shorts link. When provided, a glowing "Watch Video Message" button appears in the experience!
                    </p>
                  </div>
                </div>
              </div>

              {/* Background Music Setup */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Background Soundtrack (YouTube Music)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Plays smoothly in the background while the recipient explores the story.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    YouTube Song Link
                  </label>
                  <input
                    type="url"
                    value={card.youtubeUrl}
                    onChange={(e) => {
                      onChange({ youtubeUrl: e.target.value });
                      handleNotifySave();
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Start Time (Offset): {card.youtubeOffsetSeconds || 0} seconds
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={180}
                      step={1}
                      value={card.youtubeOffsetSeconds || 0}
                      onChange={(e) => {
                        onChange({ youtubeOffsetSeconds: Number(e.target.value) });
                        handleNotifySave();
                      }}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="master-loop"
                      checked={card.youtubeLoop ?? true}
                      onChange={(e) => {
                        onChange({ youtubeLoop: e.target.checked });
                        handleNotifySave();
                      }}
                      className="w-4 h-4 rounded text-rose-500 accent-rose-500"
                    />
                    <label htmlFor="master-loop" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Loop Song Continuously
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              TAB 4: FONTS & STYLING
             ======================================================== */}
          {activeTab === 'fonts' && (
            <div className="space-y-6">
              
              {/* Font Family Selector */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Typography Font Family
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {typographyOptions.map((opt) => {
                    const isSelected = card.typography === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          onChange({ typography: opt.id });
                          handleNotifySave();
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/70 shadow-sm ring-1 ring-rose-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                          <span>{opt.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-500" />}
                        </div>
                        <div className={`mt-2 ${opt.fontClass}`}>
                          {opt.preview}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Option */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Letter Font Size
                </h4>
                <div className="flex items-center gap-2">
                  {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        onChange({ fontSize: sz });
                        handleNotifySave();
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase transition-all ${
                        (card.fontSize || 'md') === sz
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Changes auto-save instantly to your card! ✨
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Done Editing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
