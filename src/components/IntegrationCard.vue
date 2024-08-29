<template>
    <div class="w-64 border rounded-lg shadow-sm p-4 relative">
        <!-- Flag on top left -->
        <div class="absolute top-3 left-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg" alt="Romanian Flag"
                class="w-6 h-4">
        </div>

        <!-- More icon button on top right -->
        <div class="absolute top-3 right-3">
            <button @click="onMoreClick" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 110 1.5.75.75 0 010-1.5zm5.25 0a.75.75 0 110 1.5.75.75 0 010-1.5zm5.25 0a.75.75 0 110 1.5.75.75 0 010-1.5z" />
                </svg>
            </button>
        </div>

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
</template>

<script lang="ts">

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
        }
    },
    methods: {
        onMoreClick() {
            // Handle the click event for the More button
            alert('More options');
        },
        onEditClick() {
            // Handle the click event for the Edit button
            alert('Edit clicked');
        }
    }
};
</script>
