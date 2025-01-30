<script>
  import { onMount } from 'svelte';
  import { Card, Button } from 'flowbite-svelte';
  import { ethers,formatEther } from 'ethers';
  
  import { walletStore } from '../../stores/walletStore'; // Import walletStore

  // Reactive store subscription
  //let $walletStore;

  async function connectWallet() {
      if (window.ethereum) {
          try {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              if (accounts.length > 0) {
                  console.log('Connected to MetaMask with address:', accounts[0]);
                  const provider = new ethers.BrowserProvider(window.ethereum);
                  const balance = await provider.getBalance(accounts[0]);

                  walletStore.set({
                      userAddress: accounts[0],
                      userBalance: balance,
                      isConnected: true,
                      provider
                  });
                  console.log($walletStore.isConnected)
              } else {
                  alert('No Ethereum accounts found');
              }
          } catch (error) {
              console.error('Error connecting to MetaMask:', error);
          }
      } else {
          alert('MetaMask is not installed. Please install it and try again.');
      }
  }
  function disconnectWallet() {
        walletStore.set({
            userAddress: null,
            userBalance: null,
            isConnected: false,
            provider: null
        });
        console.log('Wallet disconnected');
    }
  
  onMount(async () => {
      if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
              const provider = new ethers.BrowserProvider(window.ethereum);
              const balance = await provider.getBalance(accounts[0]);

              walletStore.set({
                  userAddress: accounts[0],
                  userBalance: balance,
                  isConnected: true,
                  provider
              });
          }
      }
  });
</script>

<Card>
    {#if $walletStore.isConnected=== true}
        <div class="flex flex-col gap-4">
            <p class="text-xl text-green-600">
                Successfully connected with account: <strong>{$walletStore.userAddress}</strong>
            </p>
            <ul>
                <li>Your current balance: {formatEther($walletStore.userBalance)} ETH</li>
            </ul>
            <Button
                class="bg-red-600 text-gray-50 shadow-md rounded-md px-3 py-2 text-center"
                on:click={disconnectWallet}
            >
                Disconnect Wallet
            </Button>
        </div>
    {:else}
        <Button
            class="bg-blue-600 text-gray-50 shadow-md rounded-md px-3 py-2 text-center"
            on:click={connectWallet}
        >
            Connect with Wallet
        </Button>
    {/if}
</Card>