import React, { useState } from 'react';
import { Upload, Plus, Trash2, Image as ImageIcon, Sparkles, Key, Gift, Layers } from 'lucide-react';
import { CardPhoto, HeartCraftCard, StoryCard, LoveBribe } from '../../types/card';

interface Step3PhotosProps {
  card: HeartCraftCard;
  onChange: (updates: Partial<HeartCraftCard>) => void;
}

export const Step3Photos: React.FC<Step3PhotosProps> = ({ card, onChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<'sweet-moments' | 'heal-frames' | 'story-memes' | 'bribes' | 'final-polaroid' | 'intro-photo'>('sweet-moments');

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
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // --- 1. Sweet Moments Photos ---
  const handleAddSweetPhoto = () => {
    handleGenericUpload((url) => {
      const newPhoto: CardPhoto = {
        id: `sweet-${Date.now()}`,
        url,
        caption: 'Please forgive me 💖'
      };
      const updated = [...(card.sweetMomentsPhotos || []), newPhoto];
      onChange({ sweetMomentsPhotos: updated, photos: updated });
    });
  };

  const handleUpdateSweetCaption = (id: string, caption: string) => {
    const updated = (card.sweetMomentsPhotos || []).map((p) => (p.id === id ? { ...p, caption } : p));
    onChange({ sweetMomentsPhotos: updated, photos: updated });
  };

  const handleDeleteSweetPhoto = (id: string) => {
    const updated = (card.sweetMomentsPhotos || []).filter((p) => p.id !== id);
    onChange({ sweetMomentsPhotos: updated, photos: updated });
  };

  // --- 2. Heal My Heart 3 Frames ---
  const handleUpdateHealFrame = (index: number, url: string) => {
    const list = [...(card.healHeartPhotos || [])];
    if (list[index]) {
      list[index] = { ...list[index], url };
    } else {
      list[index] = { id: `heal-${index}`, url, caption: `Moment ${index + 1}` };
    }
    onChange({ healHeartPhotos: list });
  };

  // --- 3. Story Memes Deck ---
  const handleUpdateStoryCard = (index: number, updates: Partial<StoryCard>) => {
    const list = [...(card.storyCards || [])];
    if (list[index]) {
      list[index] = { ...list[index], ...updates };
      onChange({ storyCards: list });
    }
  };

  // --- 4. Apology Bribes ---
  const handleUpdateBribe = (index: number, updates: Partial<LoveBribe>) => {
    const list = [...(card.bribes || [])];
    if (list[index]) {
      list[index] = { ...list[index], ...updates };
      onChange({ bribes: list });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">3. Photos, Memes & Bribes Customization</h3>
        <p className="text-xs text-slate-500 mt-1">
          Every photo, caption, meme card, and apology bribe in the video is 100% editable here for free!
        </p>
      </div>

      {/* Sub Tabs for 6 Media Sections */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('sweet-moments')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'sweet-moments'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Sweet Moments ({card.sweetMomentsPhotos?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('heal-frames')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'heal-frames'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>3 Locked Frames</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('story-memes')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'story-memes'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Story Memes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('bribes')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'bribes'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Apology Bribes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('final-polaroid')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'final-polaroid'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Final Polaroid</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('intro-photo')}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSubTab === 'intro-photo'
              ? 'bg-white text-rose-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Intro Photo</span>
        </button>
      </div>

      {/* =========================================================
          SUB-TAB 1: SWEET MOMENTS PHOTO STACK (Screen 4 in Video)
          ========================================================= */}
      {activeSubTab === 'sweet-moments' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">
                "Some Sweet Moments" Photo Stack (Screen 4 in Video)
              </div>
              <div className="text-[11px] text-slate-500">
                Upload your couple/personal photos with sweet captions
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSweetPhoto}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-2xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="space-y-3">
            {(card.sweetMomentsPhotos || []).map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="p-3 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Polaroid Caption #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => handleUpdateSweetCaption(photo.id, e.target.value)}
                    placeholder="e.g., I'm sorry 🥺, Please forgive me 💖"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 font-script text-base text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <label className="cursor-pointer p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              const updated = (card.sweetMomentsPhotos || []).map((p) =>
                                p.id === photo.id ? { ...p, url: ev.target!.result as string } : p
                              );
                              onChange({ sweetMomentsPhotos: updated, photos: updated });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteSweetPhoto(photo.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 2: HEAL MY HEART 3 LOCKED FRAMES (Screen 7 in Video)
          ========================================================= */}
      {activeSubTab === 'heal-frames' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <div className="text-xs font-bold text-slate-800">
              "Now Please Heal My heart" (3 Locked Photo Frames)
            </div>
            <div className="text-[11px] text-slate-500">
              In Screen 7 of the video, these 3 photos start locked with a heart padlock, and the recipient unlocks them one-by-one with keys!
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[0, 1, 2].map((idx) => {
              const photo = card.healHeartPhotos?.[idx];
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs flex flex-col items-center text-center"
                >
                  <span className="text-[11px] font-bold text-rose-600 mb-2">
                    🔑 Key Unlock Photo #{idx + 1}
                  </span>

                  <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                    {photo?.url ? (
                      <img
                        src={photo.url}
                        alt={`Heal frame ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer w-full py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold text-center border border-rose-200 transition-colors">
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              handleUpdateHealFrame(idx, ev.target!.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: STORY MEMES DECK (Screen 3 in Video)
          ========================================================= */}
      {activeSubTab === 'story-memes' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <div className="text-xs font-bold text-slate-800">
              Story Memes & Apology Expressions (Screen 3 in Video)
            </div>
            <div className="text-[11px] text-slate-500">
              Customize the 3 sequential cards shown in the video (pouting baby, crying meme, and cute chibi hug)
            </div>
          </div>

          <div className="space-y-3">
            {(card.storyCards || []).map((cardItem, idx) => (
              <div
                key={cardItem.id || idx}
                className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img
                    src={cardItem.imageUrl}
                    alt={cardItem.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <input
                    type="text"
                    value={cardItem.title}
                    onChange={(e) => handleUpdateStoryCard(idx, { title: e.target.value })}
                    placeholder="Card title..."
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  <input
                    type="text"
                    value={cardItem.subtitle}
                    onChange={(e) => handleUpdateStoryCard(idx, { subtitle: e.target.value })}
                    placeholder="Card subtitle..."
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 text-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <label className="cursor-pointer p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs shrink-0" title="Upload custom meme/photo">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            handleUpdateStoryCard(idx, { imageUrl: ev.target!.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 4: APOLOGY BRIBES (Screen 8 in Video)
          ========================================================= */}
      {activeSubTab === 'bribes' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <div className="text-xs font-bold text-slate-800">
              "Please accept my apology bribes ;)" (Screen 8 in Video)
            </div>
            <div className="text-[11px] text-slate-500">
              Customize the 3 love bribe passes (Fresh Bloom, Cuddle Pass, Sweet Treat)
            </div>
          </div>

          <div className="space-y-3">
            {(card.bribes || []).map((bribe, idx) => (
              <div
                key={bribe.id || idx}
                className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
                  {bribe.imageUrl ? (
                    <img
                      src={bribe.imageUrl}
                      alt={bribe.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-2xl">{bribe.emoji}</span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bribe.title}
                      onChange={(e) => handleUpdateBribe(idx, { title: e.target.value })}
                      placeholder="Bribe title..."
                      className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <input
                      type="text"
                      value={bribe.emoji}
                      onChange={(e) => handleUpdateBribe(idx, { emoji: e.target.value })}
                      placeholder="💐"
                      className="w-10 px-1 py-1 text-xs text-center rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                  </div>

                  <input
                    type="text"
                    value={bribe.description}
                    onChange={(e) => handleUpdateBribe(idx, { description: e.target.value })}
                    placeholder="Bribe description..."
                    className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 text-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                </div>

                <label className="cursor-pointer p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs shrink-0" title="Upload custom bribe photo">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            handleUpdateBribe(idx, { imageUrl: ev.target!.result as string });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 5: FINAL POLAROID (Screen 9 in Video)
          ========================================================= */}
      {activeSubTab === 'final-polaroid' && (
        <div className="p-5 rounded-3xl bg-pink-50/70 border border-pink-200/90 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                Screen 9: Final Polaroid Photo & Memory
              </h4>
              <p className="text-[11px] text-slate-500">
                The climax memory photo revealed at the end with washi tape and glowing golden heart.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleGenericUpload((url) => onChange({ finalPolaroidUrl: url }))}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Polaroid Photo</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white border border-pink-100">
            <div className="relative w-40 h-40 bg-white rounded-xl p-2 pb-5 polaroid-shadow border border-slate-200 shrink-0">
              <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden">
                {card.finalPolaroidUrl ? (
                  <img src={card.finalPolaroidUrl} alt="Final Polaroid" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
                )}
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Paste Direct Image Link (URL):
                </label>
                <input
                  type="url"
                  value={card.finalPolaroidUrl || ''}
                  onChange={(e) => onChange({ finalPolaroidUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Final Title:
                </label>
                <input
                  type="text"
                  value={card.finalPolaroidCaption || 'New Beginnings Ahead'}
                  onChange={(e) => onChange({ finalPolaroidCaption: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 6: INTRO PHOTO (Screen 2 in Video)
          ========================================================= */}
      {activeSubTab === 'intro-photo' && (
        <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/90 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Screen 2: Opening Photo / Meme
              </h4>
              <p className="text-[11px] text-slate-500">
                The image shown on the swipe-to-fix screen (cute puppy, couple picture, or custom meme).
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleGenericUpload((url) => onChange({ introPhotoUrl: url }))}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Intro Photo</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white border border-amber-100">
            <div className="w-40 h-40 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
              {card.introPhotoUrl ? (
                <img src={card.introPhotoUrl} alt="Intro Photo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No image</div>
              )}
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Paste Direct Image Link (URL):
                </label>
                <input
                  type="url"
                  value={card.introPhotoUrl || ''}
                  onChange={(e) => onChange({ introPhotoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
