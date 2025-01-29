import { writable } from "svelte/store";
import { walletStore } from "../stores/walletStore"; // Import walletStore

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

interface WalletState {
  account?: string;
}

const getMetaMaskPresent = (): boolean =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

const getLocalStorageState = (): WalletState => {
  if (typeof window === "undefined") {
    return { account: "" };
  }
  return JSON.parse(localStorage.getItem("walletState") || '{"account": ""}');
};

const saveToLocalStorage = (state: WalletState): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("walletState", JSON.stringify(state));
  }
};

export function MetaMaskStore() {
  const loaded: Writable<boolean> = writable(false);
  const isMetaMaskPresent: Writable<boolean> = writable(getMetaMaskPresent());

  // Use walletStore to manage wallet state
  const walletState = walletStore;

  const handleAccountsChanged = (newAccounts: string[]) => {
    if (newAccounts && newAccounts.length > 0) {
      const account = newAccounts[0];
      // Update walletStore with the new account
      walletState.update(state => ({
        ...state,
        userAddress: account,
        isConnected: true,
      }));
    } else {
      // If no account, update walletStore to reset
      walletState.update(state => ({
        ...state,
        userAddress: '',
        isConnected: false,
      }));
    }
  };

  const requestAccounts = async (): Promise<string[]> => {
    if (!getMetaMaskPresent()) {
      throw new Error("MetaMask is not present");
    }
    return window.ethereum?.request({
      method: "eth_requestAccounts",
    }) as Promise<string[]>;
  };

  const init = async (): Promise<void> => {
    if (!getMetaMaskPresent()) return;

    const localState = getLocalStorageState();
    if (localState.account) {
      try {
        const accountResponse = await requestAccounts();
        if (accountResponse.length > 0) {
          const account = accountResponse[0];
          // Set walletStore with account info
          walletState.update(state => ({
            ...state,
            userAddress: account,
            isConnected: true,
          }));

          window.ethereum?.on("accountsChanged", handleAccountsChanged);
        }
      } catch (error) {
        console.error("Error during MetaMask initialization", error);
      }
    }

    loaded.set(true);

    walletState.subscribe(saveToLocalStorage); // Save to localStorage whenever walletState changes
  };

  const connect = async (): Promise<void> => {
    try {
      const accountResponse = await requestAccounts();
      if (accountResponse.length > 0) {
        const account = accountResponse[0];
        // Set walletStore with account info
        walletState.update(state => ({
          ...state,
          userAddress: account,
          isConnected: true,
        }));

        window.ethereum?.on("accountsChanged", handleAccountsChanged);
      }
    } catch (error) {
      console.error("Error connecting MetaMask", error);
    }
  };

  const disconnect = (): void => {
    walletState.set({
      provider: null,
      signer: null,
      userAddress: '',
      isConnected: false,
    });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("walletState");
    }
  };

  return {
    isMetaMaskPresent,
    loaded,
    connect,
    init,
    disconnect,
  };
}
