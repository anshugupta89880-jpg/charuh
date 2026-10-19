import React from 'react';
import { X, Video, Heart, ExternalLink } from 'lucide-react';
import { extractYouTubeVideoId } from '../../utils/youtube';

interface VideoMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  recipientName?: string;
  senderName?: string;
}

export const VideoMessageModal: React.FC<VideoMessageModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = 'A Special Video Message For You 🎥💕',
  recipientName = 'You',
  senderName = 'Someone Special'
}) => {
  if (!isOpen || !videoUrl) return null;

  const youtubeId = extractYouTubeVideoId(videoUrl);
  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                {title}
              </h3>
              <p className="text-[10px] text-rose-300/80">
                From {senderName} to {recipientName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title="Personal Video Message"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : isDirectVideo ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs text-slate-300 mb-3">
                Unable to embed directly. Open link in a new window:
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Video Message</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] font-medium">Personal Video Greeting</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
};
