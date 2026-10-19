import { HeartCraftCard, StoryCard, LoveBribe, CardPhoto } from '../types/card';
import coupleImg from '../assets/images/heartcraft_memory_couple_1792399049966.jpg';
import celebrationImg from '../assets/images/heartcraft_memory_celebration_1792399050461.jpg';
import sunsetImg from '../assets/images/heartcraft_memory_sunset_1792399050883.jpg';
import puppyImg from '../assets/images/heartcraft_cute_puppy_1792400365092.jpg';
import chibiHugImg from '../assets/images/heartcraft_chibi_hug_1792400364520.jpg';
import bouquetImg from '../assets/images/heartcraft_bouquet_roses_1792400365557.jpg';
import teddyBearsImg from '../assets/images/heartcraft_teddy_bears_1792402049430.jpg';
import chocolateBoxImg from '../assets/images/heartcraft_chocolate_box_1792402049791.jpg';
import indianMemoryImg from '../assets/images/heartcraft_indian_memory_1792402081825.jpg';

const STORAGE_KEY_PREFIX = 'heartcraft_card_';
const RECENT_CARDS_KEY = 'heartcraft_saved_card_ids';

export const DEFAULT_PRESET_IMAGES: CardPhoto[] = [
  {
    id: 'preset-indian',
    url: indianMemoryImg,
    caption: 'I\'m sorry 🥺',
    rotation: -2
  },
  {
    id: 'preset-couple',
    url: coupleImg,
    caption: 'Please forgive me 💖',
    rotation: 2
  },
  {
    id: 'preset-sunset',
    url: sunsetImg,
    caption: 'You mean everything 💕',
    rotation: -1
  }
];

export const HEARTFELT_APOLOGY_STORY_CARDS: StoryCard[] = [
  {
    id: 'story-1',
    title: 'I know I hurt you',
    subtitle: 'I messed up... and I\'m really sorry for that.',
    imageUrl: puppyImg
  },
  {
    id: 'story-2',
    title: 'I\'m truly sorry for what happened',
    subtitle: 'I promise I\'ll be better for you every single day.',
    imageUrl: sunsetImg
  },
  {
    id: 'story-3',
    title: 'You Mean Everything to Me',
    subtitle: 'Please forgive me... You mean so much to me.',
    imageUrl: chibiHugImg
  }
];

export const HEARTFELT_APOLOGY_BRIBES: LoveBribe[] = [
  {
    id: 'bribe-1',
    title: 'Fresh Bloom',
    description: 'Only valid for 1 bouquet + unlimited forehead kisses',
    emoji: '💐',
    imageUrl: bouquetImg
  },
  {
    id: 'bribe-2',
    title: 'Cuddle Pass',
    description: 'Valid for unlimited cuddles and no drama day',
    emoji: '🧸',
    imageUrl: teddyBearsImg
  },
  {
    id: 'bribe-3',
    title: 'Sweet Treat',
    description: 'Only valid for your favorite chocolate + my full attention',
    emoji: '🍫',
    imageUrl: chocolateBoxImg
  }
];

export const APOLOGY_PRESET_CARD: HeartCraftCard = {
  id: 'preset-apology-video-exact',
  recipientName: 'Babyy',
  senderName: 'Your Love',
  occasion: 'sorry',
  occasionBadge: 'Heartfelt Apology',
  
  // 1. Passcode Lock Screen (Matching video 00:00 - 00:02)
  secretPassword: '1204',
  passwordHint: 'Our special 4-digit code (default: 1204) 💖',

  // 2. Intro Screen (Matching video 00:03 - 00:07)
  introPhotoUrl: puppyImg,
  hookTitle: 'I know I messed up',
  introSubtitle: 'Babyy 💖🥺\nAllow me to fix it for us, please listen to my heart',
  swipePromptText: 'Swipe right to fix it',

  // 3. Story Memes Deck (Matching video 00:08 - 00:12)
  storyCards: HEARTFELT_APOLOGY_STORY_CARDS,

  // 4. "Some Sweet Moments" Photo Deck (Matching video 00:13 - 00:19)
  sweetMomentsTitle: 'Some Sweet Moments',
  sweetMomentsPhotos: DEFAULT_PRESET_IMAGES,

  // 5. Hold to Forgive (Matching video 00:20 - 00:22)
  holdHeartText: 'Hold to Forgive!',

  // 6. Typewriter Love Letter (Matching video 00:23 - 00:34)
  letterTitle: 'Thank You for Being so Kind',
  heartfeltNote: `Dear Babyy 💖,

I'm really sorry, my love. I accidentally upset the most precious and adorable person in my life - you. 🥺

Please forgive me if I hurt you or wasted even a little of your precious time. I promise I didn't mean to. 💕✨`,
  typography: 'serif',

  // 7. "Now Please Heal My heart" 3 Locked Frames (Matching video 00:35 - 00:38)
  healHeartTitle: 'Now Please Heal My heart',
  healHeartPhotos: [
    {
      id: 'heal-1',
      url: indianMemoryImg,
      caption: 'Your radiant smile ✨',
      rotation: -3
    },
    {
      id: 'heal-2',
      url: coupleImg,
      caption: 'When we laughed together ❤️',
      rotation: 2
    },
    {
      id: 'heal-3',
      url: sunsetImg,
      caption: 'Endless love for you 🌅',
      rotation: -1
    }
  ],

  // 8. Apology Bribes & Gift Box (Matching video 00:39 - 00:53)
  bribesTitle: 'Please accept my apology bribes ;)',
  bribes: HEARTFELT_APOLOGY_BRIBES,

  // 9. Final Polaroid Reveal (Matching video 00:54 - 01:01)
  finalPolaroidUrl: chibiHugImg,
  finalPolaroidCaption: 'New Beginnings Ahead',
  finalClosingNote: 'Thank you for being the most forgiving and wonderful person. I love you to the moon and back and I\'m never letting you go. ❤️',

  // Visual Theme & Audio
  theme: 'rose-blush',
  photos: DEFAULT_PRESET_IMAGES,
  photoDisplayFormat: 'polaroid-stack',
  youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
  youtubeOffsetSeconds: 10,
  youtubeLoop: true,
  openingActivity: 'cupid-arrow',
  particleEffect: 'floating-hearts',
  createdAt: Date.now()
};

export const DEMO_CARD: HeartCraftCard = APOLOGY_PRESET_CARD;

export const ROMANTIC_PRESET_CARD: HeartCraftCard = {
  ...APOLOGY_PRESET_CARD,
  id: 'preset-romantic',
  recipientName: 'Sophia',
  senderName: 'Julian',
  occasion: 'anniversary',
  occasionBadge: 'Happy Anniversary',
  secretPassword: '1204',
  hookTitle: 'To My One & Only',
  introSubtitle: 'You turned everyday ordinary into pure magic ✨',
  swipePromptText: 'Swipe right to enter my heart',
  holdHeartText: 'Hold to Unlock Forever!',
  letterTitle: 'A Love Letter for You',
  finalPolaroidCaption: 'Forever & Always',
  youtubeUrl: 'https://www.youtube.com/watch?v=-BjZmE2gtdo',
  youtubeOffsetSeconds: 46
};

export const BIRTHDAY_PRESET_CARD: HeartCraftCard = {
  ...APOLOGY_PRESET_CARD,
  id: 'preset-birthday',
  recipientName: 'Birthday Star',
  senderName: 'Your Besties',
  occasion: 'birthday',
  occasionBadge: 'Happy Birthday!',
  secretPassword: '1204',
  hookTitle: 'Happy Birthday to You! 🎂',
  introSubtitle: 'Get ready for an epic surprise crafted just for you 🎉',
  swipePromptText: 'Swipe right to start party',
  holdHeartText: 'Hold to Make a Wish! 🌟',
  letterTitle: 'Happy Birthday Dearest!',
  finalPolaroidCaption: 'Best Year Ahead 🚀',
  youtubeUrl: 'https://www.youtube.com/watch?v=NL6CDFn2i3I',
  youtubeOffsetSeconds: 0
};

export function saveCardToStorage(card: HeartCraftCard): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + card.id, JSON.stringify(card));
    
    const existingIdsStr = localStorage.getItem(RECENT_CARDS_KEY);
    const existingIds: string[] = existingIdsStr ? JSON.parse(existingIdsStr) : [];
    if (!existingIds.includes(card.id)) {
      existingIds.unshift(card.id);
      localStorage.setItem(RECENT_CARDS_KEY, JSON.stringify(existingIds.slice(0, 20)));
    }
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}

export function getCardFromStorage(id: string): HeartCraftCard | null {
  if (id === DEMO_CARD.id || id === 'demo-valentine-forever') return DEMO_CARD;
  if (id === APOLOGY_PRESET_CARD.id) return APOLOGY_PRESET_CARD;
  if (id === ROMANTIC_PRESET_CARD.id) return ROMANTIC_PRESET_CARD;
  if (id === BIRTHDAY_PRESET_CARD.id) return BIRTHDAY_PRESET_CARD;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Storage read failed:', err);
  }
  return null;
}

export function encodeCardToHash(card: HeartCraftCard): string {
  try {
    saveCardToStorage(card);
    const safePayload = {
      ...card,
      photos: card.photos.map(p => ({
        id: p.id,
        url: p.url.length > 50000 ? '' : p.url,
        caption: p.caption,
        rotation: p.rotation
      }))
    };
    const json = JSON.stringify(safePayload);
    const b64 = btoa(encodeURIComponent(json));
    return `#recipient=${card.id}&data=${b64}`;
  } catch {
    return `#recipient=${card.id}`;
  }
}

export function decodeCardFromHash(hash: string): HeartCraftCard | null {
  if (!hash) return null;
  const clean = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(clean);
  const cardId = params.get('recipient') || params.get('card') || params.get('id');

  const dataB64 = params.get('data');
  if (dataB64) {
    try {
      const json = decodeURIComponent(atob(dataB64));
      const parsed: HeartCraftCard = JSON.parse(json);
      if (cardId) {
        const local = getCardFromStorage(cardId);
        if (local && local.photos && local.photos.length > 0) {
          parsed.photos = local.photos;
        }
      }
      return parsed;
    } catch {
      // fallback to other parsing methods
    }
  }

  const cfgB64 = params.get('cfg');
  if (cfgB64) {
    try {
      const json = decodeURIComponent(atob(cfgB64));
      const parsedCfg = JSON.parse(json);
      const baseCard = cardId ? getCardFromStorage(cardId) || DEMO_CARD : DEMO_CARD;
      return {
        ...baseCard,
        ...parsedCfg
      };
    } catch {
      // fallback
    }
  }

  if (cardId) {
    const stored = getCardFromStorage(cardId);
    if (stored) return stored;
  }

  return null;
}
