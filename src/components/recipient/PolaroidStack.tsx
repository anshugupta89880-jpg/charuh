import React, { useState } from 'react';
import { Layers, Maximize2, RotateCw, Sparkles, ArrowRight, Target } from 'lucide-react';
import { CardPhoto } from '../../types/card';
import { LightboxModal } from './LightboxModal';
import { ArrowHeartShooter } from '../common/ArrowHeartShooter';

interface PolaroidStackProps {
  photos: CardPhoto[];
  initialRevealed?: boolean;
}

export const PolaroidStack: React.FC<PolaroidStackProps> = ({ photos, initialRevealed = false }) => {
  const [photoList, setPhotoList] = useState<CardPhoto[]>(photos);
  const [isRevealed, setIsRevealed] = useState<boolean>(initialRevealed);
  const [isAnimatingBurst, setIsAnimatingBurst] = useState(false);
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');

  // Synchronize if prop changes
  React.useEffect(() => {
    setPhotoList(photos);
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  const handleHeartHit = () => {
    setIsAnimatingBurst(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsAnimatingBurst(false);
    }, 450);
  };

  const handleShuffle = () => {
    setPhotoList((prev) => {
      if (prev.length <= 1) return prev;
      const [top, ...rest] = prev;
      return [...rest, top];
    });
  };

  const handleBringToFront = (index: number) => {
    if (index === 0) return;
    setPhotoList((prev) => {
      const selected = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [selected, ...remaining];
    });
  };

  const toggleFlip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openLightbox = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full flex flex-col items-center my-6">
      {/* 1. STATE: Photos Locked Behind Heart Target -> Shoot Arrow to Reveal */}
      {!isRevealed ? (
        <div className="w-full max-w-md p-6 rounded-3xl glass-panel shadow-xl text-center flex flex-col items-center animate-fadeIn relative overflow-hidden border border-rose-200/80">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Interactive Photo Reveal</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-800 mt-2">
              Hit the Heart to Reveal Photos
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Pull back the golden bow and release Cupid's arrow to pierce the beating heart and unleash {photos.length} captured memories!
            </p>
          </div>

          {/* Cupid's Bow and Arrow Shooter */}
          <ArrowHeartShooter
            onHeartHit={handleHeartHit}
            compact={true}
            title=""
            subtitle=""
            buttonText="Shoot Arrow to Pierce Heart 🏹"
          />

          {/* Instant skip option */}
          <button
            onClick={() => setIsRevealed(true)}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
          >
            <span>Skip arrow game & reveal photos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* 2. STATE: Photos Revealed with Burst Transition & Replay Action */
        <div
          className={`w-full flex flex-col items-center transition-all duration-700 ${
            isAnimatingBurst ? 'scale-90 opacity-0' : 'scale-100 opacity-100 animate-fadeIn'
          }`}
        >
          {/* Controls Bar */}
          <div className="flex items-center justify-between w-full max-w-md px-3 mb-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Layers className="w-4 h-4 text-rose-500" />
              <span>{photos.length} Captured {photos.length === 1 ? 'Moment' : 'Moments'}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Re-shoot Arrow Button */}
              <button
                onClick={() => setIsRevealed(false)}
                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 shadow-2xs transition-all active:scale-95 flex items-center gap-1 font-semibold"
                title="Replay arrow shooting animation"
              >
                <Target className="w-3 h-3 text-rose-500" />
                <span>Re-Shoot Arrow</span>
              </button>

              {photos.length > 1 && viewMode === 'stack' && (
                <button
                  onClick={handleShuffle}
                  className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-rose-600 border border-rose-200/60 shadow-sm transition-all active:scale-95 flex items-center gap-1 font-medium"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Shuffle</span>
                </button>
              )}

              <button
                onClick={() => setViewMode(viewMode === 'stack' ? 'grid' : 'stack')}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-600 border border-slate-200/60 shadow-sm transition-all active:scale-95 font-medium"
              >
                {viewMode === 'stack' ? 'View Grid' : 'View Stack'}
              </button>
            </div>
          </div>

          {/* Mode A: Polaroid Interactive Stack */}
          {viewMode === 'stack' ? (
            <div className="relative w-72 sm:w-80 h-96 sm:h-[420px] flex items-center justify-center">
              {photoList.map((photo, index) => {
                const isTop = index === 0;
                const isFlipped = !!flippedIds[photo.id];
                const rot = photo.rotation || (index === 0 ? -2 : index === 1 ? 4 : -4);
                const translateY = index * 4;
                const scale = Math.max(0.85, 1 - index * 0.04);
                const zIndex = photoList.length - index;

                return (
                  <div
                    key={photo.id}
                    onClick={() => (isTop ? handleShuffle() : handleBringToFront(index))}
                    style={{
                      transform: `translateY(${translateY}px) rotate(${rot}deg) scale(${scale})`,
                      zIndex: zIndex,
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease'
                    }}
                    className={`absolute w-64 sm:w-72 bg-white rounded-xl p-3 pb-5 polaroid-shadow border border-slate-200/80 cursor-pointer select-none group transition-all ${
                      isTop ? 'hover:shadow-2xl hover:scale-[1.02]' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Washi tape decor on top */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-rose-200/70 border border-rose-300/40 rounded-sm rotate-1 shadow-xs pointer-events-none"
                      style={{ backdropFilter: 'blur(2px)' }}
                    />

                    {/* Flip Container */}
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200/50">
                      {!isFlipped ? (
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Memory photograph'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full p-4 bg-amber-50 flex flex-col justify-center items-center text-center">
                          <span className="text-xs uppercase tracking-widest text-amber-700/80 font-semibold mb-2">
                            Behind This Moment
                          </span>
                          <p className="text-sm font-handwriting text-slate-700 leading-relaxed">
                            {photo.caption || 'A timeless memory held in our hearts forever.'}
                          </p>
                        </div>
                      )}

                      {/* Top-right action icons */}
                      {isTop && (
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => toggleFlip(photo.id, e)}
                            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition-transform active:scale-90"
                            title="Flip polaroid"
                            aria-label="Flip polaroid"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => openLightbox(index, e)}
                            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md transition-transform active:scale-90"
                            title="Expand photo"
                            aria-label="Expand photo"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Handwritten Polaroid Caption */}
                    <div className="mt-3 px-1 text-center min-h-[38px] flex items-center justify-center">
                      <p className="text-base sm:text-lg font-handwriting text-slate-800 leading-tight line-clamp-2">
                        {photo.caption || 'Always & Forever'}
                      </p>
                    </div>

                    {isTop && (
                      <div className="text-center mt-1">
                        <span className="text-[10px] text-rose-500 font-sans tracking-wide">
                          (Tap photo to flip or cycle)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Mode B: Grid Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl w-full px-2">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={(e) => openLightbox(index, e)}
                  className="bg-white rounded-2xl p-3 pb-4 polaroid-shadow border border-slate-200/80 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Memory'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="mt-3 px-1 text-center">
                    <p className="text-base font-handwriting text-slate-800 line-clamp-2">
                      {photo.caption || 'Cherished moment'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={photos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
