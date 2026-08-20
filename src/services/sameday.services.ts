import moment from 'moment';

export type SamedayTimeRange = 'today' | '24h' | '3days' | '7days' | '30days';

export interface SamedayParcel {
  id?: string | number;
  awbNumber: string;
  date?: string;
  status?: string;
  clientName?: string;
  clientPhone?: string;
  county?: string;
  city?: string;
  observation?: string;
  [key: string]: any;
}

export default class SamedayService {
  private _config: any;
  private _token: string | null = null;
  private _expireAt: Date | null = null;

  constructor(config?: any) {
    this._config = config || {};
  }

  setConfig(config: any) {
    this._config = config || {};
  }

  async auth(user?: string, pass?: string): Promise<boolean> {
    const u = user || this._config.user || this._config.username;
    const p = pass || this._config.password || this._config.pass;

    if (!u || !p) {
      console.warn("Sameday credentials not configured.");
      return false;
    }

    try {
      const response = await fetch(`/sameday/api/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-AUTH-USERNAME": u,
          "X-AUTH-PASSWORD": p
        }
      });

      if (response && response.ok) {
        const data = await response.json();
        if (data && data.token) {
          this._token = data.token;
          if (data.expire_at) {
            this._expireAt = new Date(data.expire_at);
          }
          return true;
        }
      } else {
        const errorText = await response.text();
        console.error("Sameday auth failed:", response.status, errorText);
      }
    } catch (err) {
      console.error("Error during Sameday auth:", err);
    }
    return false;
  }

  isTokenValid(): boolean {
    if (!this._token) return false;
    if (this._expireAt && this._expireAt <= new Date()) return false;
    return true;
  }

  async ensureAuth(): Promise<boolean> {
    if (this.isTokenValid()) return true;
    return await this.auth();
  }

  async getData(timeRange: SamedayTimeRange = 'today'): Promise<SamedayParcel[]> {
    const isAuthed = await this.ensureAuth();
    if (!isAuthed) {
      console.warn("Could not authenticate with Sameday API.");
      return [];
    }

    let startTime = moment().startOf('day');
    const endTime = moment();

    if (timeRange === '24h') {
      startTime = moment().subtract(24, 'hours');
    } else if (timeRange === '3days') {
      startTime = moment().subtract(3, 'days').startOf('day');
    } else if (timeRange === '7days') {
      startTime = moment().subtract(7, 'days').startOf('day');
    } else if (timeRange === '30days') {
      startTime = moment().subtract(30, 'days').startOf('day');
    }

    const parcelsMap = new Map<string, SamedayParcel>();
    let currentSlice = startTime.clone();

    // Sameday requires max 2-hour slice for status-sync
    while (currentSlice.isBefore(endTime)) {
      const sliceStart = currentSlice.clone();
      const sliceEnd = moment.min(currentSlice.clone().add(2, 'hours'), endTime);

      const items = await this.getDataTimeSpan(sliceStart.toDate(), sliceEnd.toDate());
      if (Array.isArray(items)) {
        for (const item of items) {
          const awb = (item.awbNumber || item.awb || item.parcelAwbNumber || '').toString().trim();
          if (awb) {
            parcelsMap.set(awb, {
              awbNumber: awb,
              date: item.date || item.statusDate || sliceEnd.format('DD.MM.YYYY'),
              status: item.status || item.statusState || 'Nepregatit',
              clientName: item.recipientName || item.clientName || item.contactPerson || '',
              clientPhone: item.recipientPhone || item.clientPhone || item.phone || '',
              county: item.recipientCounty || item.county || '',
              city: item.recipientCity || item.city || '',
              observation: item.observation || item.observations || item.reason || '',
              ...item
            });
          }
        }
      }

      currentSlice.add(2, 'hours');
    }

    return Array.from(parcelsMap.values());
  }

  async getDataTimeSpan(startTime: Date, endTime: Date): Promise<any[]> {
    if (!this.isTokenValid()) {
      await this.ensureAuth();
    }

    const startTimestamp = Math.floor(startTime.getTime() / 1000);
    const endTimestamp = Math.floor(endTime.getTime() / 1000);

    const headers: Record<string, string> = {
      "Accept": "application/json",
      "X-AUTH-TOKEN": this._token || ''
    };

    // Primary endpoint: /api/client/status-sync
    try {
      const url = `/sameday/api/client/status-sync?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`;
      const response = await fetch(url, {
        method: "GET",
        headers
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.statuses)) return data.statuses;
      }
    } catch (e) {
      console.warn("Error calling /api/client/status-sync, trying fallback...", e);
    }

    // Fallback endpoint: /api/client/awb/status-sync
    try {
      const fallbackUrl = `/sameday/api/client/awb/status-sync?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: "GET",
        headers
      });

      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.statuses)) return data.statuses;
      }
    } catch (err) {
      console.error("Error at getDataTimeSpan:", err);
    }

    return [];
  }
}