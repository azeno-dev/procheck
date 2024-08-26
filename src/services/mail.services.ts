import { Constants } from "@/Constants";

export default class MailService {
    private _headers: any;
    private _config: any;

    constructor() {
        this._config = Constants.email;

        this._headers = {
            "authorization": "Bearer " + this._config.token,
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*"
        };
    }

    async sendEmail(data: any) {
        try {
            const response = await fetch(`${this._config.api}/sendEmail?transport=${this._config.transporter}`, {
                method: "POST",
                headers: this._headers,
                body: JSON.stringify(data)
            });

            return response.json();
        } catch (err) {
            console.log("Error at sendEmail:", err);
        }
    }

}