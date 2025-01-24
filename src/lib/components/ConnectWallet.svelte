<script>
    import { onMount } from 'svelte';
    import { Card, Button } from 'flowbite-svelte';
    import { get } from 'svelte/store'; // Import `get` to read from the store
    import { MetaMaskStore } from '$lib/connect_crypto';
   
    import { walletStore } from '../../stores/walletStore'; // Import walletStore
    const { isMetaMaskPresent,
            loaded,
            connect,
            init,
            disconnect 
    } = MetaMaskStore();
    onMount(() => {
      init(); // Initialize on mount
    });
  </script>
  
  <main>
    <Card>
      {#if $loaded} 
        {#if $isMetaMaskPresent} 
          {#if $walletStore.userAddress}
            <!-- User is connected, show address and a button to disconnect -->
            <Button on:click={disconnect}>Disconnect ({$walletStore.userAddress})</Button>
          {:else}
            <!-- User is not connected, show connect button -->
            <Button on:click={connect}>Connect Wallet</Button>
          {/if}
        {:else}
          <!-- MetaMask is not present, show error message -->
          <p>MetaMask is not installed. Please install it to connect your wallet.</p>
        {/if}
      {:else}
        <!-- Loading state -->
        <p>Loading...</p>
      {/if}
    </Card>
  </main>
  