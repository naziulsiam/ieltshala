import { supabase } from '@/lib/supabase';

// TTS Configuration
// Options: 'openai', 'elevenlabs', 'browser'
const TTS_PROVIDER = import.meta.env.VITE_TTS_PROVIDER || 'browser';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export interface TTSOptions {
  voice?: string;
  speed?: number;
  cache?: boolean;
}

// Cache for audio URLs to avoid regenerating
const audioCache = new Map<string, string>();

/**
 * Generate speech from text using the configured TTS provider
 */
export async function generateSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<string> {
  const { voice, speed = 1.0, cache = true } = options;
  
  // Create cache key
  const cacheKey = `${text}_${voice}_${speed}`;
  
  // Check cache
  if (cache && audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }
  
  try {
    let audioUrl: string;
    
    switch (TTS_PROVIDER) {
      case 'openai':
        audioUrl = await generateOpenAITTS(text, voice, speed);
        break;
      case 'elevenlabs':
        audioUrl = await generateElevenLabsTTS(text, voice);
        break;
      case 'browser':
      default:
        // Browser TTS returns a data URI or uses SpeechSynthesis API
        return generateBrowserTTS(text, speed);
    }
    
    // Cache the result
    if (cache) {
      audioCache.set(cacheKey, audioUrl);
    }
    
    return audioUrl;
  } catch (error) {
    console.error('TTS generation error:', error);
    // Fallback to browser TTS
    return generateBrowserTTS(text, speed);
  }
}

/**
 * OpenAI TTS - High quality, affordable
 * Cost: $0.015 per 1K characters
 */
async function generateOpenAITTS(
  text: string,
  voice: string = 'alloy',
  speed: number = 1.0
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed: speed,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI TTS error: ${response.statusText}`);
  }
  
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

/**
 * ElevenLabs TTS - Best quality, more expensive
 * Cost: ~$0.10 per 1K characters (varies by model)
 */
async function generateElevenLabsTTS(
  text: string,
  voiceId: string = 'pNInz6obpgDQGcFmaJgB' // Adam - British accent
): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }
  
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`ElevenLabs TTS error: ${response.statusText}`);
  }
  
  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

/**
 * Browser TTS - Free, decent quality, no API key needed
 * Uses the Web Speech API
 */
function generateBrowserTTS(text: string, speed: number = 1.0): string {
  // Browser TTS doesn't return a URL, it speaks directly
  // We return a special marker to indicate browser TTS should be used
  return `browser://speak?text=${encodeURIComponent(text)}&speed=${speed}`;
}

/**
 * Speak text using browser's SpeechSynthesis API
 */
export function speakWithBrowser(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  } = {}
): void {
  if (!window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    return;
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1.0;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  
  if (options.voice) {
    utterance.voice = options.voice;
  }
  
  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;
  
  window.speechSynthesis.speak(utterance);
}

/**
 * Get available browser voices
 */
export function getBrowserVoices(): SpeechSynthesisVoice[] {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Get best English voice for IELTS practice
 */
export function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getBrowserVoices();
  
  // Prefer British English voices for IELTS
  const britishVoices = voices.filter(v => 
    v.lang.includes('en-GB') || v.lang.includes('en-UK')
  );
  
  if (britishVoices.length > 0) {
    // Prefer female voices (often clearer for learning)
    const femaleVoice = britishVoices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.includes('Samantha') ||
      v.name.includes('Victoria')
    );
    return femaleVoice || britishVoices[0];
  }
  
  // Fallback to any English voice
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  return englishVoices[0] || voices[0] || null;
}

/**
 * Preload/cache common phrases
 */
export async function preloadCommonPhrases(phrases: string[]): Promise<void> {
  if (TTS_PROVIDER === 'browser') return; // No need to preload browser TTS
  
  for (const phrase of phrases) {
    try {
      await generateSpeech(phrase, { cache: true });
    } catch (error) {
      console.warn('Failed to preload phrase:', phrase);
    }
  }
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  
  // Stop any playing audio elements
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

/**
 * Check if TTS is available
 */
export function isTTSAvailable(): boolean {
  return (
    TTS_PROVIDER === 'browser' && window.speechSynthesis !== undefined
  ) || (
    TTS_PROVIDER === 'openai' && !!OPENAI_API_KEY
  ) || (
    TTS_PROVIDER === 'elevenlabs' && !!ELEVENLABS_API_KEY
  );
}

/**
 * Get TTS provider info
 */
export function getTTSInfo(): {
  provider: string;
  available: boolean;
  quality: 'low' | 'medium' | 'high';
  requiresApiKey: boolean;
} {
  const info: Record<string, { quality: 'low' | 'medium' | 'high'; requiresApiKey: boolean }> = {
    browser: { quality: 'medium', requiresApiKey: false },
    openai: { quality: 'high', requiresApiKey: true },
    elevenlabs: { quality: 'high', requiresApiKey: true },
  };
  
  return {
    provider: TTS_PROVIDER,
    available: isTTSAvailable(),
    ...info[TTS_PROVIDER],
  };
}
