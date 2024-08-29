import { defineStore } from "pinia";
import ApiService from '@/services/api.services.js';
import { ref } from "vue";

interface AuthStore {
    authUser: any | null;
    userConfig: any | null;
}

export interface Integration {
    id: string;
    name: string;
    collectionId: string;
    active: boolean;
    type: string;
    doc: string | null;
    image_url: string | null;
    doc_url: string | null;
    site_url: string | null;
    service: any | null;
}

export const useAuthStore = defineStore("auth", () => {
    const apiService: ApiService = new ApiService();
    const user = ref<any | null>(null);
    const config = ref<any | null>(null);
    const integrations = ref<Integration[] | null>(null);
    const isAuthenticated = ref(false);
    
    function getUser(): any {
        apiService.getToken();
        user.value = apiService.pb.authStore.model;

        var locUser = localStorage.getItem("user");
        if (user && user.value) {
            isAuthenticated.value = true;
        } else if (locUser) {
            user.value = JSON.parse(locUser).record;
        }

        return user.value;
    }

    function getIntegrations(): any {
        apiService.getToken();
        user.value = apiService.pb.authStore.model;

        var locIntegrations = localStorage.getItem("integrations");
        if (locIntegrations) {
            integrations.value = JSON.parse(locIntegrations);
        }

        return integrations.value;
    }    

    async function login(email: string, password: string) {
        try {
            user.value = await apiService.login(email, password);
            const client = await apiService.getClientByCurrentUser();
            // console.log("client: ", client);
            if (client && client.expand && client.expand.config) {
                config.value = client.expand.config;
                integrations.value = JSON.parse(JSON.stringify(client.expand.integrations)) as Integration[];
                localStorage.setItem("integrations", JSON.stringify(integrations.value));
            } 

            return user.value;
        } catch (error) {
            console.log("error: ", error);
            throw error;
        }
    }

    function logout() {
        apiService.logout();
        
        user.value = null;
        config.value = null;
        integrations.value = null;
        isAuthenticated.value = false;

        localStorage.clear();
    }    

    return {
        user,
        config,
        integrations,
        isAuthenticated,
        getUser,
        getIntegrations,
        login,
        logout,
      };    
})

export default useAuthStore;