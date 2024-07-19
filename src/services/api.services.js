import PocketBase from 'pocketbase';
import { Constants } from '../Constants.mjs';
import { useCookies } from "vue3-cookies"

export default class ApiService {

    cookies = useCookies().cookies;
    pb = new PocketBase(Constants.database.url);

    constructor(){ 
        this.pb.autoCancellation(false);
    }

    async registration(name, username, email, password) {
        return await this.pb.collection('users').create({
            name: name,
            username: username,
            email: email,
            password: password,
            passwordConfirm: password,
        });
    }

    async isVerified(email) {
        try {
            return await pb.collection('users').requestVerification(email);
        } catch (err) {
            console.log("error.isVerified: ", err);
        }
    }

    async login(email, password) {
        try {
            this.pb.authStore.clear();

            await this.pb.collection('users').authWithPassword(email, password);

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

    setToken(user) {
        this.cookies.set("authStore", user.exportToCookie());
    }

    getToken() {
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

    logout() {
        this.pb.authStore.clear();

        if (this.cookies.isKey("authStore")) {
            this.cookies.remove("authStore");
        }
    }

    async getClientByCurrentUser() {
        try {
            const record = await this.pb.collection('clients').getOne(this.pb.authStore.model.client, {
                expand: 'config,user',
            });

            return JSON.parse(JSON.stringify(record));
        } catch (err) {
            console.log("error.getClientByCurrentUser: ", err);
        }
    }

    // async getColumn(columnId) {
    //     try {
    //         // console.log("this.pb.authStore.model.client:", this.pb.authStore.model);
    //         const record = await this.pb.collection('columns').getOne(columnId);

    //         return JSON.parse(JSON.stringify(record));
    //     } catch (err) {
    //         console.log("error.getColumn: ", err);
    //     }
    // }




    // async getClientByCurrentUser2(client) {
    //     try {
    //         // console.log("this.client:", client);
    //         const record = await this.pb.collection('clients').getOne(client, {
    //             expand: 'config,users,views,views.columns,defaultView',
    //             keepalive: false,
    //         });

    //         return JSON.parse(JSON.stringify(record));
    //     } catch (err) {
    //         console.log("error.getClientByCurrentUser: ", err);
    //     }
    // }   
    
    // async getViewConfigByCurrentUser(client, type) {
    //     try {
    //         // console.log("this.client:", client);
    //         // console.log("this.type:", type);
    //         const record = await this.pb.collection('viewConfig').getFirstListItem(`client="${client}" && type="${type}"`, {
    //             expand: 'client,client.config,views,views.columns,functions',
    //             keepalive: false,
    //         });

    //         return JSON.parse(JSON.stringify(record));
    //     } catch (err) {
    //         console.log("error.getViewConfigByCurrentUser: ", err);
    //     }
    // }        
}