import QRCode from 'qrcode';
import { HeartCraftCard } from '../types/card';
import { encodeCardToHash, saveCardToStorage } from './storage';

/**
 * Generates an optimal URL for QR codes that is compact and guaranteed to fit
 * in standard QR code specifications for instant camera scanning.
 */
export function getQrShareableUrl(card: HeartCraftCard): string {
  saveCardToStorage(card);

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const fullHash = encodeCardToHash(card);

  // If full hash is short enough for high-density scanning (< 1400 chars)
  if (fullHash.length < 1400) {
    return `${baseUrl}${fullHash}`;
  }

  // Otherwise, create a compact version with the card's essential identifiers
  // and text fields without bulky asset strings
  const compactPayload = {
    id: card.id,
    recipientName: card.recipientName,
    senderName: card.senderName,
    cardTitle: card.cardTitle,
    secretPassword: card.secretPassword,
    openingActivity: card.openingActivity,
    theme: card.theme,
    typography: card.typography,
    youtubeUrl: card.youtubeUrl
  };

  try {
    const json = JSON.stringify(compactPayload);
    const b64 = btoa(encodeURIComponent(json));
    const compactHash = `#recipient=${card.id}&cfg=${b64}`;
    if (compactHash.length < 1600) {
      return `${baseUrl}${compactHash}`;
    }
  } catch {
    // fallback
  }

  // Fallback to recipient ID which loads from storage/preset
  return `${baseUrl}#recipient=${card.id}`;
}

export interface QrCodeOptions {
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  width?: number;
}

/**
 * Generates high-res DataURL for the QR code
 */
export async function generateCardQrDataUrl(
  card: HeartCraftCard,
  options?: QrCodeOptions
): Promise<string> {
  const url = getQrShareableUrl(card);

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: options?.width || 512,
      margin: options?.margin !== undefined ? options.margin : 2,
      color: {
        dark: options?.color?.dark || '#1e1b4b',
        light: options?.color?.light || '#ffffff'
      },
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M'
    });
    return dataUrl;
  } catch (err) {
    console.warn('QR code generation with full URL failed, attempting fallback URL', err);
    // Absolute fallback
    const fallbackUrl = `${window.location.origin}${window.location.pathname}#recipient=${card.id}`;
    return await QRCode.toDataURL(fallbackUrl, {
      width: options?.width || 512,
      margin: 2,
      color: {
        dark: options?.color?.dark || '#1e1b4b',
        light: options?.color?.light || '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  }
}
