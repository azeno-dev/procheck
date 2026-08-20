import { Constants, type Sameday } from "@/Constants";
import moment from 'moment';

export default class SamedayService {
    private _config: any;
    private _headers: any;
    private _AUTH_USER: string = "X-AUTH-USERNAME";
    private _AUTH_PASS: string = "X-AUTH-PASSWORD";
    private _TOKEN: string = "X-AUTH-TOKEN";
    private _EXPIRE_AT: string = "expire_at";

    constructor(config: any) {
        this._config = config;

        this._headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*"
        };
    }

    async auth(user: string, pass: string) {
        try {
            const authHeader = this._headers;
            authHeader[this._AUTH_USER] = user;
            authHeader[this._AUTH_PASS] = pass;

            const response = await fetch(`/sameday/authenticate`, {
                method: "POST",
                headers: authHeader,
                mode: "cors",
                credentials: "include",
            });

            // console.log("response: ", response);
            if (response && response.ok) {
                const data = await response.json();
                console.log("data: ", data);
                if (data) {
                    this._headers[this._TOKEN] = data.token;
                    this._headers[this._EXPIRE_AT] = data.expire_at;

                }
            }

        } catch (err) {
            console.log("Error at auth:", err);
        }
    }

    async getData(): Promise<any[]> {     
        if (!this.tokenExpired() && this._config) {
            await this.auth(this._config.user || this._config.username, this._config.password || this._config.pass);
        }

        try {
            const result: any[] = [];

            const startHour = moment().startOf('day').hour(6); // 6:00 AM today
            const endHour = moment(); // Current time
            
            // Loop from 6 AM to now, hour by hour
            let currentHour = startHour.clone();
            
            while (currentHour.isBefore(endHour)) {
                let rangeStart = currentHour.toDate();
                let nextHour = currentHour.add(1, 'hour');
                let rangeEnd = nextHour.toDate();

                const response = await this.getDataTimeSpan(rangeStart, rangeEnd);
                if (response && Array.isArray(response)) {
                    result.push(...response);
                }
            }
            
            return result;
        } catch (err) {
            console.log("Error at getData:", err);
            return [];
        }        
    }

    async getDataTimeSpan(startTime: Date, endTime: Date) {
        if (!this.tokenExpired()) {
            await this.auth(this._config.user, this._config.pass);
        }

        const d_startTime = startTime.getTime() / 1000;
        const d_endTime = endTime.getTime() / 1000;

        try {
            const response = await fetch(`${this.getApiUrl()}/client/status-sync?startTimestamp=${d_startTime}&endTimestamp=${d_endTime}`, {
                method: "POST",
                headers: this._headers,
                mode: "no-cors",
            });

            return response.json();
        } catch (err) {
            console.log("Error at sendEmail:", err);
        }
    }

    tokenExpired() {
        if (this._headers[this._TOKEN] && this._headers[this._EXPIRE_AT]) {
            if (this._config) {
                return (new Date(this._headers[this._EXPIRE_AT])) < (new Date());
            }
        }

        console.log("this._headers: ", this._headers);
        return false;
    }

    getApiUrl() {
        return Constants.sameday.api + "/" + Constants.sameday.pref;
    }
}