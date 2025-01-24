import { writable } from "svelte/store";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

const getMetaMaskPresent = (): boolean =>
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

interface WalletState {
  account?: string;
}


const getLocalStorageState = (): WalletState => {
  // if not in browser, return empty object
  if (typeof window === "undefined") {
    return {};
  }

  return JSON.parse(localStorage.getItem("walletState") || "{}");
};

export function MetaMaskStore() {
  const loaded: Writable<boolean> = writable(false);
  const isMetaMaskPresent: Writable<boolean> = writable(getMetaMaskPresent());
  const walletState: Writable<WalletState> = writable(getLocalStorageState());

  const handleAccountsChanged = (newAccounts: string[]) => {
    if (Array.isArray(newAccounts) && newAccounts.length > 0 && newAccounts[0]) {
      const account = newAccounts[0];
      walletState.set({ account });
    } else {
      walletState.set({});
    }
  };

  /**
   * The `init` function checks if MetaMask is present and connected, and if so, automatically connects
   * to it, otherwise it waits for the user to click connect.
   */
  const init = async (): Promise<void> => {
    // if MetaMask is not present, do nothing
    if (!getMetaMaskPresent()) {
      return;
    }

    // if we have an account in local storage, assume the user left the page with MetaMask connected
    const localState = getLocalStorageState();
    if (localState.account) {
      const accountResponse = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });

      if (accountResponse && accountResponse.length > 0) {
        const account = accountResponse[0];
        walletState.set({ account });

        // watch for account changes from the extension
        window.ethereum?.on("accountsChanged", handleAccountsChanged);
      }
    }

    // if MetaMask is present but not previously connected, set loaded to true
    setTimeout(() => {
      loaded.set(true);
    }, 500);

    // update local storage whenever the wallet state changes
    walletState.subscribe((state) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("walletState", JSON.stringify(state));
      }
    });
  };

  const connect = async (): Promise<void> => {
    // if MetaMask is not present, do nothing
    if (!getMetaMaskPresent()) {
      return;
    }

    // if MetaMask is present but not connected, connect
    const accountResponse = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });

    if (accountResponse && accountResponse.length > 0) {
      const account = accountResponse[0];
      walletState.set({ account });

      // watch for account changes from the extension
      window.ethereum?.on("accountsChanged", handleAccountsChanged);
    }
  };

  const disconnect = (): void => {
    WalletState.set({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("walletState");
    }
  };

  const mintNFT = async (contractAddress: string, contractABI: any): Promise<void> => {
    const { signer, account } = get(walletState);

    if (!signer || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the `mint` function on the contract
      const tx = await contract.mint(account); // Adjust this based on your contract's mint function
      console.log("Transaction sent:", tx.hash);

      // Wait for the transaction to be mined
      await tx.wait();
      console.log("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  };


  return {
    isMetaMaskPresent,
    walletState,
    loaded,
    connect,
    init,
    disconnect,
    mintNFT, // Expose the mintNFT function
  };
}
