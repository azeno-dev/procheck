import { defineStore } from "pinia";
import ApiService from '@/services/api.services.js';
import { ref } from "vue";

interface AuthStore {
    authUser: any | null;
    userConfig: any | null;
}

export const useAuthStore = defineStore("auth", () => {
    const apiService: ApiService = new ApiService();
    const user = ref<any | null>(null);
    const config = ref<any | null>(null);
    const isAuthenticated = ref(false);
    
    function getUser(): any {
        apiService.getToken();
        user.value = apiService.pb.authStore.model;

        if (user) {
            isAuthenticated.value = true;
        }

        return user.value;
    }

    async function login(email: string, password: string) {
        try {
            user.value = await apiService.login(email, password);
            const client = await apiService.getClientByCurrentUser();
            if (client && client.expand && client.expand.config) {
                config.value = client.expand.config;
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
    }    

    return {
        user,
        config,
        isAuthenticated,
        getUser,
        login,
        logout,
      };    
})

export default useAuthStore;