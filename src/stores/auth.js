import { defineStore } from "pinia";
import ApiService from '../services/api.services.js';

const apiService = new ApiService();

export const useAuthStore = defineStore("auth", {
    state: () => ({
        authUser: null,
        userConfig: null
    }),
    getters: {
        user: (state) => state.authUser,
        config: (state) => state.userConfig,
    },
    actions: {
        getToken() {
            apiService.getToken();
        },
        getUser() {
            apiService.getToken();
            this.authUser = apiService.pb.authStore.model;

            return this.authUser;
        },
        setConfig(config) {
            this.userConfig = config;
        },
        async setData() {
            const customer = await apiService.getClientByCurrentUser();
            if (customer && customer.expand && customer.expand) {
                this.userConfig = customer.expand.config;

                return customer.expand;
            }
        },
        async login(email, password) {
            try {
                this.authUser = await apiService.login(email, password);
                const customer = await apiService.getClientByCurrentUser();
                if (customer && customer.expand && customer.expand.config) {
                    this.userConfig = customer.expand.config;
                }

                return this.authUser;
            } catch (error) {
                console.log("error: ", error);
                throw error;
            }
        },
        async signup(name, username, email, password) {
            const newUser = await apiService.registration(name, username, email, password);
            if (newUser && newUser.id) {
                await apiService.isVerified(email);
                const user = await apiService.login(email, password);
                this.authUser = user.model;

                const customer = await apiService.getClientByCurrentUser();
                if (customer && customer.expand && customer.expand.config) {
                    this.userConfig = customer.expand.config;
                }
            }

            return this.authUser;
        },
        logout() {
            apiService.logout();
            
            this.authUser = null;
            this.userViews = null;
        }
    }
})