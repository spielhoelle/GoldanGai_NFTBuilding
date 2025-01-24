
import { writable } from 'svelte/store';
// Create a writable store for the image URL
export const imageStore = writable({
    url: '',
    prompt: '',
    auther: null,
    date: null,
    model: '',
    genInfo: {}, // Initialize as an empty object or your desired default value
});