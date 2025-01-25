import { writable } from 'svelte/store';

// Store for wallet connection state
export const walletStore = writable({
  userAddress: null,       // Wallet address of the user
  userBalance: null,       // Wallet balance in Wei
  isConnected: false,      // Boolean to check if the wallet is connected
  provider: null           // Ethereum provider instance (e.g., ethers.js provider)
});

