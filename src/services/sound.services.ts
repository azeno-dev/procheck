import PocketBase from 'pocketbase';
import { Constants } from '@/Constants';
// @ts-ignore
import homerDefault from '@/assets/sounds/Voicy_Homer_Simpson_Doh.mp3';
// @ts-ignore
import boingDefault from '@/assets/sounds/Voicy_Slack_Boing.mp3';
// @ts-ignore
import tromboneDefault from '@/assets/sounds/Voicy_Sad_trombone.mp3';

export type SoundType = 'success' | 'warning' | 'error';

export interface SoundConfig {
  type: SoundType;
  label: string;
  description: string;
  defaultUrl: string;
  customUrl?: string; // Data URL or DB CDN URL
  fileName?: string;
  isCustom: boolean;
  updatedAt?: string;
}

const DEFAULT_SOUNDS: Record<SoundType, { label: string; description: string; defaultUrl: string }> = {
  success: {
    label: "Validare AWB (Success)",
    description: "Sunet redat când AWB-ul scanat este găsit și marcat pregătit",
    defaultUrl: boingDefault,
  },
  warning: {
    label: "AWB Duplicat (Warning)",
    description: "Sunet redat când AWB-ul a fost scanat deja sau apare de mai multe ori",
    defaultUrl: tromboneDefault,
  },
  error: {
    label: "AWB Negăsit (Error)",
    description: "Sunet redat când AWB-ul nu există în lista curentă",
    defaultUrl: homerDefault,
  },
};

class SoundService {
  private pb: PocketBase;
  private audioElements: Partial<Record<SoundType, HTMLAudioElement>> = {};

  constructor() {
    this.pb = new PocketBase(Constants.database.url);
    this.pb.autoCancellation(false);
  }

  // Get sound configuration for all 3 types
  getSoundConfigs(): SoundConfig[] {
    const types: SoundType[] = ['success', 'warning', 'error'];
    return types.map(type => this.getSoundConfig(type));
  }

  // Get specific sound configuration with custom or web default
  getSoundConfig(type: SoundType): SoundConfig {
    const meta = DEFAULT_SOUNDS[type];
    const customData = this.getCustomSoundData(type);

    return {
      type,
      label: meta.label,
      description: meta.description,
      defaultUrl: meta.defaultUrl,
      customUrl: customData?.url,
      fileName: customData?.fileName,
      isCustom: !!customData?.url,
      updatedAt: customData?.updatedAt,
    };
  }

  // Play sound by type (uses custom DB sound if present, otherwise defaults to web asset)
  playSound(type: SoundType, enabled = true) {
    if (!enabled) return;

    try {
      const config = this.getSoundConfig(type);
      const soundSource = config.isCustom && config.customUrl ? config.customUrl : config.defaultUrl;

      // Stop previous instance if playing
      if (this.audioElements[type]) {
        this.audioElements[type]?.pause();
        this.audioElements[type]!.currentTime = 0;
      }

      const audio = new Audio(soundSource);
      this.audioElements[type] = audio;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`[SoundService] Audio playback interrupted or blocked for ${type}:`, err);
        });
      }
    } catch (err) {
      console.error(`[SoundService] Failed to play sound ${type}:`, err);
    }
  }

  // Upload custom sound for a specific event type (Saves to DB and Local Storage Cache)
  async uploadSound(type: SoundType, file: File): Promise<{ success: boolean; url: string; inDb: boolean }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          let inDb = false;

          // 1. Cache locally in localStorage for instantaneous playback
          const soundPayload = {
            url: dataUrl,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            updatedAt: new Date().toISOString(),
          };

          localStorage.setItem(`procheck_sound_${type}`, JSON.stringify(soundPayload));

          // 2. Persist to PocketBase DB if authenticated or if collection exists
          try {
            const locUser = localStorage.getItem('user');
            const userId = locUser ? JSON.parse(locUser)?.record?.id : 'anonymous';

            const formData = new FormData();
            formData.append('soundType', type);
            formData.append('fileName', file.name);
            formData.append('audioFile', file);
            formData.append('userId', userId);

            // Attempt create in 'custom_sounds' or 'settings'
            try {
              await this.pb.collection('custom_sounds').create(formData);
              inDb = true;
            } catch (collectionErr) {
              // Fallback: try saving JSON payload in 'user_settings'
              try {
                await this.pb.collection('settings').create({
                  key: `sound_${type}_${userId}`,
                  value: soundPayload,
                });
                inDb = true;
              } catch {
                // Stored in localStorage cache
              }
            }
          } catch (dbErr) {
            console.warn('[SoundService] DB sync skipped, stored in local cache:', dbErr);
          }

          resolve({ success: true, url: dataUrl, inDb });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // Reset sound to web default
  async resetToDefault(type: SoundType): Promise<boolean> {
    try {
      localStorage.removeItem(`procheck_sound_${type}`);

      // Try removing from PocketBase if exists
      try {
        const locUser = localStorage.getItem('user');
        const userId = locUser ? JSON.parse(locUser)?.record?.id : 'anonymous';
        const records = await this.pb.collection('custom_sounds').getList(1, 1, {
          filter: `soundType = "${type}" && userId = "${userId}"`,
        });
        if (records.items.length > 0) {
          await this.pb.collection('custom_sounds').delete(records.items[0].id);
        }
      } catch {
        // Ignore DB deletion errors
      }

      return true;
    } catch {
      return false;
    }
  }

  // Helper to read custom sound cache
  private getCustomSoundData(type: SoundType): { url: string; fileName: string; updatedAt: string } | null {
    try {
      const data = localStorage.getItem(`procheck_sound_${type}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Ignore parse error
    }
    return null;
  }
}

export const soundService = new SoundService();
export default soundService;
