import React, { useState } from 'react';
import { Music, Play, Pause, Repeat, CheckCircle2, AlertCircle, Sparkles, Video, Eye, ShieldCheck } from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { extractYouTubeVideoId, formatSecondsToTime, CURATED_MUSIC_PRESETS } from '../../utils/youtube';
import { VideoMessageModal } from '../common/VideoMessageModal';

interface Step4AudioProps {
  card: HeartCraftCard;
  onChange: (updates: Partial<HeartCraftCard>) => void;
}

export const Step4Audio: React.FC<Step4AudioProps> = ({ card, onChange }) => {
  const [testingAudio, setTestingAudio] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoId = extractYouTubeVideoId(card.youtubeUrl);
  const isValidVideo = Boolean(videoId);

  const videoMessageId = extractYouTubeVideoId(card.videoMessageUrl || '');
  const isValidVideoMessage = Boolean(videoMessageId || (card.videoMessageUrl && card.videoMessageUrl.startsWith('http')));

  const handleApplyPreset = (preset: typeof CURATED_MUSIC_PRESETS[0]) => {
    onChange({
      youtubeUrl: preset.youtubeUrl,
      youtubeOffsetSeconds: preset.suggestedOffset
    });
  };

  const toggleTestAudio = () => {
    setTestingAudio(!testingAudio);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800">4. Background Music & Personal Video Message</h3>
          <p className="text-xs text-slate-500 mt-1">
            Add any YouTube song for background music AND attach an optional personal video message. Everything is 100% free!
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Free Forever</span>
        </div>
      </div>

      {/* Preset Music Selector */}
      <div className="p-3.5 rounded-2xl bg-pink-50/60 border border-pink-200/70">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Romantic & Emotional Presets (1-Click Setup):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CURATED_MUSIC_PRESETS.map((p) => {
            const isCurrent = card.youtubeUrl === p.youtubeUrl;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-rose-400 bg-white ring-1 ring-rose-400 shadow-2xs'
                    : 'border-pink-200/60 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-slate-800 truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {p.artist} · Starts @ {formatSecondsToTime(p.suggestedOffset)}
                  </div>
                </div>
                {isCurrent && <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* YouTube URL input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          YouTube Song / Video URL *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
            <Music className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={card.youtubeUrl}
            onChange={(e) => onChange({ youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-white text-slate-800 text-sm shadow-sm transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {isValidVideo ? (
              <span title="Valid YouTube Video">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </span>
            ) : card.youtubeUrl ? (
              <span title="Invalid YouTube URL format">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </span>
            ) : null}
          </div>
        </div>
        {isValidVideo && (
          <p className="mt-1.5 text-[11px] text-emerald-600 font-medium">
            Ready to play video ID: {videoId}
          </p>
        )}
      </div>

      {/* Start Time / Offset Slider */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-800">Start Time Offset</div>
            <div className="text-[11px] text-slate-500">
              Start playing from a specific moment (e.g., skip intro directly to the chorus)
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 font-mono font-bold text-sm border border-rose-200">
            {formatSecondsToTime(card.youtubeOffsetSeconds)} ({card.youtubeOffsetSeconds}s)
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="240"
          step="1"
          value={card.youtubeOffsetSeconds}
          onChange={(e) => onChange({ youtubeOffsetSeconds: Number(e.target.value) })}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />

        {/* Quick jump presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-[10px] text-slate-400 mr-1 flex items-center">Quick jumps:</span>
          {[0, 15, 30, 45, 60, 90].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onChange({ youtubeOffsetSeconds: sec })}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                card.youtubeOffsetSeconds === sec
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Loop & Test Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Loop toggle */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-rose-500" />
            <div>
              <div className="text-xs font-semibold text-slate-800">Loop Soundtrack</div>
              <div className="text-[10px] text-slate-400">Replays seamlessly when finished</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={card.youtubeLoop}
              onChange={(e) => onChange({ youtubeLoop: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {/* Live Test Button */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs font-semibold text-slate-800">Preview Segment</div>
            <div className="text-[10px] text-slate-400">Listen from {card.youtubeOffsetSeconds}s</div>
          </div>
          <button
            type="button"
            disabled={!isValidVideo}
            onClick={toggleTestAudio}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              testingAudio
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-40'
            }`}
          >
            {testingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{testingAudio ? 'Stop' : 'Test Audio'}</span>
          </button>
        </div>
      </div>

      {/* Embedded hidden tester iframe when testing */}
      {testingAudio && videoId && (
        <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Now testing: Audio playing from <strong>{formatSecondsToTime(card.youtubeOffsetSeconds)}</strong>
            </span>
          </div>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&start=${card.youtubeOffsetSeconds}&controls=0`}
            title="Audio Preview"
            className="w-1 h-1 opacity-0 pointer-events-none"
            allow="autoplay"
          />
        </div>
      )}

      {/* ========================================================
          PERSONAL VIDEO MESSAGE SECTION (100% Free)
          ======================================================== */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/70 via-pink-50/50 to-white border border-rose-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>Personal Video Message Greeting</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                  Optional
                </span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Want to speak your heart out on video? Paste a YouTube video or Shorts link here.
              </p>
            </div>
          </div>

          {isValidVideoMessage && (
            <button
              type="button"
              onClick={() => setShowVideoModal(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Video</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Video Greeting Title
            </label>
            <input
              type="text"
              value={card.videoMessageTitle || 'A Special Video Message For You 🎥💕'}
              onChange={(e) => onChange({ videoMessageTitle: e.target.value })}
              placeholder="e.g., A Special Video Message For You 🎥💕"
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              YouTube Video or Shorts Link (or direct video URL)
            </label>
            <div className="relative">
              <input
                type="url"
                value={card.videoMessageUrl || ''}
                onChange={(e) => onChange({ videoMessageUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-rose-200 bg-white text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                {isValidVideoMessage ? (
                  <span title="Valid Video Link">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </span>
                ) : card.videoMessageUrl ? (
                  <span title="Check Video Link Format">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </span>
                ) : null}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              ✨ When added, an interactive "Watch Video Greeting" button is displayed on the reveal page and story for your recipient!
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal Preview */}
      {card.videoMessageUrl && (
        <VideoMessageModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoUrl={card.videoMessageUrl}
          title={card.videoMessageTitle || 'A Special Video Message For You 🎥💕'}
          recipientName={card.recipientName}
          senderName={card.senderName}
        />
      )}
    </div>
  );
};
