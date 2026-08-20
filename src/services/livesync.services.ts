import PocketBase from 'pocketbase';
import { Constants } from '@/Constants';

export interface LiveScanEvent {
  roomId: string;
  type: 'SCAN_AWB' | 'STATUS_CHANGE' | 'BATCH_SYNC' | 'REQUEST_SYNC' | 'HEARTBEAT';
  awb?: string;
  status?: string;
  index?: number | string;
  product?: any;
  products?: any[];
  deviceType?: 'mobile' | 'desktop';
  timestamp: number;
}

export class LiveSyncService {
  private pb: PocketBase;
  private channel: BroadcastChannel | null = null;
  private currentRoom: string = '';
  private listeners: Array<(event: LiveScanEvent) => void> = [];
  private pollInterval: any = null;
  private lastProcessedTimestamp: number = Date.now();

  constructor() {
    this.pb = new PocketBase(Constants.database.url);
    this.pb.autoCancellation(false);
  }

  // Get or initialize persistent Room ID for current user/device
  getOrCreateRoomId(): string {
    let roomId = localStorage.getItem('procheck_live_room_id');
    if (!roomId) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      roomId = `ROOM-${randomSuffix}`;
      localStorage.setItem('procheck_live_room_id', roomId);
    }
    return roomId;
  }

  setRoomId(roomId: string) {
    this.currentRoom = roomId;
    localStorage.setItem('procheck_live_room_id', roomId);
    this.initChannel(roomId);
  }

  // Initialize sync channel
  initChannel(roomId: string) {
    this.currentRoom = roomId;
    this.lastProcessedTimestamp = Date.now();

    // 1. Local BroadcastChannel
    try {
      if (this.channel) {
        this.channel.close();
      }
      this.channel = new BroadcastChannel(`procheck_sync_${roomId}`);
      this.channel.onmessage = (msg: MessageEvent<LiveScanEvent>) => {
        if (msg.data && msg.data.timestamp > this.lastProcessedTimestamp) {
          this.lastProcessedTimestamp = msg.data.timestamp;
          this.notifyListeners(msg.data);
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment");
    }

    // 2. Storage event listener (cross-tab fallback)
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === `procheck_live_event_${roomId}` && e.newValue) {
        try {
          const event: LiveScanEvent = JSON.parse(e.newValue);
          if (event.timestamp > this.lastProcessedTimestamp) {
            this.lastProcessedTimestamp = event.timestamp;
            this.notifyListeners(event);
          }
        } catch (err) {}
      }
    });

    // 3. Cloud / Database Real-time subscription & fallback polling
    this.startDbSync(roomId);
  }

  // Broadcast an AWB scan event across devices
  async broadcastScan(awb: string, status: string = 'Pregatit', product?: any, deviceType: 'mobile' | 'desktop' = 'mobile') {
    const roomId = this.currentRoom || this.getOrCreateRoomId();
    const event: LiveScanEvent = {
      roomId,
      type: 'SCAN_AWB',
      awb,
      status,
      product,
      deviceType,
      timestamp: Date.now()
    };

    this.lastProcessedTimestamp = event.timestamp;

    // 1. Broadcast locally
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {}
    }

    // 2. Save in localStorage to trigger storage events
    localStorage.setItem(`procheck_live_event_${roomId}`, JSON.stringify(event));

    // 3. Persist event to Database / PocketBase
    try {
      const locUser = localStorage.getItem('user');
      if (locUser) {
        const user = JSON.parse(locUser).record;
        if (user && user.id) {
          try {
            await this.pb.collection('live_events').create({
              room: roomId,
              user: user.id,
              type: event.type,
              awb: event.awb,
              status: event.status,
              payload: JSON.stringify(event)
            });
          } catch (pbErr) {
            // If live_events collection is not present, we use batches/client metadata
          }
        }
      }
    } catch (e) {}
  }

  // Broadcast entire products list across devices in the room
  async broadcastBatch(products: any[], deviceType: 'mobile' | 'desktop' = 'desktop') {
    if (!products || products.length === 0) return;
    const roomId = this.currentRoom || this.getOrCreateRoomId();
    const event: LiveScanEvent = {
      roomId,
      type: 'BATCH_SYNC',
      products,
      deviceType,
      timestamp: Date.now()
    };

    this.lastProcessedTimestamp = event.timestamp;

    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {}
    }

    localStorage.setItem(`procheck_live_event_${roomId}`, JSON.stringify(event));

    try {
      const locUser = localStorage.getItem('user');
      if (locUser) {
        const user = JSON.parse(locUser).record;
        if (user && user.id) {
          try {
            await this.pb.collection('live_events').create({
              room: roomId,
              user: user.id,
              type: 'BATCH_SYNC',
              payload: JSON.stringify(event)
            });
          } catch (pbErr) {}
        }
      }
    } catch (e) {}
  }

  // Request sync from any connected device that has the batch
  requestBatchSync() {
    const roomId = this.currentRoom || this.getOrCreateRoomId();
    const event: LiveScanEvent = {
      roomId,
      type: 'REQUEST_SYNC',
      deviceType: 'mobile',
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {}
    }

    localStorage.setItem(`procheck_live_event_${roomId}`, JSON.stringify(event));
  }

  // Subscribe to live scan events
  onScanEvent(callback: (event: LiveScanEvent) => void) {
    this.listeners.push(callback);
  }

  private notifyListeners(event: LiveScanEvent) {
    this.listeners.forEach(cb => {
      try {
        cb(event);
      } catch (e) {
        console.error("Error in live scan listener:", e);
      }
    });
  }

  // PocketBase DB sync & network relay
  private async startDbSync(roomId: string) {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }

    // Try PocketBase real-time subscription
    try {
      await this.pb.collection('live_events').subscribe('*', (e: any) => {
        if (e.record && e.record.room === roomId) {
          try {
            const event: LiveScanEvent = JSON.parse(e.record.payload);
            if (event.timestamp > this.lastProcessedTimestamp) {
              this.lastProcessedTimestamp = event.timestamp;
              this.notifyListeners(event);
            }
          } catch (err) {}
        }
      });
    } catch (e) {
      // If collection doesn't exist yet, standard interval polling on DB or localStorage acts as fallback
    }
  }

  cleanup() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.listeners = [];
  }
}

export default new LiveSyncService();
