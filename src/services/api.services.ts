import PocketBase from 'pocketbase';
import { Constants } from '@/Constants';
import { useCookies } from "vue3-cookies"

interface User {
    name: string;
    username: string;
    email: string;
    password: string;
}

export default class ApiService {
    cookies: any;
    pb: PocketBase;

    constructor() {
        this.cookies = useCookies().cookies;
        this.pb = new PocketBase(Constants.database.url);
        this.pb.autoCancellation(false);
    }

    async registration(name: string, username: string, email: string, password: string): Promise<any> {
        return await this.pb.collection('users').create({
            name: name,
            username: username,
            email: email,
            password: password,
            passwordConfirm: password,
        });
    }

    async isVerified(email: string): Promise<any> {
        try {
            return await this.pb.collection('users').requestVerification(email);
        } catch (err) {
            console.log("error.isVerified: ", err);
        }
    }

    async login(email: string, password: string): Promise<any> {
        try {
            this.pb.authStore.clear();

            var user = await this.pb.collection('users').authWithPassword(email, password);
            localStorage.setItem("user", JSON.stringify(user));

            const expires = new Date();
            expires.setTime(expires.getTime() + (90 * 60 * 1000));
            if (this.pb.authStore.token) {
                this.pb.authStore.save(this.pb.authStore.token, this.pb.authStore.model);
                this.setToken(this.pb.authStore);
                // this.pb.authStore.exportToCookie({ secure: true, path: "/", expires: expires }, "pb_auth");

                return this.pb.authStore;
            }

            return null;
        } catch (err) {
            console.log("error.login: ", err);
            throw err;
        }
    }

    setToken(user: any): void {
        this.cookies.set("authStore", user.exportToCookie());
    }

    getToken(): string | null {
        if (this.pb && this.pb.authStore && this.pb.authStore.token.length > 0 && this.pb.authStore.isValid) {
            // console.log("token1: ", this.pb.authStore.token);
            // console.log("authStore1: ", this.pb.authStore.model);
            return this.pb.authStore.token;
        } else if (this.cookies.isKey("authStore")) {
            const val = this.cookies.get("authStore");
            const token = val["pb_auth"];
            // console.log("token2: ", token);
            this.pb.authStore.loadFromCookie(token, 'pb_auth');

            return token;
        }

        return null;
    }

    logout(): void {
        this.pb.authStore.clear();

        if (this.cookies.isKey("authStore")) {
            this.cookies.remove("authStore");
        }
    }

    async getClientByCurrentUser(): Promise<any> {
        try {
            const locUser = localStorage.getItem('user');
            let user = undefined;
            if (locUser) {
                user = JSON.parse(locUser).record;
            }
            console.log("user: ", user);

            if (user) {
                const record = await this.pb.collection('clients').getFirstListItem(`user="${user.id}"`, {
                    // expand: 'config,user',
                });

                return JSON.parse(JSON.stringify(record));
            } else {
                return null;
            }
        } catch (err) {
            console.log("error.getClientByCurrentUser: ", err);
        }
    }
}