export interface MusicPreset {
  id: string;
  title: string;
  artist: string;
  youtubeUrl: string;
  suggestedOffset: number;
  mood: string;
}

export const CURATED_MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'lover',
    title: 'Lover (Romantic Acoustic)',
    artist: 'Taylor Swift',
    youtubeUrl: 'https://www.youtube.com/watch?v=-BjZmE2gtdo',
    suggestedOffset: 46,
    mood: 'Anniversary / Love'
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour (Piano & Strings)',
    artist: 'JVKE',
    youtubeUrl: 'https://www.youtube.com/watch?v=PEM0Vs8jf1w',
    suggestedOffset: 25,
    mood: 'Romantic / Nostalgic'
  },
  {
    id: 'river-flows',
    title: 'River Flows In You',
    artist: 'Yiruma',
    youtubeUrl: 'https://www.youtube.com/watch?v=7maJOI3QMu0',
    suggestedOffset: 12,
    mood: 'Heartfelt / Apology'
  },
  {
    id: 'birthday-gentle',
    title: 'Happy Birthday to You (Warm Acoustic Guitar)',
    artist: 'Acoustic Lounge',
    youtubeUrl: 'https://www.youtube.com/watch?v=NL6CDFn2i3I',
    suggestedOffset: 0,
    mood: 'Birthday'
  },
  {
    id: 'until-i-found-you',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    youtubeUrl: 'https://www.youtube.com/watch?v=GxldQ9eX2wo',
    suggestedOffset: 34,
    mood: 'Love & Devotion'
  },
  {
    id: 'apology-lofi',
    title: 'I Miss You (Lofi Chill & Rain)',
    artist: 'Peaceful Melody',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    suggestedOffset: 10,
    mood: 'Sorry / Reconciliation'
  }
];

/**
 * Extracts YouTube video ID from various standard YouTube URL formats.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  // Parameter fallback: ?v=xxxx or &v=xxxx
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const v = parsed.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
      return v;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Formats seconds into mm:ss
 */
export function formatSecondsToTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Parses "mm:ss" or "ss" string into number of seconds
 */
export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':');
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return m * 60 + s;
  }
  return parseInt(timeStr, 10) || 0;
}
