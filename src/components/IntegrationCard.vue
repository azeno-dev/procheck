<template>
    <div class="w-64 border rounded-lg shadow-sm p-4 relative">
        <!-- Flag on top left -->
        <div class="absolute top-3 left-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg" alt="Romanian Flag"
                class="w-6 h-4">
        </div>

        <!-- More icon button on top right -->
        <div class="absolute top-3 right-3">
            <button @click="onMoreClick($event)" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5zm0 5.25a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </button>
        </div>
        <Menu ref="menu" :model="items" :popup="true" />

        <!-- Image on the center -->
        <div class="flex justify-center items-center w-[200px] h-[200px] p-5">
            <img src="https://sameday.ro/app/themes/samedaytwo/public/images/logo/logo-sameday.svg" alt="Sameday Logo"
                class="h-16">
        </div>

        <!-- Status on left bottom -->
        <div class="absolute bottom-3 left-3 text-gray-700">
            <span class="flex items-center">
                <svg class="w-4 h-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ active ? 'Conectat' : 'Deconectat' }}
            </span>
        </div>

        <!-- Edit icon button on right bottom -->
        <div class="absolute bottom-3 right-3">
            <button @click="onEditClick" class="text-blue-500 hover:text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487a2.25 2.25 0 113.182 3.182l-9.674 9.674a4.5 4.5 0 01-1.79 1.09l-3.027.908a.75.75 0 01-.926-.926l.908-3.027a4.5 4.5 0 011.09-1.79l9.674-9.674z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.5l-3-3" />
                </svg>
                <span class="ml-1">Editează</span>
            </button>
        </div>
    </div>

    <Dialog v-model:visible="showDocDialog" @close="showDocDialog = false" maximizable modal header="Documentație"
        :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="m-0" v-html="doc">
        </div>
    </Dialog>

    <Dialog v-model:visible="showEditDialog" @close="showEditDialog = false" header="Editare" modal
        :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Introduceți datele de conectare</span>

        <div class="flex items-center gap-4 mb-4">
            <label for="api_url" class="font-semibold w-24">API url</label>
            <InputText id="api_url" type="text" :value="service.api_url" class="flex-auto" autocomplete="off"
                readonly="true" disabled="true" />
        </div>
        <div class="flex items-center gap-4 mb-4">
            <label for="user" class="font-semibold w-24">Utilizator</label>
            <InputText id="user" type="text" :value="service.user" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
            <label for="password" class="font-semibold w-[140px]">Parolă</label>
            <!-- <InputText id="password" type="password" :value="service.password" class="flex-auto" autocomplete="off" /> -->
            <InputGroup>
                <InputText id="password" :type="passwordFieldType"  :value="service.password" placeholder="Enter your password"  class="flex-auto" autocomplete="off" />
                <InputGroupAddon addonType="append" @click="togglePasswordVisibility">
                    <i :class="passwordFieldType === 'password' ? 'pi pi-eye' : 'pi pi-eye-slash'" style="cursor: pointer;"></i>
                </InputGroupAddon>
            </InputGroup>            
        </div>

        <div class="flex justify-end gap-2">
            <Button type="button" label="Anulează" severity="secondary" @click="showEditDialog = false"></Button>
            <Button type="button" label="Salvează" @click="onSaveServiceClick"></Button>
        </div>
    </Dialog>

</template>

<script lang="ts">
import ApiService from '@/services/api.services.js';

const apiService: ApiService = new ApiService();

export default {
    props: {
        imageUrl: {
            type: String,
            required: true,
            default: ''
        },
        active: {
            type: Boolean,
            required: true,
            default: false
        },
        service: {
            type: Object,
            required: true,
            default: {}
        },
        doc: {
            type: String,
            default: ''
        },
        site_url: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showDocDialog: false,
            showEditDialog: false,
            passwordFieldType: 'password',
            items: [
                {
                    label: "Documentație",
                    icon: "pi pi-fw pi-book",
                    command: () => this.setShowDocDialog()
                },
                {
                    label: "Înregistrare",
                    icon: "pi pi-fw pi-user-plus",
                    command: () => window.open(this.site_url, '_blank')
                }
            ],
        }
    },
    methods: {
        onMoreClick(event: any) {
            // Handle the click event for the More button
            // alert('More options');
            if (this.$refs.menu) {
                const menu = (this.$refs.menu as any);
                menu.toggle(event);
            }
        },
        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        setShowDocDialog() {
            this.showDocDialog = true;
        },
        onEditClick(event: any) {
            this.showEditDialog = true;
        },
        onSaveServiceClick() {
            // apiService.saveIntegration(this.);
            this.showEditDialog = false;
        }
    }
};
</script>
