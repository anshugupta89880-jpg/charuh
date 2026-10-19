import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music2 } from 'lucide-react';
import { extractYouTubeVideoId } from '../../utils/youtube';

interface YouTubePlayerProps {
  youtubeUrl: string;
  startOffset: number;
  loop: boolean;
  isPlaying: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  title?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  youtubeUrl,
  startOffset = 0,
  loop = true,
  isPlaying,
  onPlayStateChange,
  title = 'Soundtrack'
}) => {
  const videoId = extractYouTubeVideoId(youtubeUrl);
  const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [hasStartedByUser, setHasStartedByUser] = useState(false);

  // Initialize YT API
  useEffect(() => {
    if (!videoId) return;

    let isMounted = true;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      const elem = document.getElementById(containerId.current);
      if (!elem) return;

      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(containerId.current, {
          height: '100',
          width: '100',
          videoId: videoId,
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            start: startOffset,
            loop: loop ? 1 : 0,
            playlist: loop ? videoId : undefined,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              setIsReady(true);
              event.target.setVolume(volume);
              if (isPlaying) {
                event.target.seekTo(startOffset, true);
                event.target.playVideo();
                setInternalPlaying(true);
                setHasStartedByUser(true);
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
              if (event.data === 1) {
                setInternalPlaying(true);
                onPlayStateChange?.(true);
              } else if (event.data === 2 || event.data === 0) {
                setInternalPlaying(false);
                onPlayStateChange?.(false);
                if (event.data === 0 && loop) {
                  event.target.seekTo(startOffset, true);
                  event.target.playVideo();
                }
              }
            }
          }
        });
      } catch (err) {
        console.warn('YT player initialization error:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (isMounted) createPlayer();
      };
    }

    return () => {
      isMounted = false;
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [videoId, startOffset, loop]);

  // Sync isPlaying prop
  useEffect(() => {
    if (!playerRef.current || !isReady) return;
    try {
      if (isPlaying) {
        playerRef.current.seekTo(startOffset, true);
        playerRef.current.playVideo();
        setHasStartedByUser(true);
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {
      // player may still be priming
    }
  }, [isPlaying, isReady, startOffset]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (internalPlaying) {
        playerRef.current.pauseVideo();
      } else {
        if (!hasStartedByUser) {
          playerRef.current.seekTo(startOffset, true);
        }
        playerRef.current.playVideo();
        setHasStartedByUser(true);
      }
    } catch {
      // fallback
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {
      // fallback
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (!playerRef.current) return;
    try {
      playerRef.current.setVolume(newVol);
      if (isMuted && newVol > 0) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    } catch {
      // fallback
    }
  };

  if (!videoId) return null;

  return (
    <>
      {/* Hidden YouTube container */}
      <div className="fixed -top-[9999px] -left-[9999px] pointer-events-none opacity-0 overflow-hidden w-1 h-1">
        <div id={containerId.current} />
      </div>

      {/* Floating Audio Controller Badge */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md shadow-lg border border-pink-200/60 dark:border-pink-900/40 text-slate-700 dark:text-slate-200 transition-all hover:shadow-xl">
        {/* Animated Sound Wave Bars when playing */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center transition-transform active:scale-95 shadow-sm"
          title={internalPlaying ? 'Pause Music' : 'Play Music'}
          aria-label={internalPlaying ? 'Pause Music' : 'Play Music'}
        >
          {internalPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex flex-col max-w-[120px] sm:max-w-[160px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
            <Music2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="truncate">{title}</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {internalPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>

        {/* Sound wave visualizer bars */}
        <div className="hidden sm:flex items-end gap-0.5 h-4 px-1" aria-hidden="true">
          <span
            className={`w-0.5 bg-pink-500 rounded-full transition-all duration-300 ${
              internalPlaying ? 'h-3 animate-pulse' : 'h-1'
            }`}
          />
          <span
            className={`w-0.5 bg-pink-500 rounded-full transition-all duration-200 ${
              internalPlaying ? 'h-4 animate-bounce' : 'h-1.5'
            }`}
          />
          <span
            className={`w-0.5 bg-pink-500 rounded-full transition-all duration-300 ${
              internalPlaying ? 'h-2.5 animate-pulse' : 'h-1'
            }`}
          />
        </div>

        <button
          onClick={toggleMute}
          className="p-1 rounded-full text-slate-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-14 sm:w-16 h-1 bg-pink-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
          aria-label="Volume slider"
        />
      </div>
    </>
  );
};
