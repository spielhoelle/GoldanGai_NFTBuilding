import { writable } from 'svelte/store';

// Store for wallet connection state
export const walletStore = writable({
  provider: null,
  signer: null,
  userAddress: '',
  isConnected: false,
});

