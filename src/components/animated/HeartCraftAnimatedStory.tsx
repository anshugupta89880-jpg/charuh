import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  RotateCcw, 
  Sparkles, 
  Heart, 
  Gift, 
  ArrowRight,
  Check,
  Lock,
  Key,
  Delete,
  Video
} from 'lucide-react';
import { HeartCraftCard } from '../../types/card';
import { playArrowShootSound, playHeartHitSound } from '../../utils/soundEffects';
import { VideoMessageModal } from '../common/VideoMessageModal';

interface HeartCraftAnimatedStoryProps {
  card: HeartCraftCard;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  onRestartExperience?: () => void;
  isEmbeddedMockup?: boolean;
  onSwitchToEditor?: () => void;
}

type StoryScene = 
  | 'passcode'        // Screen 1: 3D Heart Lock PIN Keypad
  | 'swipe-intro'     // Screen 2: Baby/Puppy with Swipe Right to Fix It
  | 'story-deck-1'    // Screen 3: Apology Memes Deck (I know I hurt you -> You mean everything)
  | 'story-deck-2'    // Screen 4: "Some Sweet Moments" Photo Deck
  | 'hold-heart'      // Screen 5: Hold to Forgive beating heart
  | 'typewriter-note' // Screen 6: Thank you for being so kind typewriter letter
  | 'locked-frames'   // Screen 7: "Now Please Heal My heart" 3 locked photo frames
  | 'bribes-gift'     // Screen 8: Apology bribes & popping gift box
  | 'final-polaroid'; // Screen 9: Final Polaroid memory with Replay

export const HeartCraftAnimatedStory: React.FC<HeartCraftAnimatedStoryProps> = ({
  card,
  isAudioPlaying = false,
  onToggleAudio,
  onRestartExperience,
  isEmbeddedMockup = false,
  onSwitchToEditor
}) => {
  // If card has secretPassword, start at passcode screen, otherwise swipe-intro
  const [scene, setScene] = useState<StoryScene>(
    card.secretPassword && card.secretPassword.trim().length > 0 ? 'passcode' : 'swipe-intro'
  );

  // Screen 1: Passcode Keypad state
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>([]);
  const [passcodeError, setPasscodeError] = useState(false);
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  // Screen 2: Slider state
  const [sliderPosition, setSliderPosition] = useState(0); // 0 to 100%
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);

  // Screen 3 & 4: Card Decks
  const [deck1Index, setDeck1Index] = useState(0);
  const [deck2Index, setDeck2Index] = useState(0);

  // Screen 5: Hold to Forgive
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100%
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<any>(null);

  // Screen 6: Typewriter letter
  const [typedText, setTypedText] = useState('');

  // Screen 7: Heal My Heart 3 Locked Frames
  const [unlockedFrames, setUnlockedFrames] = useState<number>(0); // 0, 1, 2, 3

  // Screen 8: Gift box
  const [isGiftOpened, setIsGiftOpened] = useState(false);

  // Screen 9: Final title typing
  const [typedFinalTitle, setTypedFinalTitle] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const getTypographyFontClass = () => {
    switch (card.typography) {
      case 'handwriting':
        return 'font-handwriting';
      case 'script':
        return 'font-script';
      case 'calligraphy':
        return 'font-calligraphy';
      case 'serif':
        return 'font-serif-luxury';
      case 'playful':
        return 'font-playful';
      case 'typewriter':
        return 'font-typewriter';
      case 'sans':
      default:
        return 'font-sans-modern';
    }
  };

  const getFontSizeClass = () => {
    switch (card.fontSize) {
      case 'sm':
        return 'text-[11px] sm:text-xs';
      case 'lg':
        return 'text-sm sm:text-base';
      case 'xl':
        return 'text-base sm:text-lg';
      case 'md':
      default:
        return 'text-xs sm:text-sm';
    }
  };

  const fullLetter = card.heartfeltNote || `Dear Babyy 💖,\n\nI'm really sorry, my love. I accidentally upset the most precious and adorable person in my life - you. 🥺\n\nPlease forgive me if I hurt you or wasted even a little of your precious time. I promise I didn't mean to. 💕✨`;
  const finalTitle = card.finalPolaroidCaption || 'New Beginnings Ahead';

  // --- Typewriter letter effect ---
  useEffect(() => {
    if (scene === 'typewriter-note') {
      setTypedText('');
      let idx = 0;
      const timer = setInterval(() => {
        if (idx < fullLetter.length) {
          setTypedText((prev) => prev + fullLetter.charAt(idx));
          idx++;
        } else {
          clearInterval(timer);
        }
      }, 24);
      return () => clearInterval(timer);
    }
  }, [scene, fullLetter]);

  // --- Final title typing effect ---
  useEffect(() => {
    if (scene === 'final-polaroid') {
      setTypedFinalTitle('');
      let idx = 0;
      const timer = setInterval(() => {
        if (idx < finalTitle.length) {
          setTypedFinalTitle((prev) => prev + finalTitle.charAt(idx));
          idx++;
        } else {
          clearInterval(timer);
        }
      }, 55);
      return () => clearInterval(timer);
    }
  }, [scene, finalTitle]);

  // --- Passcode Keypad Handlers (Screen 1) ---
  const handleKeypadPress = (num: string) => {
    if (passcodeDigits.length >= 4) return;
    const newDigits = [...passcodeDigits, num];
    setPasscodeDigits(newDigits);

    if (newDigits.length === 4) {
      const entered = newDigits.join('');
      const target = (card.secretPassword || '1204').trim();

      if (entered === target) {
        setPasscodeSuccess(true);
        playHeartHitSound();
        setTimeout(() => {
          setScene('swipe-intro');
          setPasscodeDigits([]);
          setPasscodeSuccess(false);
        }, 600);
      } else {
        setPasscodeError(true);
        setTimeout(() => {
          setPasscodeDigits([]);
          setPasscodeError(false);
        }, 700);
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPasscodeDigits((prev) => prev.slice(0, -1));
  };

  // --- Slider Handlers (Screen 2) ---
  const handleSliderPointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleSliderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSlider || !sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const trackWidth = rect.width - 50;
    const pct = Math.max(0, Math.min(100, (x / trackWidth) * 100));
    setSliderPosition(pct);

    if (pct >= 82) {
      setIsDraggingSlider(false);
      setSliderPosition(100);
      playHeartHitSound();
      if (onToggleAudio && !isAudioPlaying) {
        onToggleAudio();
      }
      setTimeout(() => {
        setScene('story-deck-1');
        setSliderPosition(0);
      }, 350);
    }
  };

  const handleSliderPointerUp = () => {
    if (!isDraggingSlider) return;
    setIsDraggingSlider(false);
    if (sliderPosition < 82) {
      setSliderPosition(0);
    }
  };

  // --- Hold to Forgive Handlers (Screen 5) ---
  const handleHoldStart = () => {
    setIsHolding(true);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          handleHoldComplete();
          return 100;
        }
        return prev + 3.8;
      });
    }, 45);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const handleHoldComplete = () => {
    playHeartHitSound();
    setTimeout(() => {
      setScene('typewriter-note');
      setHoldProgress(0);
    }, 450);
  };

  // --- Unlock Frames Handlers (Screen 7) ---
  const handleUnlockNextFrame = () => {
    if (unlockedFrames < 3) {
      playHeartHitSound();
      setUnlockedFrames((prev) => prev + 1);
    } else {
      setScene('bribes-gift');
    }
  };

  // --- Gift Box Handlers (Screen 8) ---
  const handleOpenGift = () => {
    if (isGiftOpened) return;
    playHeartHitSound();
    setIsGiftOpened(true);
  };

  // --- Replay Experience ---
  const handleReplayAll = () => {
    setScene(card.secretPassword ? 'passcode' : 'swipe-intro');
    setPasscodeDigits([]);
    setDeck1Index(0);
    setDeck2Index(0);
    setSliderPosition(0);
    setHoldProgress(0);
    setUnlockedFrames(0);
    setIsGiftOpened(false);
    onRestartExperience?.();
  };

  const handleBack = () => {
    if (scene === 'swipe-intro') {
      if (card.secretPassword) setScene('passcode');
    } else if (scene === 'story-deck-1') {
      if (deck1Index > 0) setDeck1Index(deck1Index - 1);
      else setScene('swipe-intro');
    } else if (scene === 'story-deck-2') {
      if (deck2Index > 0) setDeck2Index(deck2Index - 1);
      else setScene('story-deck-1');
    } else if (scene === 'hold-heart') {
      setScene('story-deck-2');
    } else if (scene === 'typewriter-note') {
      setScene('hold-heart');
    } else if (scene === 'locked-frames') {
      setScene('typewriter-note');
    } else if (scene === 'bribes-gift') {
      setScene('locked-frames');
    } else if (scene === 'final-polaroid') {
      setScene('bribes-gift');
    }
  };

  const storyCards = card.storyCards && card.storyCards.length > 0 ? card.storyCards : [];
  const sweetPhotos = card.sweetMomentsPhotos && card.sweetMomentsPhotos.length > 0 ? card.sweetMomentsPhotos : card.photos;
  const healPhotos = card.healHeartPhotos && card.healHeartPhotos.length > 0 ? card.healHeartPhotos : card.photos;
  const bribes = card.bribes && card.bribes.length > 0 ? card.bribes : [];

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-between overflow-hidden shadow-2xl transition-all ${
        isEmbeddedMockup
          ? 'w-full h-full rounded-[32px]'
          : 'w-full max-w-[360px] sm:max-w-[390px] h-[670px] sm:h-[700px] rounded-[44px] border-8 border-slate-900 bg-white'
      }`}
      style={{
        background:
          scene === 'final-polaroid' || scene === 'typewriter-note' || scene === 'locked-frames'
            ? 'linear-gradient(180deg, #9f1239 0%, #881337 50%, #4c0519 100%)'
            : 'linear-gradient(180deg, #fdf8f6 0%, #fff1f2 100%)'
      }}
    >
      {/* Top Bar inside Phone */}
      <div className="w-full pt-4 px-4 pb-1 flex items-center justify-between z-30">
        {scene !== 'passcode' && scene !== 'swipe-intro' ? (
          <button
            onClick={handleBack}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition-all active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8 h-8" />
        )}

        {/* Dynamic Island Notch */}
        <div className="w-24 h-4 rounded-full bg-slate-950/20 backdrop-blur-md" />

        {/* Top Right Controls: Video & Audio */}
        <div className="flex items-center gap-1.5">
          {card.videoMessageUrl && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs flex items-center gap-1 text-[11px] font-bold active:scale-95 transition-all"
              title="Watch Personal Video Message"
            >
              <Video className="w-3.5 h-3.5 text-white" />
              <span>Video</span>
            </button>
          )}

          {onToggleAudio && (
            <button
              onClick={onToggleAudio}
              className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition-all active:scale-95"
              aria-label="Toggle Audio"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          SCREEN 1: PASSCODE LOCK (Matching video 00:00 - 00:02)
          ======================================================== */}
      {scene === 'passcode' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-6 pb-6 pt-2 animate-fadeIn">
          <div className="flex flex-col items-center mt-3">
            {/* 3D Heart Lock with Golden Key */}
            <div className="relative w-20 h-20 mb-3 animate-float-slow">
              <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 shadow-xl flex items-center justify-center text-white border-2 border-pink-200">
                <Heart className="w-12 h-12 fill-current text-white/90" />
              </div>
              {/* Golden Key sticking in keyhole */}
              <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-xl drop-shadow-md rotate-[-25deg]">
                🗝️
              </div>
            </div>

            <h2 className="text-sm font-bold tracking-widest text-rose-800 uppercase font-sans">
              ENTER PASSCODE
            </h2>

            {/* 4 Digit Boxes */}
            <div className={`flex items-center gap-2.5 mt-3 ${passcodeError ? 'animate-shake' : ''}`}>
              {[0, 1, 2, 3].map((idx) => {
                const digit = passcodeDigits[idx];
                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border-2 transition-all ${
                      passcodeSuccess
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : digit
                        ? 'border-rose-400 bg-rose-500 text-white shadow-md'
                        : 'border-rose-200 bg-white text-slate-800'
                    }`}
                  >
                    {digit || ''}
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              {card.passwordHint || 'Something special is waiting for you'}
            </p>
          </div>

          {/* Numeric Keypad (1-9, 0, backspace) */}
          <div className="w-full max-w-[240px] grid grid-cols-3 gap-3 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(String(num))}
                className="w-16 h-12 rounded-2xl bg-white hover:bg-rose-50 text-slate-800 font-bold text-lg shadow-sm border border-rose-100/80 active:scale-95 transition-all flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <div className="w-16 h-12" />
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="w-16 h-12 rounded-2xl bg-white hover:bg-rose-50 text-slate-800 font-bold text-lg shadow-sm border border-rose-100/80 active:scale-95 transition-all flex items-center justify-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="w-16 h-12 rounded-2xl bg-white hover:bg-rose-50 text-rose-500 font-bold text-sm shadow-sm border border-rose-100/80 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 2: INTRO WITH SLIDER (Matching video 00:03 - 00:07)
          ======================================================== */}
      {scene === 'swipe-intro' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn">
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            {/* Cute Crying Baby / Puppy Photo Frame */}
            <div className="w-56 sm:w-60 aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 relative group">
              <img
                src={card.introPhotoUrl || card.photos[0]?.url}
                alt="Cute Apology Meme"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mt-5 px-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-800">
                {card.hookTitle || 'I know I messed up'}
              </h2>
              <div className="text-sm font-semibold text-rose-600 mt-1">
                {card.recipientName ? `${card.recipientName} 💖🥺` : 'Babyy 💖🥺'}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto leading-relaxed whitespace-pre-line">
                {card.introSubtitle || 'Allow me to fix it for us, please listen to my heart'}
              </p>
            </div>
          </div>

          {/* Swipe right to fix it Slider (Heart Handle) */}
          <div className="w-full max-w-[320px] mt-4">
            <div
              ref={sliderTrackRef}
              onPointerDown={handleSliderPointerDown}
              onPointerMove={handleSliderPointerMove}
              onPointerUp={handleSliderPointerUp}
              className="relative w-full h-14 rounded-full bg-rose-100/90 border border-rose-200/80 p-1 flex items-center shadow-inner overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            >
              {/* Fill */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all"
                style={{ width: `${Math.max(16, sliderPosition)}%` }}
              />

              {/* Slider prompt text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-rose-700 tracking-wide">
                  {card.swipePromptText || 'Swipe right to fix it'}
                </span>
              </div>

              {/* Heart Slider Handle */}
              <div
                style={{
                  transform: `translateX(${((sliderTrackRef.current?.clientWidth || 280) - 52) * (sliderPosition / 100)}px)`,
                  transition: isDraggingSlider ? 'none' : 'transform 0.3s ease-out'
                }}
                className="relative z-10 w-11 h-11 rounded-full bg-rose-600 shadow-md border-2 border-white flex items-center justify-center text-white"
              >
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 3: STORY MEMES DECK (Matching video 00:08 - 00:12)
          ======================================================== */}
      {scene === 'story-deck-1' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-2">
            {storyCards.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === deck1Index ? 'w-6 bg-rose-500' : 'w-1.5 bg-rose-200'
                }`}
              />
            ))}
          </div>

          {/* Current Card */}
          <div className="w-full flex-1 flex flex-col items-center justify-center max-w-[310px]">
            <div className="w-full bg-white rounded-3xl p-4 shadow-xl border border-rose-100 text-center flex flex-col items-center transition-all animate-fadeIn">
              <div className="w-52 aspect-square rounded-2xl overflow-hidden bg-rose-50 shadow-inner mb-4 border border-rose-100 flex items-center justify-center">
                <img
                  src={storyCards[deck1Index]?.imageUrl}
                  alt="Story Meme"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-lg font-bold font-serif-luxury text-slate-800">
                {storyCards[deck1Index]?.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {storyCards[deck1Index]?.subtitle}
              </p>

              <button
                onClick={() => {
                  if (deck1Index < storyCards.length - 1) {
                    setDeck1Index(deck1Index + 1);
                    playArrowShootSound();
                  } else {
                    setScene('story-deck-2');
                  }
                }}
                className="mt-5 w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2">
            Card {deck1Index + 1} of {storyCards.length}
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 4: SWEET MOMENTS PHOTO STACK (Matching video 00:13 - 00:19)
          ======================================================== */}
      {scene === 'story-deck-2' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn">
          <div className="text-center mt-1">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-rose-700">
              {card.sweetMomentsTitle || 'Some Sweet Moments'}
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              (Swipe the cards)
            </p>
          </div>

          {/* Polaroid Frame with Pink Border */}
          <div className="w-full flex-1 flex flex-col items-center justify-center max-w-[290px] my-auto">
            <div
              onClick={() => {
                if (deck2Index < sweetPhotos.length - 1) {
                  setDeck2Index(deck2Index + 1);
                  playArrowShootSound();
                }
              }}
              className="w-full bg-white rounded-3xl p-3 pb-5 shadow-2xl border-4 border-pink-200 text-center cursor-pointer active:scale-98 transition-all relative group"
            >
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={sweetPhotos[deck2Index]?.url}
                  alt="Sweet Moment"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Caption */}
              <div className="mt-3">
                <p className="text-lg font-script font-bold text-rose-600">
                  {sweetPhotos[deck2Index]?.caption || "I'm sorry 🥺"}
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="w-full max-w-[310px]">
            <button
              onClick={() => setScene('hold-heart')}
              className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 5: HOLD TO FORGIVE! (Matching video 00:20 - 00:22)
          ======================================================== */}
      {scene === 'hold-heart' && (
        <div className="w-full flex-1 flex flex-col items-center justify-center px-6 pb-8 animate-fadeIn relative">
          <div
            onPointerDown={handleHoldStart}
            onPointerUp={handleHoldEnd}
            onPointerLeave={handleHoldEnd}
            className="relative flex flex-col items-center justify-center cursor-pointer touch-none z-10 group"
          >
            {isHolding && (
              <div className="absolute w-44 h-44 rounded-full border-2 border-rose-400/60 animate-ping duration-1000" />
            )}

            <svg className="w-52 h-52 -rotate-90 pointer-events-none">
              <circle
                cx="104"
                cy="104"
                r="80"
                fill="none"
                stroke="#ffe4e6"
                strokeWidth="6"
              />
              <circle
                cx="104"
                cy="104"
                r="80"
                fill="none"
                stroke="#be123c"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - holdProgress / 100)}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            </svg>

            <div
              style={{
                transform: `scale(${1 + (holdProgress / 100) * 1.8})`,
                transition: isHolding ? 'transform 0.05s linear' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="absolute inset-0 m-auto w-24 h-24 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-20 h-20 text-rose-600 fill-rose-600 filter drop-shadow-[0_10px_25px_rgba(190,18,60,0.4)] animate-pulse" />
            </div>
          </div>

          <div className="text-center mt-6 z-10">
            <h3 className="text-2xl font-bold font-serif-luxury text-slate-800">
              {card.holdHeartText || 'Hold to Forgive!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isHolding ? 'Keep holding... filling with love 💕' : 'Press and hold the heart'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 6: TYPEWRITER LETTER (Matching video 00:23 - 00:34)
          ======================================================== */}
      {scene === 'typewriter-note' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn text-white">
          <div className="text-center mt-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
              {card.letterTitle || 'Thank You for Being so Kind'}
            </h2>
          </div>

          {/* Typewriter Parchment */}
          <div className="w-full max-w-[310px] my-auto bg-[#faf6ee] text-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200/60 relative">
            <div className="absolute -top-3 right-4 text-xl">💌</div>

            <div className={`${getTypographyFontClass()} ${getFontSizeClass()} leading-relaxed whitespace-pre-line min-h-[170px] text-slate-800`}>
              {typedText}
              <span className="inline-block w-1.5 h-3.5 bg-rose-500 ml-0.5 animate-pulse" />
            </div>

            {card.senderName && (
              <div className="mt-4 pt-3 border-t border-amber-200 text-right">
                <span className="text-xs font-script text-rose-600 text-base">
                  Forever yours, {card.senderName}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setScene('locked-frames')}
            className="w-full max-w-[310px] py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          SCREEN 7: HEAL MY HEART (Matching video 00:35 - 00:38)
          ======================================================== */}
      {scene === 'locked-frames' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn text-white">
          <div className="text-center mt-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
              {card.healHeartTitle || 'Now Please Heal My heart'}
            </h2>
          </div>

          {/* 3 Tilted Locked Frames */}
          <div className="relative w-full max-w-[320px] h-[320px] my-auto flex items-center justify-center">
            {healPhotos.slice(0, 3).map((photo, idx) => {
              const isLocked = idx >= unlockedFrames;
              const transforms = [
                '-rotate-6 -translate-x-12 -translate-y-4',
                'rotate-4 translate-x-12 -translate-y-2',
                'rotate-[-2deg] translate-y-14'
              ];

              return (
                <div
                  key={photo.id || idx}
                  className={`absolute w-36 h-44 bg-white rounded-xl p-2 shadow-2xl border-2 border-slate-200 transition-all duration-500 ${transforms[idx]}`}
                >
                  <div className="w-full h-full rounded-lg overflow-hidden relative bg-slate-100 flex items-center justify-center">
                    <img
                      src={photo.url}
                      alt="Memory Frame"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Red Heart Lock Overlay if locked */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center animate-fadeIn">
                        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md animate-pulse">
                          <Heart className="w-5 h-5 fill-current" />
                        </div>
                        <div className="w-4 h-4 -mt-1 text-xs">🔒</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unlock Button / Continue */}
          <div className="w-full max-w-[310px]">
            <button
              onClick={handleUnlockNextFrame}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {unlockedFrames < 3 ? (
                <>
                  <Key className="w-4 h-4 text-rose-500" />
                  <span>🔑 Unlock photo {unlockedFrames + 1}</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN 8: APOLOGY BRIBES (Matching video 00:39 - 00:53)
          ======================================================== */}
      {scene === 'bribes-gift' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn">
          <div className="text-center mt-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-rose-800">
              {card.bribesTitle || 'Please accept my apology bribes ;)'}
            </h2>
          </div>

          {!isGiftOpened ? (
            <div
              onClick={handleOpenGift}
              className="my-auto cursor-pointer flex flex-col items-center group animate-float-slow"
            >
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-300/40 rounded-full blur-2xl" />
                <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-xl border-2 border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="absolute inset-x-0 mx-auto w-6 h-full bg-sky-500 shadow-sm" />
                  <div className="absolute inset-y-0 my-auto w-full h-6 bg-sky-500 shadow-sm" />
                  <div className="absolute -top-4 w-12 h-8 rounded-full border-4 border-sky-400 bg-sky-300 shadow-sm flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
              <span className="mt-4 px-4 py-1.5 rounded-full bg-white text-rose-600 text-xs font-bold shadow-sm border border-rose-200 animate-bounce">
                Tap gift box to open! 🎁
              </span>
            </div>
          ) : (
            <div className="w-full max-w-[310px] my-auto space-y-2.5 animate-fadeIn">
              {bribes.map((bribe) => (
                <div
                  key={bribe.id}
                  className="p-3 rounded-2xl bg-white border border-rose-100 shadow-md flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                    {bribe.imageUrl ? (
                      <img
                        src={bribe.imageUrl}
                        alt={bribe.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{bribe.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800">{bribe.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {bribe.description}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setScene('final-polaroid')}
                className="mt-4 w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Accept All Bribes :)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SCREEN 9: FINAL REVEAL (Matching video 00:54 - 01:01)
          ======================================================== */}
      {scene === 'final-polaroid' && (
        <div className="w-full flex-1 flex flex-col items-center justify-between px-5 pb-6 pt-2 animate-fadeIn text-white">
          <div className="w-full flex flex-col items-center my-auto">
            {/* Washi-taped Polaroid */}
            <div className="relative w-64 sm:w-72 bg-white rounded-2xl p-3 pb-6 polaroid-shadow border border-slate-200/80 -rotate-1 mb-4">
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 border border-pink-300/60 rounded-xs rotate-2 shadow-xs"
                style={{ backdropFilter: 'blur(2px)' }}
              />
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={card.finalPolaroidUrl || card.photos[0]?.url}
                  alt="Final Polaroid"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Heart Stamp Sticker on corner */}
              <div className="absolute -bottom-3 -left-2 text-2xl drop-shadow-md">
                💌
              </div>
            </div>

            {/* Glowing Golden Heart */}
            <div className="my-2">
              <Heart className="w-7 h-7 text-amber-300 fill-amber-300 animate-pulse drop-shadow-md" />
            </div>

            {/* Typed Title */}
            <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white text-center">
              {typedFinalTitle}
              <span className="inline-block w-1.5 h-4 bg-amber-300 ml-0.5 animate-pulse" />
            </h2>

            {/* Heartfelt Closing Note */}
            <p className="text-xs text-pink-100 mt-2 text-center max-w-[280px] leading-relaxed">
              {card.finalClosingNote || "Thank you for being the most forgiving and wonderful person. I love you to the moon and back and I'm never letting you go. ❤️"}
            </p>
          </div>

          {/* Action buttons: Video + Replay + Create Your Own */}
          <div className="w-full max-w-[310px] space-y-2">
            {card.videoMessageUrl && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4 text-white" />
                <span>Watch Personal Video Message 🎥💕</span>
              </button>
            )}

            <button
              onClick={handleReplayAll}
              className="w-full py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Replay</span>
            </button>

            {onSwitchToEditor && (
              <button
                onClick={onSwitchToEditor}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Create Your Free HeartCraft Card</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="w-full pb-3 px-5 flex items-center justify-center z-30">
        <span className="text-[10px] text-slate-400 font-medium">
          HeartCraft Experience · 100% Free Forever
        </span>
      </div>

      {/* Video Message Modal */}
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
