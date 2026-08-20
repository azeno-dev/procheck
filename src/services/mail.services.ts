import { Constants } from "@/Constants";
import { getClientAutoReplyTemplate, getAdminNotificationTemplate, type ContactFormData } from "./templates/emailTemplates";

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
            throw err;
        }
    }

    /**
     * Sends both the Romanian confirmation to the client and the notification to contact@azeno.ro
     */
    async sendContactFormEmails(formData: ContactFormData): Promise<{ clientSent: boolean; adminSent: boolean }> {
        const clientEmailData = {
            from: this._config.form || "contact@azeno.ro",
            to: formData.email,
            subject: "Am primit mesajul tău - Echipa ProCheck / Azeno",
            body: getClientAutoReplyTemplate(formData)
        };

        const adminEmailData = {
            from: this._config.form || "contact@azeno.ro",
            to: "contact@azeno.ro",
            subject: `🔔 Mesaj nou de la ${formData.name} - Formular Contact ProCheck`,
            body: getAdminNotificationTemplate(formData)
        };

        const results = await Promise.allSettled([
            this.sendEmail(clientEmailData),
            this.sendEmail(adminEmailData)
        ]);

        return {
            clientSent: results[0].status === 'fulfilled',
            adminSent: results[1].status === 'fulfilled'
        };
    }
}