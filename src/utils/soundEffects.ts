/**
 * Synthesizes delightful sound effects using browser Web Audio API
 * No external audio files or network requests needed!
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Sound of bow releasing and arrow whooshing through the air
 */
export function playArrowShootSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(480, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.28);
}

/**
 * Sound of arrow striking heart with resonant sparkle chime
 */
export function playHeartHitSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Impact thump
  const thumpOsc = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  thumpOsc.type = 'triangle';
  thumpOsc.frequency.setValueAtTime(150, now);
  thumpOsc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
  thumpGain.gain.setValueAtTime(0.3, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  thumpOsc.connect(thumpGain);
  thumpGain.connect(ctx.destination);
  thumpOsc.start(now);
  thumpOsc.stop(now + 0.2);

  // Sparkling harmonic chimes (Major chord arpeggio: C5, E5, G5, C6)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const chimeOsc = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    const startTime = now + idx * 0.05;

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(freq, startTime);

    chimeGain.gain.setValueAtTime(0.12, startTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    chimeOsc.start(startTime);
    chimeOsc.stop(startTime + 0.6);
  });
}
