export type OccasionType = 'sorry' | 'birthday' | 'anniversary' | 'custom';

export type TypographyStyle = 
  | 'serif' 
  | 'script' 
  | 'handwriting' 
  | 'calligraphy' 
  | 'sans' 
  | 'playful' 
  | 'typewriter';

export type PaperTheme = 
  | 'rose-blush' 
  | 'lavender-dream' 
  | 'golden-honey' 
  | 'mint-whisper' 
  | 'midnight-velvet';

export type ParticleType = 
  | 'floating-hearts' 
  | 'cherry-petals' 
  | 'stardust' 
  | 'confetti';

export type OpeningActivity = 
  | 'cupid-arrow'
  | 'gift-box' 
  | 'wax-envelope' 
  | 'scratch-card';

export interface CardPhoto {
  id: string;
  url: string;
  caption: string;
  rotation?: number;
}

export interface StoryCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  emoji?: string;
}

export interface LoveBribe {
  id: string;
  title: string;
  description: string;
  emoji: string;
  imageUrl?: string;
}

export interface HeartCraftCard {
  id: string;
  recipientName: string;
  senderName: string;
  occasion: OccasionType;
  customOccasionTitle?: string;
  occasionBadge?: string;
  
  // 1. Passcode Lock Screen (Screen 1)
  secretPassword: string; // 4-digit PIN e.g. "1204"
  passwordHint: string;

  // 2. Intro Screen (Screen 2)
  introPhotoUrl?: string;
  hookTitle: string; // "I know I messed up Babyy 💖🥺"
  introSubtitle?: string; // "Allow me to fix it for us, please listen to my heart"
  swipePromptText: string; // "Swipe right to fix it"

  // 3. Story Memes Deck (Screen 3)
  storyCards: StoryCard[];

  // 4. "Some Sweet Moments" Photo Deck (Screen 4)
  sweetMomentsTitle?: string; // "Some Sweet Moments"
  sweetMomentsPhotos: CardPhoto[]; // 3+ photos with captions: "I'm sorry 🥺", "Please forgive me 💖"

  // 5. Hold to Forgive (Screen 5)
  holdHeartText: string; // "Hold to Forgive!"

  // 6. Typewriter Love Letter (Screen 6)
  letterTitle?: string; // "Thank You for Being so Kind"
  heartfeltNote: string; // Typewriter text
  typography: TypographyStyle;

  // 7. "Now Please Heal My heart" 3 Locked Photo Frames (Screen 7)
  healHeartTitle?: string; // "Now Please Heal My heart"
  healHeartPhotos: CardPhoto[]; // 3 photos unlocked with key 1, 2, 3

  // 8. Apology Bribes & Gift Box (Screen 8)
  bribesTitle?: string; // "Please accept my apology bribes ;)"
  bribes: LoveBribe[]; // 3 bribes (Fresh Bloom, Cuddle Pass, Sweet Treat)

  // 9. Final Polaroid Reveal (Screen 9)
  finalPolaroidUrl?: string;
  finalPolaroidCaption: string; // "New Beginnings Ahead"
  finalClosingNote?: string; // "Thank you for being the most forgiving and wonderful person..."

  // Visual Theme & Audio & Video Message
  theme: PaperTheme;
  photos: CardPhoto[];
  photoDisplayFormat: 'polaroid-stack' | 'film-strip' | 'cards';
  youtubeUrl: string;
  youtubeOffsetSeconds: number;
  youtubeLoop: boolean;
  videoMessageUrl?: string; // Optional YouTube / video message clip
  videoMessageTitle?: string; // Optional title for video greeting
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  openingActivity: OpeningActivity;
  particleEffect: ParticleType;
  createdAt: number;
}
