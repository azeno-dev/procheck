import Peer, { type DataConnection } from 'peerjs';
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
  private pb: PocketBase = new PocketBase(Constants.database.url);
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private channel: BroadcastChannel | null = null;
  private currentRoom: string = '';
  private listeners: Array<(event: LiveScanEvent) => void> = [];
  private lastProcessedTimestamp: number = 0;
  private isHost: boolean = false;
  private reconnectTimer: any = null;

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

  getRoomId(): string {
    return this.currentRoom || this.getOrCreateRoomId();
  }

  // Initialize sync channel & WebRTC Peer
  initChannel(roomId: string) {
    this.currentRoom = roomId;
    this.lastProcessedTimestamp = Date.now();

    // 1. Local BroadcastChannel for same-device multi-tab
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

    // 3. WebRTC Direct P2P Sync
    this.initPeer(roomId);
  }

  private cleanPeerId(roomId: string): string {
    return 'procheck-' + roomId.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private initPeer(roomId: string) {
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    this.connections.clear();

    const hostPeerId = this.cleanPeerId(roomId);

    try {
      this.peer = new Peer(hostPeerId, {
        debug: 1,
      });

      this.peer.on('open', () => {
        this.isHost = true;
      });

      this.peer.on('connection', (conn: DataConnection) => {
        this.setupConnection(conn);
      });

      this.peer.on('error', (err: any) => {
        // If ID is already taken, this client is a mobile/secondary peer connecting to the host
        if (err.type === 'unavailable-id') {
          this.isHost = false;
          if (this.peer) {
            try { this.peer.destroy(); } catch (e) {}
          }
          const clientPeerId = `${hostPeerId}-c-${Math.floor(1000 + Math.random() * 9000)}`;
          this.peer = new Peer(clientPeerId, { debug: 1 });

          this.peer.on('open', () => {
            if (this.peer) {
              const conn = this.peer.connect(hostPeerId, { reliable: true });
              this.setupConnection(conn);
            }
          });

          this.peer.on('connection', (conn: DataConnection) => {
            this.setupConnection(conn);
          });
        }
      });
    } catch (err) {
      console.warn("PeerJS init error:", err);
    }
  }

  private setupConnection(conn: DataConnection) {
    conn.on('open', () => {
      this.connections.set(conn.peer, conn);

      // If mobile connects, request batch sync from host
      if (!this.isHost) {
        this.requestBatchSync();
      }
    });

    conn.on('data', (data: any) => {
      try {
        const event = typeof data === 'string' ? JSON.parse(data) : data;
        if (event && event.timestamp > this.lastProcessedTimestamp) {
          this.lastProcessedTimestamp = event.timestamp;
          this.notifyListeners(event);
        }
      } catch (e) {
        console.error("Error processing peer data:", e);
      }
    });

    conn.on('close', () => {
      this.connections.delete(conn.peer);
    });

    conn.on('error', () => {
      this.connections.delete(conn.peer);
    });
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
    this.sendEvent(event);
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
    this.sendEvent(event);
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

    this.sendEvent(event);
  }

  private sendEvent(event: LiveScanEvent) {
    // 1. Direct WebRTC send to all connected peers
    this.connections.forEach(conn => {
      if (conn.open) {
        try {
          conn.send(event);
        } catch (e) {}
      }
    });

    // 2. BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (e) {}
    }

    // 3. Storage event fallback
    localStorage.setItem(`procheck_live_event_${event.roomId}`, JSON.stringify(event));

    // 4. Persist SCAN_AWB events to PocketBase live_events (for history/audit)
    if (event.type === 'SCAN_AWB') {
      try {
        const locUser = localStorage.getItem('user');
        if (locUser) {
          const parsed = JSON.parse(locUser);
          if (parsed?.token && parsed?.record) {
            this.pb.authStore.save(parsed.token, parsed.record);
          }
        }

        const payload: any = {
          room: event.roomId,
          type: event.type,
          awb: event.awb || '',
          status: event.status || '',
          payload: event
        };

        // Attach user relation if logged in
        const userId = locUser ? JSON.parse(locUser)?.record?.id : null;
        if (userId) payload.user = userId;

        this.pb.collection('live_events').create(payload).catch(() => {
          // Silently ignore if live_events collection not available
        });
      } catch (e) {}
    }
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

  cleanup() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.peer) {
      try { this.peer.destroy(); } catch (e) {}
      this.peer = null;
    }
    this.connections.clear();
    this.listeners = [];
  }
}

export default new LiveSyncService();
