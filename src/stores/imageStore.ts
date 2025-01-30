import { writable } from 'svelte/store'

// Define the type for an image object
export interface Image {
  url: string
  prompt: string
  author: string | null
  date: Date | null
  model: string
  genInfo: Record<string, any> // Adjustable for your needs
  path: string
  id: number // number  in image storage for toggle and minting the correct image 
}

// Helper function to check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const testKey = '__test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

// Load initial data from localStorage if available
let initialImageStore: Image[] = []
if (isLocalStorageAvailable()) {
  initialImageStore = JSON.parse(localStorage.getItem('imageStore') || '[]').map((item: any) => ({
    ...item,
    date: item.date ? new Date(item.date) : null,
  }))
}

// Create a writable store for an array of images
export const imageStore = writable<Image[]>(initialImageStore)

if (isLocalStorageAvailable()) {
  // Persist store changes to localStorage
  imageStore.subscribe((value) => {
    localStorage.setItem('imageStore', JSON.stringify(value))
  })
}
