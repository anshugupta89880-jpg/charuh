import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CardPhoto } from '../../types/card';

interface LightboxModalProps {
  photos: CardPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex
}) => {
  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % photos.length);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-50"
        aria-label="Close photo view"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {photos.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-50"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {photos.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-50"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Photo Frame in Center */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full max-h-[85vh] flex flex-col items-center bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
      >
        <div className="relative w-full max-h-[60vh] rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || 'Memory photo'}
            className="w-full h-full object-contain max-h-[60vh]"
            referrerPolicy="no-referrer"
          />
        </div>

        {currentPhoto.caption && (
          <div className="mt-4 text-center">
            <p className="text-base sm:text-lg font-handwriting text-slate-800 leading-snug">
              {currentPhoto.caption}
            </p>
          </div>
        )}

        <div className="mt-2 text-xs text-slate-400">
          Photo {currentIndex + 1} of {photos.length}
        </div>
      </div>
    </div>
  );
};
